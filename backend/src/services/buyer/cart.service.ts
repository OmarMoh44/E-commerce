import { Product } from "@prisma/client";
import { findCartByUser } from "@services/prisma/cart.service";
import { createCartItem, deleteCartItems } from "@services/prisma/cartItem.service";
import { findProduct, updateProduct } from "@services/prisma/product.service";
import { GraphQLError } from "graphql";
import { isItemBelongToUser } from "./cartItem.service";


export async function addToCart(product_id: number, user_id: number, quantity: number) {
    const cart = await findCartByUser(user_id);
    const product = await findProduct(product_id);
    canAddToCart(product, quantity);
    await createCartItem(product_id, cart.id, quantity);
    await updateProduct({ stock: product.stock - quantity }, product.id, product.seller_id);
    return cart;
}

export async function removeFromCart(cartItem_id: number, user_id: number) {
    await findCartByUser(user_id);
    const cartItem = await isItemBelongToUser(cartItem_id, user_id);
    const product = await findProduct(cartItem.product_id);
    await deleteCartItems([cartItem_id]);
    await updateProduct({ stock: product.stock + cartItem.quantity }, product.id, product.seller_id);
    return await findCartByUser(user_id);
}


export function canAddToCart(product: Product, quantity: number) {
    if (!product.is_active || quantity > product.stock)
        throw new GraphQLError("Process can not be done", {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
}