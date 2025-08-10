import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { addToCart, removeFromCart } from "@services/buyer/cart.service";
import { findCartByUser } from "@services/prisma/cart.service";

export async function cartResolver(parent: any, args: any, context: any) {
    const user_id = requireAuth(context).id;
    requireBuyer(context);
    return await findCartByUser(user_id);
}

export async function addToCartResolver(parent: any, args: any, context: any) {
    const user_id = requireAuth(context).id;
    requireBuyer(context);
    const { product_id, quantity } = args;
    return await addToCart(product_id, user_id, quantity);
}

export const removeFromCartResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const { itemId } = args;
    return await removeFromCart(itemId, id);
}; 