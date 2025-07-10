import { findCartByUser } from "@services/prisma/cart.service";
import { createCartItem } from "@services/prisma/cartItem.service";
import { findProduct } from "@services/prisma/product.service";
import { GraphQLError } from "graphql";


export async function addToCart(product_id: number, user_id: number, quantity: number) {
    const cart = await findCartByUser(user_id);
    if (!cart) throw new GraphQLError("Cart is not found", {
        extensions: { code: "NOT_FOUND" }
    });
    await canAddToCart(product_id, quantity);
    await createCartItem(product_id, cart.id, quantity);
    return cart;
}

export async function canAddToCart(product_id: number, quantity: number) {
    const product = await findProduct(product_id);
    if (!product) throw new GraphQLError("Product is not found", {
        extensions: { code: "NOT_FOUND" }
    });
    if (!product.is_active || quantity > product.stock)
        throw new GraphQLError("Process can not be done", {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
    return product;
}