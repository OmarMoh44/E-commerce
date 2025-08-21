import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, 
  CheckCircleIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import { GET_CART } from '../graphql/queries';
import { PROCESS_ORDER, CREATE_ADDRESS } from '../graphql/mutations';
import { useAuth } from '../hooks/useAuth';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(GET_CART);
  const [processOrder] = useMutation(PROCESS_ORDER);
  const [createAddress] = useMutation(CREATE_ADDRESS);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Validate that all required fields are filled
      const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredShippingFields.filter(field => !shippingData[field as keyof typeof shippingData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required shipping fields: ${missingFields.join(', ')}`);
      }
      
      const requiredPaymentFields = ['cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'];
      const missingPaymentFields = requiredPaymentFields.filter(field => !paymentData[field as keyof typeof paymentData]);
      
      if (missingPaymentFields.length > 0) {
        throw new Error(`Please fill in all required payment fields: ${missingPaymentFields.join(', ')}`);
      }
      
      // Map payment method based on user input
      let paymentMethod: 'CARD' | 'PAYPAL' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'WALLET' = 'CARD';
      
      if (paymentData.cardNumber) {
        paymentMethod = 'CARD';
      }
      
      // First, create the address
      const addressData = {
        full_name: `${shippingData.firstName} ${shippingData.lastName}`,
        city: shippingData.city,
        country: shippingData.country,
        phone: shippingData.phone,
        is_default: false
      };
      
      console.log('Creating address with data:', addressData);
      
      const addressResponse = await createAddress({
        variables: {
          data: addressData
        }
      });
      
      if (!addressResponse.data?.createAddress?.id) {
        throw new Error('Failed to create address');
      }
      
      const addressId = addressResponse.data.createAddress.id;
      console.log('Created address with ID:', addressId);
      
      // Then process the order with the created address
      console.log('Processing order with payment method:', paymentMethod, 'and address ID:', addressId);
      
      const orderResponse = await processOrder({
        variables: {
          paymentMethod,
          addressId
        }
      });
      
      if (orderResponse.data?.processOrder) {
        console.log('Order processed successfully:', orderResponse.data.processOrder);
        setStep(4);
      } else {
        throw new Error('Failed to process order');
      }
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = `Network error: ${error.networkError.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error placing order: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading cart: {cartError.message}
        </div>
      </div>
    );
  }

  const cart = cartData?.cart;
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to your cart to proceed with checkout.</p>
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

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.product.price - (item.product.price * (item.product.discount || 0) / 100);
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2">Shipping</span>
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2">Payment</span>
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 4 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2">Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                      placeholder="Enter first name"
                      title="First name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                      placeholder="Enter last name"
                      title="Last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={shippingData.email}
                      onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                      placeholder="Enter your email"
                      title="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                      title="Phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={shippingData.address}
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    placeholder="Enter your address"
                    title="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      placeholder="Enter city"
                      title="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                      placeholder="Enter state"
                      title="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                      placeholder="Enter ZIP Code"
                      title="ZIP Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                    placeholder="Enter cardholder name"
                    title="Cardholder name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month</label>
                    <select
                      required
                      value={paymentData.expiryMonth}
                      onChange={(e) => setPaymentData({...paymentData, expiryMonth: e.target.value})}
                      title="Expiry month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">MM</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Year</label>
                    <select
                      required
                      value={paymentData.expiryYear}
                      onChange={(e) => setPaymentData({...paymentData, expiryYear: e.target.value})}
                      title="Expiry year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">YYYY</option>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      placeholder="Enter CVV"
                      title="CVV"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <LockClosedIcon className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Review</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-900">{shippingData.firstName} {shippingData.lastName}</p>
                    <p className="text-gray-600">{shippingData.address}</p>
                    <p className="text-gray-600">{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p className="text-gray-600">{shippingData.email} | {shippingData.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-900">{paymentData.cardName}</p>
                    <p className="text-gray-600">**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                    <p className="text-gray-600">Expires: {paymentData.expiryMonth}/{paymentData.expiryYear}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive an email confirmation shortly.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-3 mb-4">
              {items.map((item: any) => {
                const price = item.product.price - (item.product.price * (item.product.discount || 0) / 100);
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://placehold.net/shape-800x600.png"
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 