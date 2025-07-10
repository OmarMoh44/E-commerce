import { requireAuth } from "@middlewares/auth.middleware";
import { requireSeller } from "@middlewares/permissions.middleware";
import { findCategories } from "@services/prisma/category.service";
import { createProduct, deleteProduct, updateProduct } from "@services/prisma/product.service";
import { checkCategoryExist } from "@services/seller/product.service";
import { ProductInfo } from "@models/product";
import { validateProductData } from "@validators/product";


// TODO: Later, add images and videos of new product that are exsit on Cloud Storage
export async function addProductResolver(parent: any, args: any, context: any) {
    const user = requireAuth(context);
    requireSeller(context);
    const productData: ProductInfo = context.data;
    validateProductData(productData);
    const categories = await findCategories();
    const categoriesList =  categories.map((category) => category.name);
    const categoriesIndices = categories.map((category) => category.id);
    const category_id = checkCategoryExist(productData.categoryName, categoriesList, categoriesIndices);
    return await createProduct(productData, user.id, category_id);
}

export async function deleteProductResovler(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireSeller(context);
    const { product_id }: { product_id: number } = args;
    return await deleteProduct(product_id, id);
}

// TODO: Later, update images of products
export const productUpdateResolver = {
    title: async function title(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { title, product_id } = args;
        return await updateProduct({ title }, product_id, id);
    },
    description: async function description(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { description, product_id } = args;
        return await updateProduct({ description }, product_id, id);
    },
    price: async function price(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { price, product_id } = args;
        return await updateProduct({ price }, product_id, id);
    },
    discount: async function discount(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { discount, product_id } = args;
        return await updateProduct({ discount }, product_id, id);
    },
    stock: async function stock(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { stock, product_id } = args;
        return await updateProduct({ stock }, product_id, id);
    },
    brand: async function brand(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        requireSeller(context);
        const { brand, product_id } = args;
        return await updateProduct({ brand }, product_id, id);
    },

}

