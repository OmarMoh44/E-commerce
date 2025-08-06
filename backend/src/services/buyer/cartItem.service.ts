import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function isItemBelongToUser(itemId: number, userId: number) {
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: { user_id: userId }
        }
    });
    if (!cartItem) {
        throw new GraphQLError("Cart item not found", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return cartItem;
}