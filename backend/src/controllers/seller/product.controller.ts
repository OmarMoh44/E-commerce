import { requireAuth } from "@middlewares/auth.middleware";
import { requireSeller } from "@middlewares/permissions.middleware";
import { findCategories } from "@services/prisma/category.service";
import { createProduct, deleteProduct, updateProduct } from "@services/prisma/product.service";
import { checkCategoryExist } from "@services/seller/product.service";
import { ProductInfo } from "@src/types/product";
import { validateProductData } from "@validators/product";


export async function addProductResolver(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    requireSeller(context);
    const productData: ProductInfo = args.data;
    validateProductData(productData);
    const categories = await findCategories();
    const categoriesList = categories.map((category) => category.name);
    const categoriesIndices = categories.map((category) => category.id);
    const category_id = checkCategoryExist(productData.categoryName, categoriesList, categoriesIndices);
    return await createProduct(productData, id, category_id);
}

export async function deleteProductResovler(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    requireSeller(context);
    const { product_id }: { product_id: number } = args;
    return await deleteProduct(product_id, id);
}

export async function updateProductResolver(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    requireSeller(context);
    const { details, product_id } = args;
    return await updateProduct(details, product_id, id);
}

