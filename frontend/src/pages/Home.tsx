import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { 
  ShoppingBagIcon, 
  StarIcon, 
  ArrowRightIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { GET_CATEGORIES } from '../graphql/queries';

// GraphQL query for featured products
const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    searchProducts(filters: { 
      sortBy: "created_at", 
      sortOrder: "desc", 
      limit: 8 
    }) {
      id
      title
      description
      price
      discount
      stock
      brand
      category {
        name
      }
      reviews {
        rating
      }
    }
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { data: featuredProductsData, loading: productsLoading } = useQuery(GET_FEATURED_PRODUCTS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);

  const featuredProducts = featuredProductsData?.searchProducts || [];
  const categories = categoriesData?.categories || [];

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our E-commerce Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                <span>Shop Now</span>
              </button>
              <button
                onClick={() => navigate('/products')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <TruckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $100</p>
          </div>
          <div className="text-center">
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600">100% secure checkout</p>
          </div>
          <div className="text-center">
            <TagIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600">Guaranteed low prices</p>
          </div>
          <div className="text-center">
            <CreditCardIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {!categoriesLoading && categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category: any) => (
              <div
                key={category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      {!productsLoading && featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked products for you</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => {
              const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
              const averageRating = getAverageRating(product.reviews);
              
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src="https://placehold.net/shape-800x600.png"
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of satisfied customers
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 