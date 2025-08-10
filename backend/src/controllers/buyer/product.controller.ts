import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { findProduct } from "@services/prisma/product.service";

export const getProductResolver = async (parent: any, args: any, context: any) => {
    requireAuth(context);
    requireBuyer(context);
    const { id: product_id } = args;
    return await findProduct(product_id);
};
