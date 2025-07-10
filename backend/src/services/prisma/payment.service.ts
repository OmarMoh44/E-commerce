import prisma from "@DB";
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