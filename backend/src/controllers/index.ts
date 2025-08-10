import { findUserById } from "@services/prisma/user.service";
import { requireAuth } from "@middlewares/auth.middleware";
import { loginResolver } from "./user/login.controller";
import { logoutResolver } from "./user/logout.controller";
import { signupResolver } from "./user/signup.controller";
import { deleteUserResolver, userAddressResovler, userCartResovler, userOrdersResovler, userPaymentsResovler, userProductsResolver, userReviewsResolver, userUpdateResolver } from "./user/user.controller";
import { addProductResolver, deleteProductResovler, updateProductResolver } from "./seller/product.controller";
import { addCategoryResolver, deleteCategoryResovler, updateCategroyResolver } from "./admin/categroy.controller";
import { updateOrderStatusResolver, orderAddressResolver, orderHistoryResovler, orderItemsResolver, orderPaymentResolver, orderUserResolver, processOrderResolver, trackOrderResolver, getOrdersResolver } from "./buyer/order.controller";
import { categoriesResolver, categoryParentResolver, categoriesChildrenResolver, categoryProductsResolver } from "./user/category.controller";
import { addToCartResolver, cartResolver, removeFromCartResolver } from "./buyer/cart.controller";
import { searchProductsResolver, getProductSuggestionsResolver } from "./buyer/search.controller";
import { getProductResolver } from "./buyer/product.controller";
import { addToWishlistResolver, removeFromWishlistResolver, getUserWishlistResolver, isInWishlistResolver } from "./buyer/wishlist.controller";
import { addReviewResolver, deleteReviewResolver, getReviewsResolver, reviewProductResolver, reviewUserResolver, updateReviewResolver } from "./buyer/review.controller";

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
        getReviews: getReviewsResolver,
        trackOrder: trackOrderResolver,
        getOrders: getOrdersResolver,
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
        removeFromCart: removeFromCartResolver,

        addToWishlist: addToWishlistResolver,
        removeFromWishlist: removeFromWishlistResolver,

        addReview: addReviewResolver,
        updateReview: updateReviewResolver,
        deleteReview: deleteReviewResolver,

        processOrder: processOrderResolver,
        updateOrderStatus: updateOrderStatusResolver,
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
    Review: {
        user: reviewUserResolver,
        product: reviewProductResolver,
    }
};