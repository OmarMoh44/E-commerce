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

  type Mutation {
    login(email: String!, password: String!): User!
    logout: User
    signup(data: UserData!): User!
    addProduct(data: ProductData!): Product!
  }
`;