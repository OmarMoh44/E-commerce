import { requireAuth } from "@middlewares/auth.middleware";
import { findCategories, findParentByChildId, findChildrenByParentId } from "@services/prisma/category.service";
import { findProductsByCategory } from "@services/prisma/product.service";

export async function categoriesResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    return await findCategories();
}

export async function categoryParentResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    const { id: child_id } = parent;
    return await findParentByChildId(child_id);
}

export async function categoriesChildrenResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    const { id: parent_id } = parent;
    return await findChildrenByParentId(parent_id);
}

export async function categoryProductsResolver(parent: any, args: any, context: any) {
    requireAuth(context);
    const { id: category_id } = parent;
    return await findProductsByCategory(category_id);
}