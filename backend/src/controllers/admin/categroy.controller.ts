import { requireAuth } from "@middlewares/auth.middleware";
import { requireAdmin } from "@middlewares/permissions.middleware";
import { GraphQLError } from "graphql";
import { createCategory, deleteCategory, updateCategory } from "@services/prisma/category.service";


export async function addCategoryResolver(parent: any, args: any, context: any) {
    const { role } = requireAuth(context);
    requireAdmin(context);
    return await createCategory(args.category, args.parent_id);
}

export async function updateCategroyResolver(parent: any, args: any, context: any) {
    const { role } = requireAuth(context);
    requireAdmin(context);
    return await updateCategory(args.category_id, { name: args.category });
}

export async function deleteCategoryResovler(parent: any, args: any, context: any) {
    const { role } = requireAuth(context);
    requireAdmin(context);
    return await deleteCategory(args.category_id);
}
