import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($data: UserData!) {
    signup(data: $data) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      id
      name
      email
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(product_id: $productId, quantity: $quantity) {
      id
      user {
        id
        name
      }
      items {
        id
        quantity
        product {
          id
          title
          price
          discount
          stock
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: Int!) {
    removeFromCart(itemId: $itemId) {
      id
      user {
        id
        name
      }
      items {
        id
        quantity
        product {
          id
          title
          price
          discount
        }
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: Int!) {
    addToWishlist(productId: $productId) {
      id
      product_id
      created_at
      product {
        id
        title
        price
        discount
        brand
        stock
        is_active
        category {
          id
          name
        }
        seller {
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: Int!) {
    removeFromWishlist(productId: $productId) {
      success
      message
    }
  }
`;

// User Profile Mutations
export const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    updateName(name: $name) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const UPDATE_PHONE = gql`
  mutation UpdatePhone($phone: String!) {
    updatePhone(phone: $phone) {
      id
      name
      email
      phone
      role
      created_at
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      id
      name
      email
    }
  }
`;

// Product Management Mutations (Seller)
export const ADD_PRODUCT = gql`
  mutation AddProduct($data: ProductData!) {
    addProduct(data: $data) {
      id
      title
      description
      price
      discount
      stock
      brand
      created_at
      is_active
      category {
        id
        name
      }
      seller {
        id
        name
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: Int!) {
    deleteProduct(product_id: $productId) {
      id
      title
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($details: ProductDetails!, $productId: Int!) {
    updateProduct(details: $details, product_id: $productId) {
      id
      title
      description
      price
      discount
      stock
      brand
      is_active
      category {
        id
        name
      }
    }
  }
`;

// Category Management Mutations (Admin)
export const ADD_CATEGORY = gql`
  mutation AddCategory($category: String!, $parentId: Int) {
    addCategory(category: $category, parent_id: $parentId) {
      id
      name
      parent {
        id
        name
      }
      children {
        id
        name
      }
    }
  }
`;

export const UPDATE_CATEGORY_NAME = gql`
  mutation UpdateCategoryName($categoryId: Int!, $category: String!) {
    updateCategoryName(category_id: $categoryId, category: $category) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: Int!) {
    deleteCategory(category_id: $categoryId) {
      id
      name
    }
  }
`;

// Review Mutations
export const ADD_REVIEW = gql`
  mutation AddReview($productId: Int!, $rating: Int!, $comment: String!) {
    addReview(product_id: $productId, rating: $rating, comment: $comment) {
      id
      rating
      comment
      review_date
      user {
        id
        name
      }
      product {
        id
        title
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: Int!, $rating: Int, $comment: String) {
    updateReview(review_id: $reviewId, rating: $rating, comment: $comment) {
      id
      rating
      comment
      review_date
      user {
        id
        name
      }
      product {
        id
        title
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: Int!) {
    deleteReview(review_id: $reviewId)
  }
`;

// Order Mutations
export const PROCESS_ORDER = gql`
  mutation ProcessOrder($paymentMethod: PaymentMethod!, $addressId: Int!) {
    processOrder(paymentMethod: $paymentMethod, address_id: $addressId) {
      id
      status
      order_date
      total_amount
      user {
        id
        name
      }
      address {
        id
        city
        country
      }
      payment {
        id
        payment_method
        transaction_id
        paid_at
      }
      items {
        id
        quantity
        price_at_purchase
        product {
          id
          title
          price
        }
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: Int!, $orderStatus: OrderStatus!) {
    updateOrderStatus(order_id: $orderId, order_status: $orderStatus) {
      id
      status
      order_date
      total_amount
    }
  }
`;

// Address Mutations - These need to be implemented on the backend first
export const CREATE_ADDRESS = gql`
  mutation CreateAddress($data: AddressData!) {
    createAddress(data: $data) {
      id
      full_name
      city
      country
      phone
      is_default
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($addressId: Int!, $data: AddressData!) {
    updateAddress(address_id: $addressId, data: $data) {
      id
      full_name
      city
      country
      phone
      is_default
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($addressId: Int!) {
    deleteAddress(address_id: $addressId) {
      id
      full_name
    }
  }
`;