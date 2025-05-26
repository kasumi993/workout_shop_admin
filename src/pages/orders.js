// src/pages/orders.js
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
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                  {order.paid ? 'YES' : 'NO'}
                </td>
                <td>
                  {order.name} {order.email}<br />
                  {order.city} {order.postalCode} {order.country}<br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((item, index) => (
                    <div key={index}>
                      {item.price_data?.product_data.name} x {item.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </MainLayout>
  );
}