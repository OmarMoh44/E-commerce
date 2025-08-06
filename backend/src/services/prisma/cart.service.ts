import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function findCartByUser(user_id: number) {
    const cart = await prisma.cart.findUnique({ where: { user_id } });
    if (!cart) throw new GraphQLError("Cart is not found", {
        extensions: { code: "NOT_FOUND" }
    });
    return cart;
}

export async function createCart(user_id: number) {
    try {
        return await prisma.cart.create({ data: { user_id } });
    } catch (error) {
        console.log("Error in creating cart");
        throw new GraphQLError("Error in creating cart", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function findCartItems(cart_id: number) {
    return await prisma.cartItem.findMany({ where: { cart_id } });
}