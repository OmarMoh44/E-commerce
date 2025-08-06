// // GraphQL Context Types
// export interface GraphQLContext {
//   req: any;
//   res: any;
//   user?: { // can be null
//     id: number;
//     role: string;
//   };
// }

// // User Types
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone?: string; // can be null
//   role: 'Buyer' | 'Seller' | 'Admin';
//   created_at: Date;
// }

// export interface UserData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phone: string;
//   role: 'Buyer' | 'Seller' | 'Admin';
// }

// // Product Types
// export interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   discount: number;
//   stock: number;
//   brand: string;
//   created_at: Date;
//   is_active: boolean;
//   seller: User;
//   category: Category;
//   images: ProductImage[];
//   reviews: Review[];
// }

// export interface ProductData {
//   title: string;
//   description: string;
//   price: number;
//   discount: number;
//   stock: number;
//   categoryName: string;
//   brand: string;
// }

// export interface ProductImage {
//   id: number;
//   url: string;
//   alt_text: string;
// }

// // Category Types
// export interface Category {
//   id: number;
//   name: string;
//   parent?: Category;
//   children: Category[];
//   products: Product[];
// }

// // Cart Types
// export interface Cart {
//   id: number;
//   user: User;
//   items: CartItem[];
// }

// export interface CartItem {
//   id: number;
//   quantity: number;
//   cart: Cart;
//   product: Product;
// }

// // Order Types
// export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

// export interface Order {
//   id: number;
//   status: OrderStatus;
//   order_date: Date;
//   total_amount: number;
//   user: User;
//   address: Address;
//   payment?: Payment;
//   items: OrderItem[];
// }

// export interface OrderItem {
//   id: number;
//   quantity: number;
//   price_at_purchase: number;
//   order: Order;
//   product: Product;
// }

// // Address Types
// export interface Address {
//   id: number;
//   full_name: string;
//   city: string;
//   country: string;
//   phone: string;
//   is_default: boolean;
//   user: User;
//   orders: Order[];
// }

// // Payment Types
// export type PaymentMethod = 'CARD' | 'PAYPAL' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'WALLET';
// export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

// export interface Payment {
//   id: number;
//   payment_method: PaymentMethod;
//   payment_status: PaymentStatus;
//   transaction_id: string;
//   paid_at: Date;
//   user: User;
//   order: Order;
// }

// // Review Types
// export interface Review {
//   id: number;
//   rating: number;
//   comment: string;
//   review_date: Date;
//   user: User;
//   product: Product;
// }

// // Wishlist Types
// export interface WishlistItem {
//   id: number;
//   user_id: number;
//   product_id: number;
//   created_at: Date;
//   product: Product;
// }

// export interface WishlistResponse {
//   success: boolean;
//   message?: string;
// }

// // Search Types
// export interface SearchFilters {
//   query?: string;
//   categoryId?: number;
//   minPrice?: number;
//   maxPrice?: number;
//   brand?: string;
//   sortBy?: string;
//   sortOrder?: string;
//   page?: number;
//   limit?: number;
// }

// export interface SearchResult {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   discount: number;
//   stock: number;
//   brand: string;
//   created_at: Date;
//   is_active: boolean;
//   images: ProductImage[];
//   category: Category;
//   seller: User;
//   reviews: Review[];
// }

// // Promotion Types
// export interface Promotion {
//   id: number;
//   code: string;
//   discount_percentage: number;
//   valid_from: string;
//   valid_until: string;
//   max_uses: number;
//   current_uses: number;
//   is_active: boolean;
//   created_at: string;
// }

// export interface PromotionData {
//   code: string;
//   discount_percentage: number;
//   valid_from: string;
//   valid_until: string;
//   max_uses: number;
// }

// export interface PromotionResponse {
//   success: boolean;
//   message?: string;
//   discount_amount?: number;
// }

// // Shipping Types
// export interface Shipping {
//   id: number;
//   order_id: number;
//   tracking_number: string;
//   carrier: string;
//   status: string;
//   estimated_delivery?: string;
//   created_at: string;
//   tracking_events: TrackingEvent[];
// }

// export interface TrackingEvent {
//   id: number;
//   event_type: string;
//   description: string;
//   location?: string;
//   timestamp: string;
// }

// export interface ShippingData {
//   order_id: number;
//   tracking_number: string;
//   carrier: string;
//   estimated_delivery?: string;
// }

// export interface TrackingEventData {
//   event_type: string;
//   description: string;
//   location?: string;
// }

// // Analytics Types
// export interface AnalyticsFilters {
//   period?: string;
//   start_date?: string;
//   end_date?: string;
// }

// export interface PageView {
//   id: number;
//   page: string;
//   timestamp: string;
// }

// export interface ProductView {
//   id: number;
//   product_id: number;
//   timestamp: string;
// }

// export interface SearchQuery {
//   id: number;
//   query: string;
//   results_count: number;
//   timestamp: string;
// }

// export interface Conversion {
//   id: number;
//   order_id: number;
//   amount: number;
//   timestamp: string;
// }

// export interface Analytics {
//   page_views: PageView[];
//   product_views: ProductView[];
//   search_queries: SearchQuery[];
//   conversions: Conversion[];
// }

// // Resolver Types
// export interface ResolverContext {
//   user?: {
//     id: number;
//     role: string;
//   };
//   req: any;
//   res: any;
// }

// export interface ResolverArgs {
//   [key: string]: any;
// }

// export interface ResolverParent {
//   [key: string]: any;
// } 