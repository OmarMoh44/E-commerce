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
`; 