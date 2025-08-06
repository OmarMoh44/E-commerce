export const searchTypeDefs = `#graphql
  type ProductSuggestion {
    id: Int!
    title: String!
    brand: String!
  }

  input SearchFilters {
    query: String
    categoryId: Int
    minPrice: Float
    maxPrice: Float
    brand: String
    sortBy: String
    sortOrder: String
    page: Int
    limit: Int
  }

  extend type Query {
    searchProducts(filters: SearchFilters!): [Product!]!
    getProductSuggestions(query: String!): [ProductSuggestion!]!
  }
`; 