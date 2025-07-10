import prisma from "@DB";
import { ProductInfo } from "@models/product";
import { GraphQLError } from "graphql";

export async function createProduct(productData: ProductInfo, seller_id: number, category_id: number) {
    try {
        const product = await prisma.product.create({
            data: {
                title: productData.title, description: productData.description,
                price: productData.price, discount: productData.discount,
                stock: productData.stock, brand: productData.brand,
                seller_id, is_active: true, category_id
            }
        })
    } catch (error) {
        console.log("Error in creating new product");
        throw new GraphQLError("Error in creating new product", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function deleteProduct(product_id: number, seller_id: number) {
    try {
        return await prisma.product.delete({
            where: { id: product_id, seller_id }
        });
    } catch (error) {
        console.log("Error in deleting product");
        throw new GraphQLError("Error in deleting product", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function updateProduct(data: any, product_id: number, seller_id: number) {
    try {
        return await prisma.product.update({
            where: { id: product_id, seller_id },
            data
        });
    } catch (error) {
        console.log("Error in updating product");
        throw new GraphQLError("Error in updating product", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function findProductsByUser(user_id: number) {
    return await prisma.product.findMany({ where: { seller_id: user_id } });
}

export async function findProduct(product_id: number) {
    return await prisma.product.findUnique({ where: { id: product_id } });
}