import { gql } from '@apollo/client';

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($filters: SearchFilters!) {
    searchProducts(filters: $filters) {
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
        email
        phone
      }
      reviews {
        id
        rating
      }
    }
  }
`;

export const GET_PRODUCT_SUGGESTIONS = gql`
  query GetProductSuggestions($query: String!) {
    getProductSuggestions(query: $query) {
      id
      title
      brand
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
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
      products {
        id
        title
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    user {
      id
      name
      email
      phone
      role
      created_at
      addresses {
        id
        city
        country
      }
      orders {
        id
        status
        order_date
        total_amount
      }
      reviews {
        id
        rating
        comment
        review_date
        product {
          id
          title
        }
      }
      products {
        id
        title
        price
        stock
        is_active
      }
      cart {
        id
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
      payments {
        id
        payment_method
        transaction_id
        paid_at
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        id
        quantity
        product {
          id
          title
          price
          discount
          stock
          brand
        }
      }
    }
  }
`;

export const GET_WISHLIST = gql`
  query GetWishlist {
    getUserWishlist {
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

export const IS_IN_WISHLIST = gql`
  query IsInWishlist($productId: Int!) {
    isInWishlist(productId: $productId)
  }
`;

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory {
    orderHistory {
      id
      status
      order_date
      total_amount
      user {
        id
        name
        email
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
          brand
        }
      }
    }
  }
`;

export const GET_ORDERS_BY_STATUS = gql`
  query GetOrdersByStatus($orderStatus: OrderStatus!) {
    getOrders(order_status: $orderStatus) {
      id
      status
      order_date
      total_amount
      user {
        id
        name
        email
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
          brand
        }
      }
    }
  }
`;

export const TRACK_ORDER = gql`
  query TrackOrder($orderId: Int!) {
    trackOrder(order_id: $orderId) {
      order {
        id
        status
        order_date
        total_amount
      }
      tracking {
        status
        location
        timestamp
        message
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($productId: Int!) {
    getReviews(productId: $productId) {
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

// Product Detail Query
export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    getProduct(id: $id) {
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
        email
        phone
      }
    }
  }
`;

// Seller Products Query
export const GET_SELLER_PRODUCTS = gql`
  query GetSellerProducts {
    user {
      products {
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
      }
    }
  }
`;

// Address Queries - These need to be implemented on the backend first
export const GET_USER_ADDRESSES = gql`
  query GetUserAddresses {
    getUserAddresses {
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

export const GET_ADDRESS = gql`
  query GetAddress($addressId: Int!) {
    getAddress(address_id: $addressId) {
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