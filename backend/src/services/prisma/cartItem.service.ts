import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function createCartItem(product_id: number, cart_id: number, quantity: number) {
    try {
        return await prisma.cartItem.create({
            data: { cart_id, product_id, quantity }
        });
    } catch (error) {
        console.log("Error in creating cart item");
        throw new GraphQLError("Error in creating cart item", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function deleteCartItem(itemId: number, userId: number) {
    try {
        await prisma.cartItem.delete({
            where: { id: itemId }
        });
    } catch (error) {
        console.log("Error in removing cart item");
        throw new GraphQLError("Error in removing cart item", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}
