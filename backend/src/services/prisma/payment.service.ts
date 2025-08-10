import prisma from "@DB";
import { PaymentMethod } from "@prisma/client";
import { GraphQLError } from "graphql";

export async function findPaymentByOrder(order_id: number) {
    const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { payment: true }
    });
    if (!order) {
        throw new GraphQLError("Order not found", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return order.payment;
}

export async function findPaymentByUser(user_id: number) {
    return await prisma.payment.findMany({ where: { user_id } });
}

export async function createPayment(userId: number, orderId: number, paymentMethod: PaymentMethod) {
    try {
        return await prisma.payment.create({
            data: {
                user: { connect: { id: userId } },
                order: { connect: { id: orderId } },
                payment_method: paymentMethod
            },
            include: { order: true }
        });
    } catch (error) {
        console.error("Error in creating payment", error);
        throw new GraphQLError("Error in creating payment", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }

}