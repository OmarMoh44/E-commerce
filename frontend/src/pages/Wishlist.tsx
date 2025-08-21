import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { GET_WISHLIST } from '../graphql/queries';
import { REMOVE_FROM_WISHLIST, ADD_TO_CART } from '../graphql/mutations';

const Wishlist: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: wishlistData, loading: wishlistLoading, error: wishlistError, refetch } = useQuery(GET_WISHLIST);

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => refetch(),
  });

  const [addToCart] = useMutation(ADD_TO_CART);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      setLoading(true);
      await removeFromWishlist({ variables: { productId } });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      setLoading(true);
      await addToCart({ variables: { productId, quantity: 1 } });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (wishlistLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (wishlistError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading wishlist: {wishlistError.message}
        </div>
      </div>
    );
  }

  const wishlistItems = wishlistData?.getUserWishlist || [];

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Start adding products to your wishlist to see them here.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item: any) => {
          const product = item.product;
          const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <img
                  src="https://placehold.net/shape-800x600.png"
                  alt={product.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleViewProduct(product.id)}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  disabled={loading}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 
                  className="text-lg font-medium text-gray-900 mb-2 cursor-pointer hover:text-indigo-600"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.title}
                </h3>
                
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                
                {product.category && (
                  <p className="text-xs text-gray-400 mb-3">{product.category.name}</p>
                )}

                {/* Price */}
                <div className="mb-4">
                  {product.discount > 0 ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <span className="text-green-600 text-sm">In Stock</span>
                  ) : (
                    <span className="text-red-600 text-sm">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={loading || product.stock === 0}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleViewProduct(product.id)}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total items in wishlist:</p>
            <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 