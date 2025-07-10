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
    updateName(name: String!): User!
    updateEmail(email: String!): User!
    updatePassword(oldPassword: String!, newPassword: String!): User!
    updatePhone(phone: String!): User!
    deleteUser: User!
    
    addProduct(data: ProductData!): Product!
    deleteProduct(product_id: Int!): Product!
    updateTitle(title: String!, product_id: Int!): Product!
    updateDesc(description: String!, product_id: Int!): Product!
    updatePrice(price: Float!, product_id: Int!): Product!
    updateDiscount(discount: Float!, product_id: Int!): Product!
    updateStock(stock: Int!, product_id: Int!): Product!
    updateBranc(brand: String!, product_id: Int!): Product!

    addCategory(category: String!, parent_id: Int): Category!
    updateCategoryName(category_id: Int!, category: String!): Category!
    deleteCategory(category_id: Int!): Category!

    addToCart(product_id: Int!, quantity: Int!): Cart!
  }
`;