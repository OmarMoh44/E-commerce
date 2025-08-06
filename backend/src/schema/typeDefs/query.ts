export const queryTypeDefs = `#graphql
  type Query {
    user: User!   # Get user using token cookie
    orderHistory: [Order!]!
    categories: [Category!]!
    cart: Cart!
    getProduct(id: Int!): Product
    getUserWishlist: [WishlistItem!]!
    isInWishlist(productId: Int!): Boolean!
  }
`;