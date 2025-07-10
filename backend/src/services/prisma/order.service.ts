import prisma from "@DB";

export async function findOrdersByUser(buyer_id: number) {
    return await prisma.order.findMany({
        where: {user_id: buyer_id}
    });
}