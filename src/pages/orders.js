import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/GlobalComponents/Notifications";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5542F6]"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
          <div className="text-sm text-gray-600">
            Total: {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Desktop table view */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="basic w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {order.streetAddress}, {order.city} {order.postalCode}, {order.country}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.line_items.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.price_data?.product_data.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet card view */}
        <div className="block lg:hidden space-y-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                {/* Order header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Order #{order.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    order.paid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                {/* Customer info */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
                  <div className="text-sm text-gray-900">{order.name}</div>
                  <div className="text-sm text-gray-600">{order.email}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {order.streetAddress}<br />
                    {order.city} {order.postalCode}, {order.country}
                  </div>
                </div>

                {/* Products */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
                  <div className="space-y-2">
                    {order.line_items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-900">
                          {item.price_data?.product_data.name}
                        </span>
                        <span className="text-gray-600">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No orders found</p>
                <p className="text-sm mt-1">Orders will appear here when customers make purchases</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}