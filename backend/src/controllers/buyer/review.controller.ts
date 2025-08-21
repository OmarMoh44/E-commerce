import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { findProduct } from "@services/prisma/product.service";
import { createReview, findReviewsByProduct, updateReview, deleteReview } from "@services/prisma/review.service";
import { findUserById } from "@services/prisma/user.service";

export async function getReviewsResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    requireBuyer(context);
    const { productId } = args;
    return await findReviewsByProduct(productId);
}

export async function reviewUserResolver(parent: any, args: any, context: any) {
    const { user_id } = parent;
    requireAuth(context);
    requireBuyer(context);
    return await findUserById(user_id);
}

export async function reviewProductResolver(parent: any, args: any, context: any) {
    const { product_id } = parent;
    requireAuth(context);
    requireBuyer(context);
    return await findProduct(product_id);
}

export async function addReviewResolver(parent: any, args: any, context: any) {
    const user_id = requireAuth(context).id;
    requireBuyer(context);
    const { product_id, rating, comment } = args;
    return await createReview({ user_id, product_id, rating, comment });
}

export async function updateReviewResolver(parent: any, args: any, context: any) {
    const user_id = requireAuth(context).id;
    requireBuyer(context);
    const review_id = args.review_id;
    delete args.review_id;
    return await updateReview(args, review_id, user_id);
}

export async function deleteReviewResolver(parent: any, args: any, context: any) {
    const user_id = requireAuth(context).id;
    requireBuyer(context);
    const review_id = args.review_id;
    return await deleteReview(review_id, user_id);
}