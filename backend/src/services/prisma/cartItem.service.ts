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
