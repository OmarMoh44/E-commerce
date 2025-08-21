import { requireAuth } from "@middlewares/auth.middleware";
import { searchProducts } from "@services/prisma/product.service";

export const searchProductsResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    const {
        query,
        categoryId,
        minPrice,
        maxPrice,
        brand,
        sortBy = 'created_at',
        sortOrder = 'desc',
        page = 1,
        limit = 12
    } = args.filters;

    const products = await searchProducts({
        query,
        categoryId,
        minPrice,
        maxPrice,
        brand,
        sortBy,
        sortOrder,
        page,
        limit
    });

    return products;
};

export const getProductSuggestionsResolver = async (parent: any, args: any, context: any) => {
    const { query } = args;
    const suggestions = await searchProducts({
        query,
        limit: 5,
        suggestionsOnly: true
    });
    return suggestions;
};
