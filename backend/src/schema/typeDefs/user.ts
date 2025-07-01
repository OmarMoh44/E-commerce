export const userTypeDefs = `#graphql
    # Custom scalar for ISO date strings
    scalar DateTime

    # Enum for user roles
    enum Role {
        Buyer
        Seller
        Admin
    }

    # User type
    type User {
        id: ID!
        name: String!
        email: String!
        phone: String
        role: Role!
        created_at: DateTime!

        addresses: [Address!]!
        orders: [Order!]!
        reviews: [Review!]!
        products: [Product!]!   
        cart: Cart
        payments: [Payment!]!
  }
`;