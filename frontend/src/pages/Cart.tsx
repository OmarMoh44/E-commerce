import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { GET_CART } from '../graphql/queries';
import { REMOVE_FROM_CART } from '../graphql/mutations';

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: cartData, loading: cartLoading, error: cartError, refetch } = useQuery(GET_CART);

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => refetch(),
  });

  const handleRemoveItem = async (itemId: number) => {
    try {
      setLoading(true);
      await removeFromCart({ variables: { itemId } });
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading cart: {cartError.message}
        </div>
      </div>
    );
  }

  const cart = cartData?.cart;
  const items = cart?.items || [];

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.product.price - (item.product.price * (item.product.discount || 0) / 100);
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to your cart to get started.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Items ({items.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {items.map((item: any) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.product.title}</h3>
                      <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-medium text-gray-900">
                        ${((item.product.price - (item.product.price * (item.product.discount || 0) / 100)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={loading}
                      className="ml-4 p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                      aria-label="Remove item from cart"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-green-600">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 