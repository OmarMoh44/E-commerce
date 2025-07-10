import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function findItemsByOrder(order_id: number) {
    const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { items: true }
    });
    if (!order) {
        throw new GraphQLError("Order not found", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return order.items;
}