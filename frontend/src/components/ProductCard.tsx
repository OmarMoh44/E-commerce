import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    discount: number;
    brand: string;
    category: { name: string };
    reviews?: Array<{ rating: number }>;
  };
  onAddToCart: (productId: number) => void;
  onAddToWishlist: (productId: number) => void;
  isInWishlist: boolean;
  disabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  disabled = false
}) => {
  const discountedPrice = product.price - (product.price * product.discount / 100);
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src="https://placehold.net/shape-800x600.png"
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount.toPrecision(2)}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist(product.id)}
          disabled={disabled}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </span>
          <span className="text-xs text-gray-500">{product.brand}</span>
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({reviews.length})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={disabled}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>{disabled ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 