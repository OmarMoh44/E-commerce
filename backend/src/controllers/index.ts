import { findUserById } from "@services/prisma/user.service";
import { requireAuth } from "@middlewares/auth.middleware";
import { loginResolver } from "./user/login.controller";
import { logoutResolver } from "./user/logout.controller";
import { signupResolver } from "./user/signup.controller";
import { deleteUserResolver, userAddressResovler, userCartResovler, userOrdersResovler, userPaymentsResovler, userProductsResolver, userReviewsResolver, userUpdateResolver } from "./user/user.controller";
import { addProductResolver, deleteProductResovler, updateProductResolver } from "./seller/product.controller";
import { addCategoryResolver, deleteCategoryResovler, updateCategroyResolver } from "./admin/categroy.controller";
import { orderAddressResolver, orderHistoryResovler, orderItemsResolver, orderPaymentResolver, orderUserResolver } from "./buyer/order.controller";
import { categoriesResolver, categoryParentResolver, categoriesChildrenResolver, categoryProductsResolver } from "./user/category.controller";
import { addToCartResolver, cartResolver, cartItemsResolver, removeFromCartResolver } from "./buyer/cart.controller";
import { searchProductsResolver, getProductSuggestionsResolver } from "./buyer/search.controller";
import { getProductResolver, sellerProductsResolver } from "./buyer/product.controller";
import { addToWishlistResolver, removeFromWishlistResolver, getUserWishlistResolver, isInWishlistResolver } from "./buyer/wishlist.controller";
// import { createPromotionResolver, getPromotionResolver, getAllPromotionsResolver, applyPromotionResolver } from "./admin/promotion.controller";
// import { createShippingResolver, getShippingInfoResolver, getTrackingInfoResolver, updateShippingStatusResolver, addTrackingEventResolver } from "./buyer/shipping.controller";
// import { trackPageViewResolver, trackProductViewResolver, trackSearchQueryResolver, trackConversionResolver, getAnalyticsResolver } from "./admin/analytics.controller";

async function userResolver(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    console.log(id)
    const user = await findUserById(id);
    return user;
}

export const resolvers = {
    Query: {
        user: userResolver,
        orderHistory: orderHistoryResovler,
        categories: categoriesResolver,
        cart: cartResolver,
        getProduct: getProductResolver,
        getUserWishlist: getUserWishlistResolver,
        isInWishlist: isInWishlistResolver,
        searchProducts: searchProductsResolver,
        getProductSuggestions: getProductSuggestionsResolver,
    },
    Mutation: {
        login: loginResolver,
        logout: logoutResolver,
        signup: signupResolver,
        updateName: userUpdateResolver.name,
        updateEmail: userUpdateResolver.email,
        updatePassword: userUpdateResolver.password,
        updatePhone: userUpdateResolver.phone,
        deleteUser: deleteUserResolver,

        addProduct: addProductResolver,
        deleteProduct: deleteProductResovler,
        updateProduct: updateProductResolver,

        addCategory: addCategoryResolver,
        updateCategoryName: updateCategroyResolver,
        deleteCategory: deleteCategoryResovler,

        addToCart: addToCartResolver,
        addToWishlist: addToWishlistResolver,
        removeFromWishlist: removeFromWishlistResolver,
        removeFromCart: removeFromCartResolver,
    },
    Order: {
        user: orderUserResolver,
        address: orderAddressResolver,
        payment: orderPaymentResolver,
        items: orderItemsResolver,
    },
    User: {
        addresses: userAddressResovler,
        orders: userOrdersResovler,
        reviews: userReviewsResolver,
        products: userProductsResolver,
        cart: userCartResovler,
        payments: userPaymentsResovler,
    },
    Category: {
        parent: categoryParentResolver,
        children: categoriesChildrenResolver,
        products: categoryProductsResolver,
    },
    Cart: {
        user: userResolver,
        items: cartItemsResolver,
    },
    Product: {
        seller: sellerProductsResolver,

    }
};