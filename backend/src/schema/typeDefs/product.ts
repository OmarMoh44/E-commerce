export const productTypeDefs = `#graphql
    type Product{
        id: Int!
        title: String!
        description: String!
        price: Float!
        discount: Float!
        stock: Int!
        brand: String!
        created_at: DateTime
        is_active: Boolean

        seller: User!
        category: Category!
        images: [ProductImage!]!
        reviews: [Review!]!
        oderItems: [OrderItem!]!
        cartItems: [CartItem!]!
    }
`;