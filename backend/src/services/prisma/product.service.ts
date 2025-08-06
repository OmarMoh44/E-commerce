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
    const product = await prisma.product.findUnique({ where: { id: product_id } });
    if (!product) {
        throw new GraphQLError("Product not found", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return product;
}

export async function findProductsByCategory(category_id: number) {
    return await prisma.product.findMany({
        where: { category_id, is_active: true },
    })
}

export async function searchProducts({
    query,
    categoryId,
    minPrice,
    maxPrice,
    brand,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 12,
    suggestionsOnly = false
}: {
    query?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    suggestionsOnly?: boolean;
}) {

    // Design query options using provided search filters

    const skip = (page - 1) * limit;
    
    const where: any = {
        is_active: true
    };

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } }
        ];
    }

    if (categoryId) {
        where.category_id = categoryId;
    }

    if (minPrice !== undefined) {
        where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
        where.price = { ...where.price, lte: maxPrice };
    }

    if (brand) {
        where.brand = { contains: brand, mode: 'insensitive' };
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const products = await prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit
    });

    if (suggestionsOnly) {
        return products.map(product => ({
            id: product.id,
            title: product.title,
            brand: product.brand
        }));
    }

    return products;
}