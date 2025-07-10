import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function findAddressByOrder(order_id: number) {
    const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { address: true }
    });
    if (!order?.address) {
        throw new GraphQLError("Order not found or address missing", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return order.address;
}

export async function findAddressByUser(user_id: number) {
    return await prisma.address.findMany({
        where: { user_id }
    })
}