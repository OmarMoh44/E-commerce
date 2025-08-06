import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { 
    addToWishlist, 
    removeFromWishlist, 
    getUserWishlist,
    isInWishlist 
} from "@services/prisma/wishlist.service";

export const addToWishlistResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    const { productId } = args;
    const wishlistItem = await addToWishlist(id, productId);
    return wishlistItem;
};

export const removeFromWishlistResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    const { productId } = args;
    const result = await removeFromWishlist(id, productId);
    return result;
};

export const getUserWishlistResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    requireBuyer(context);
    const wishlist = await getUserWishlist(id);
    return wishlist;
};

export const isInWishlistResolver = async (parent: any, args: any, context: any) => {
    const { id: user_id } = requireAuth(context);
    requireBuyer(context);
    const { productId } = args;
    const isInWishlistResult = await isInWishlist(user_id, productId);
    return isInWishlistResult;
}; 