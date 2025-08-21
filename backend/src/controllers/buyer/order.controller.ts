import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { findAddressByOrder } from "@services/prisma/address.service";
import { findOrdersByUser, getOrdersByStatus, getOrderTrackingInfo, processOrder, updateOrderStatus } from "@services/prisma/order.service";
import { findItemsByOrder } from "@services/prisma/orderItem.service";
import { findPaymentByOrder } from "@services/prisma/payment.service";
import { findUserByOrder } from "@services/prisma/user.service";

export async function orderHistoryResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    return await findOrdersByUser(id);
}

export async function trackOrderResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const { order_id } = args;
    return await getOrderTrackingInfo(order_id, id);
}

export async function processOrderResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const { paymentMethod, address_id } = args;
    return await processOrder(id, paymentMethod, address_id);
}

export async function updateOrderStatusResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const { order_id, order_status } = args;
    return await updateOrderStatus(order_id, order_status, id);
}

export async function getOrdersResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const { order_status } = args;
    return await getOrdersByStatus(id, order_status);
}

// Nest resolvers
export async function orderUserResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findUserByOrder(id);
}

export async function orderAddressResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findAddressByOrder(id);
}

export async function orderPaymentResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findPaymentByOrder(id);
}

export async function orderItemsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findItemsByOrder(id);
}

