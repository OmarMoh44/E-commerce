import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORDER_HISTORY, TRACK_ORDER } from '../graphql/queries';
import { TruckIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(GET_ORDER_HISTORY);
  
  const { data: trackingData, loading: trackingLoading } = useQuery(TRACK_ORDER, {
    variables: { orderId: selectedOrder },
    skip: !selectedOrder
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading orders: {ordersError.message}
        </div>
      </div>
    );
  }

  const orders = ordersData?.orderHistory || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your order history here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-colors ${
                    selectedOrder === order.id ? 'ring-2 ring-indigo-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                
                {trackingLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : trackingData?.trackOrder ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order Tracking</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Order ID:</span>
                          <span className="ml-2 font-medium">{trackingData.trackOrder.order_id}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trackingData.trackOrder.current_status)}`}>
                            {trackingData.trackOrder.current_status}
                          </span>
                        </div>
                        {trackingData.trackOrder.estimated_delivery && (
                          <div>
                            <span className="text-gray-600">Estimated Delivery:</span>
                            <span className="ml-2 font-medium">
                              {new Date(trackingData.trackOrder.estimated_delivery).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {trackingData.trackOrder.tracking_updates && trackingData.trackOrder.tracking_updates.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Tracking History</h3>
                        <div className="space-y-2">
                          {trackingData.trackOrder.tracking_updates.map((update: any, index: number) => (
                            <div key={index} className="text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{update.status}</span>
                                <span className="text-gray-500">
                                  {new Date(update.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600">{update.message}</p>
                              {update.location && (
                                <p className="text-gray-500 text-xs">{update.location}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No tracking information available for this order.</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <p className="text-gray-500">Select an order to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 