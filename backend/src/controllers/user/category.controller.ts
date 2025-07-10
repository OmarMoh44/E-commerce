import { requireAuth } from "@middlewares/auth.middleware";
import { findCategories } from "@services/prisma/category.service";

export async function categoriesResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    return await findCategories();
}