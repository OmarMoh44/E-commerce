import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { ShoppingCartIcon, HeartIcon, StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../graphql/mutations';
import { GET_PRODUCT } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';



const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, {
    variables: { id: parseInt(id!) },
    skip: !id
  });

  const [addToCart] = useMutation(ADD_TO_CART);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  const product = productData?.getProduct;

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      await addToCart({
        variables: { 
          productId: product.id, 
          quantity: quantity 
        }
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      await addToWishlist({
        variables: { productId: product.id }
      });
      alert('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Error updating wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {productError ? `Error loading product: ${productError.message}` : 'Product not found'}
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const reviews = product.reviews || [];

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src="https://placehold.net/shape-800x600.png"
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.discount > 0 ? (
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {product.discount.toPrecision(2)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={loading}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              title="Add to Wishlist"
            >
              <HeartIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 