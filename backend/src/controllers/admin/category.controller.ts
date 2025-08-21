import { requireAuth } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/permissions.middleware";
import { createCategory, deleteCategory, updateCategory } from "@services/prisma/category.service";


export async function addCategoryResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    requireAdmin(context);
    return await createCategory(args.category, args.parent_id);
}

export async function updateCategoryResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    requireAdmin(context);
    return await updateCategory(args.category_id, { name: args.category });
}

export async function deleteCategoryResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    requireAdmin(context);
    return await deleteCategory(args.category_id);
}
