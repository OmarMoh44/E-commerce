import prisma from "@DB";
import { TrackingUpdate } from "@models/trackingUpdate";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { GraphQLError } from "graphql";
import { findCartByUser } from "./cart.service";
import { deleteCartItems } from "./cartItem.service";
import { createOrderItems } from "./orderItem.service";
import { OrderItemData } from "@models/orderItemData";
import { createPayment } from "./payment.service";


export async function findOrdersByUser(buyerId: number) {
    return await prisma.order.findMany({
        where: { user_id: buyerId }
    });
}

export async function createOrder(userId: number, addressId: number, totalAmount: number) {
    try {
        return await prisma.order.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                address: {
                    connect: { id: addressId }
                },
                total_amount: totalAmount
            }
        });
    } catch (e) {
        console.log("Error in creating cart");
        throw new GraphQLError("Error in creating cart", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }

}

export async function processOrder(userId: number, paymentMethod: PaymentMethod, addressId: number) {
    const cart = await findCartByUser(userId);
    if (cart.items.length === 0) {
        throw new GraphQLError("Cart is empty", {
            extensions: { code: 'BAD_REQUEST' }
        });
    }
    const cartItemIds = cart.items.map(item => item.id);
    let totalAmount: number = 0;
    cart.items.forEach(item => {
        totalAmount += item.quantity * item.product.price;
    });

    const order = await createOrder(userId, addressId, totalAmount);
    await deleteCartItems(cartItemIds);

    let orderItemsData: OrderItemData[] = [];
    cart.items.forEach(item => {
        orderItemsData.push({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.product.price
        });
    });

    await createOrderItems(orderItemsData);
    await createPayment(userId, order.id, paymentMethod);
    return order;
}

export const updateOrderStatus = async (orderId: number, status: OrderStatus, userId: number) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) {
            throw new GraphQLError("Order not found", {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Only allow status updates by admin or the order owner
        if (order.user_id !== userId) {
            throw new GraphQLError("Unauthorized to update this order", {
                extensions: { code: 'UNAUTHORIZED' }
            });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                user: true,
                address: true,
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            }
        });

        return updatedOrder;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new GraphQLError("Failed to update order status", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};

export const getOrderTrackingInfo = async (orderId: number, userId: number) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                address: true,
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            }
        });

        if (!order) {
            throw new GraphQLError("Order not found", {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        if (order.user_id !== userId) {
            throw new GraphQLError("Unauthorized to view this order", {
                extensions: { code: 'UNAUTHORIZED' }
            });
        }

        // Generate tracking timeline based on order status
        const trackingUpdates: TrackingUpdate[] = [
            {
                status: "ORDER_PLACED",
                message: "Order has been placed successfully",
                timestamp: order.order_date
            }
        ];

        if (order.status !== "PENDING") {
            trackingUpdates.push({
                status: "ORDER_CONFIRMED",
                message: "Order has been confirmed",
                timestamp: new Date(order.order_date.getTime() + 1000 * 60 * 60) // 1 hour after order
            });
        }

        if (["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)) {
            trackingUpdates.push({
                status: "ORDER_PROCESSING",
                message: "Order is being processed",
                timestamp: new Date(order.order_date.getTime() + 1000 * 60 * 60 * 2) // 2 hours after order
            });
        }

        if (["SHIPPED", "DELIVERED"].includes(order.status)) {
            trackingUpdates.push({
                status: "ORDER_SHIPPED",
                message: "Order has been shipped",
                timestamp: new Date(order.order_date.getTime() + 1000 * 60 * 60 * 24), // 1 day after order
                location: "Shipping Center"
            });
        }

        if (order.status === "DELIVERED") {
            trackingUpdates.push({
                status: "ORDER_DELIVERED",
                message: "Order has been delivered",
                timestamp: new Date(order.order_date.getTime() + 1000 * 60 * 60 * 24 * 3), // 3 days after order
                location: order.address.city
            });
        }

        return {
            order,
            trackingUpdates
        };
    } catch (error) {
        console.error('Error getting order tracking info:', error);
        throw new GraphQLError("Failed to get order tracking information", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};

export const getOrdersByStatus = async (status: OrderStatus, userId: number) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                user_id: userId,
                status
            },
            include: {
                address: true,
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            },
            orderBy: {
                order_date: 'desc'
            }
        });

        return orders;
    } catch (error) {
        console.error('Error getting orders by status:', error);
        throw new GraphQLError("Failed to get orders", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}; 