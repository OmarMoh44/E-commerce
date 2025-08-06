export const wishlistTypeDefs = `#graphql
  type WishlistItem {
    id: Int!
    user_id: Int!
    product_id: Int!
    created_at: String!
    product: Product!
  }

  type WishlistResponse {
    success: Boolean!
    message: String
  }

  extend type Query {
    getUserWishlist: [WishlistItem!]!
    isInWishlist(productId: Int!): Boolean!
  }

  extend type Mutation {
    addToWishlist(productId: Int!): WishlistItem!
    removeFromWishlist(productId: Int!): WishlistResponse!
  }
`; 