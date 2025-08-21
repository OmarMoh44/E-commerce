import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { SEARCH_PRODUCTS, GET_CATEGORIES } from '../graphql/queries';
import { ADD_TO_CART, ADD_TO_WISHLIST } from '../graphql/mutations';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  brand: string;
  created_at: string;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
  seller: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  reviews?: Array<{
    id: number;
    rating: number;
  }>;
}

interface Category {
  id: number;
  name: string;
}

const Products: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      filters: {
        query: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
        maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: 20
      }
    }
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: SEARCH_PRODUCTS }]
  });

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      setActionError('Please log in to add items to cart');
      return;
    }
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      await addToCart({
        variables: { productId, quantity: 1 }
      });
      // Show success message
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setActionError(error.message || 'Failed to add item to cart');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    if (!user) {
      setActionError('Please log in to add items to wishlist');
      return;
    }
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      await addToWishlist({
        variables: { productId }
      });
      // Show success message
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      setActionError(error.message || 'Failed to add item to wishlist');
    } finally {
      setActionLoading(false);
    }
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {productsError.message}
        </div>
      </div>
    );
  }

  const products = productsData?.searchProducts || [];
  const categories = categoriesData?.categories || [];

  // Validate products data structure
  const validProducts = products.filter((product: any) => 
    product && 
    typeof product.id === 'number' && 
    product.title && 
    typeof product.price === 'number' &&
    product.category &&
    product.category.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action Error Display */}
      {actionError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {actionError}
          <button 
            onClick={() => setActionError(null)}
            className="float-right ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              title="Select a category"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              placeholder="Min price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              placeholder="Max price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            title="Sort products by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="created_at">Date</option>
            <option value="price">Price</option>
            <option value="title">Name</option>
          </select>
          
          <select
            title="Select sort order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Products ({validProducts.length})
        </h2>
        
        {validProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {validProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isInWishlist={false} // TODO: Implement wishlist check
                disabled={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 