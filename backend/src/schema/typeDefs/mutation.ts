export const mutationTypeDefs = `#graphql
  input UserData{
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
    phone: String!
    role: Role!
  }

  input ProductData{
    title: String!
    description: String!
    price: Float!
    discount: Float!
    stock: Int!
    categoryName: String!
    brand: String!
  }

  input ProductDetails{
    title: String
    description: String
    price: Float
    discount: Float
    stock: Int
    categoryName: String
    brand: String
  }

  type Mutation {
    login(email: String!, password: String!): User!
    logout: User
    signup(data: UserData!): User!
    updateName(name: String!): User!
    updateEmail(email: String!): User!
    updatePassword(currentPassword: String!, newPassword: String!): User!
    updatePhone(phone: String!): User!
    deleteUser: User!
    
    addProduct(data: ProductData!): Product!
    deleteProduct(product_id: Int!): Product!
    updateProduct(details: ProductDetails!, product_id: Int!): Product!

    addCategory(category: String!, parent_id: Int): Category!
    updateCategoryName(category_id: Int!, category: String!): Category!
    deleteCategory(category_id: Int!): Category!

    addToCart(product_id: Int!, quantity: Int!): Cart!
    removeFromCart(itemId: Int!): Cart!
    
    addToWishlist(productId: Int!): WishlistItem!
    removeFromWishlist(productId: Int!): WishlistResponse!

    addReview(product_id: Int!, rating: Int!, comment: String!): Review!
    updateReview(review_id: Int!, rating: Int, comment: String): Review!
    deleteReview(review_id: Int!): String!

    processCart(paymentMethod: PaymentMethod!, address_id: Int!): Order!
    updateOrderStatus(order_id: Int!, order_status: OrderStatus!): Order!

  }
`;