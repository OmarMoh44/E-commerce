import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SELLER_PRODUCTS } from '../graphql/queries';
import { 
  ADD_PRODUCT, 
  DELETE_PRODUCT, 
  UPDATE_PRODUCT
} from '../graphql/mutations';
import { useAuth } from '../hooks/useAuth';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    categoryName: '',
    brand: ''
  });

  const { data: sellerData, loading: sellerLoading, refetch } = useQuery(GET_SELLER_PRODUCTS, {
    skip: !user
  });

  const [addProduct] = useMutation(ADD_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: {
          data: {
            ...productData,
            price: parseFloat(productData.price.toString()),
            discount: parseFloat(productData.discount.toString()),
            stock: parseInt(productData.stock.toString())
          }
        }
      });
      setShowAddProduct(false);
      setProductData({
        title: '',
        description: '',
        price: 0,
        discount: 0,
        stock: 0,
        categoryName: '',
        brand: ''
      });
      refetch();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({ variables: { productId } });
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateProduct = async (field: string, value: any, productId: number) => {
    try {
      const details: any = {};
      
      // Set only the field being updated
      switch (field) {
        case 'title':
          details.title = value;
          break;
        case 'description':
          details.description = value;
          break;
        case 'price':
          details.price = parseFloat(value);
          break;
        case 'discount':
          details.discount = parseFloat(value);
          break;
        case 'stock':
          details.stock = parseInt(value);
          break;
        case 'brand':
          details.brand = value;
          break;
        default:
          return;
      }

      await updateProduct({ 
        variables: { 
          details, 
          productId 
        } 
      });
      refetch();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  if (user?.role !== 'Seller') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Seller privileges required.
        </div>
      </div>
    );
  }

  const products = sellerData?.user?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter((p: any) => p.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.length > 0 
                  ? (products.reduce((sum: number, p: any) => 
                      sum + (p.reviews?.reduce((rSum: number, r: any) => rSum + r.rating, 0) || 0), 0) / 
                    products.reduce((sum: number, p: any) => sum + (p.reviews?.length || 0), 0)).toFixed(1) || '0.0'
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
        </div>
        
        {sellerLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src="/placeholder.png" 
                            alt={product.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.category?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price}</div>
                      {product.discount > 0 && (
                        <div className="text-sm text-green-600">-${product.discount} off</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Edit product"
                        aria-label={`Edit ${product.title}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete product"
                        aria-label={`Delete ${product.title}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={productData.title}
                      onChange={(e) => setProductData({...productData, title: e.target.value})}
                      placeholder="Enter product title"
                      title="Product title"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={productData.description}
                      onChange={(e) => setProductData({...productData, description: e.target.value})}
                      placeholder="Enter product description"
                      title="Product description"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productData.price}
                        onChange={(e) => setProductData({...productData, price: parseFloat(e.target.value)})}
                        placeholder="0.00"
                        title="Product price"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productData.discount}
                        onChange={(e) => setProductData({...productData, discount: parseFloat(e.target.value)})}
                        placeholder="0.00"
                        title="Discount amount"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        required
                        value={productData.stock}
                        onChange={(e) => setProductData({...productData, stock: parseInt(e.target.value)})}
                        placeholder="0"
                        title="Stock quantity"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <input
                        type="text"
                        value={productData.brand}
                        onChange={(e) => setProductData({...productData, brand: e.target.value})}
                        placeholder="Enter brand name"
                        title="Product brand"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      required
                      value={productData.categoryName}
                      onChange={(e) => setProductData({...productData, categoryName: e.target.value})}
                      placeholder="Enter category name"
                      title="Product category"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => handleUpdateProduct('title', e.target.value, editingProduct.id)}
                    placeholder="Enter product title"
                    title="Product title"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => handleUpdateProduct('description', e.target.value, editingProduct.id)}
                    placeholder="Enter product description"
                    title="Product description"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => handleUpdateProduct('price', e.target.value, editingProduct.id)}
                      placeholder="0.00"
                      title="Product price"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.discount}
                      onChange={(e) => handleUpdateProduct('discount', e.target.value, editingProduct.id)}
                      placeholder="0.00"
                      title="Discount amount"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => handleUpdateProduct('stock', e.target.value, editingProduct.id)}
                      placeholder="0"
                      title="Stock quantity"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                      type="text"
                      value={editingProduct.brand}
                      onChange={(e) => handleUpdateProduct('brand', e.target.value, editingProduct.id)}
                      placeholder="Enter brand name"
                      title="Product brand"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 