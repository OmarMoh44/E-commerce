import { findUserById } from "@services/prisma/user.service";
import { requireAuth } from "@middlewares/auth.middleware";
import { loginResolver } from "./user/login.controller";
import { logoutResolver } from "./user/logout.controller";
import { signupResolver } from "./user/signup.controller";
import { deleteUserResolver, userAddressResolver, userCartResolver, userOrdersResolver, userPaymentsResolver, userProductsResolver, userReviewsResolver, userUpdateResolver } from "./user/user.controller";
import { addProductResolver, deleteProductResolver, updateProductResolver } from "./seller/product.controller";
import { addCategoryResolver, deleteCategoryResolver, updateCategoryResolver } from "./admin/category.controller";
import { updateOrderStatusResolver, orderAddressResolver, orderHistoryResolver, orderItemsResolver, orderPaymentResolver, orderUserResolver, processOrderResolver, trackOrderResolver, getOrdersResolver } from "./buyer/order.controller";
import { categoriesResolver, categoryParentResolver, categoriesChildrenResolver, categoryProductsResolver } from "./user/category.controller";
import { addToCartResolver, cartResolver, removeFromCartResolver } from "./buyer/cart.controller";
import { searchProductsResolver, getProductSuggestionsResolver } from "./buyer/search.controller";
import { getProductResolver, productCategoryResolver, productSellerResolver } from "./buyer/product.controller";
import { addToWishlistResolver, removeFromWishlistResolver, getUserWishlistResolver, isInWishlistResolver } from "./buyer/wishlist.controller";
import { addReviewResolver, deleteReviewResolver, getReviewsResolver, reviewProductResolver, reviewUserResolver, updateReviewResolver } from "./buyer/review.controller";
import { createAddressResolver, deleteAddressResolver, getAddressResolver, getUserAddressesResolver, updateAddressResolver } from "./user/address.controller";

async function userResolver(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    const user = await findUserById(id);
    return user;
}

export const resolvers = {
    Query: {
        user: userResolver,
        orderHistory: orderHistoryResolver,
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
        getUserAddresses: getUserAddressesResolver,
        getAddress: getAddressResolver,
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
        deleteProduct: deleteProductResolver,
        updateProduct: updateProductResolver,

        addCategory: addCategoryResolver,
        updateCategoryName: updateCategoryResolver,
        deleteCategory: deleteCategoryResolver,

        addToCart: addToCartResolver,
        removeFromCart: removeFromCartResolver,

        addToWishlist: addToWishlistResolver,
        removeFromWishlist: removeFromWishlistResolver,

        addReview: addReviewResolver,
        updateReview: updateReviewResolver,
        deleteReview: deleteReviewResolver,

        createAddress: createAddressResolver,
        updateAddress: updateAddressResolver,
        deleteAddress: deleteAddressResolver,

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
        addresses: userAddressResolver,
        orders: userOrdersResolver,
        reviews: userReviewsResolver,
        products: userProductsResolver,
        cart: userCartResolver,
        payments: userPaymentsResolver,
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