import React, { useEffect, useState } from "react";
import {
  getBuyerOrders,
  cancelOrder,
  deleteOrder,
} from "../utils/orderApi";
import OrderCard from "../components/OrderCard";

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await getBuyerOrders();
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
        My Orders
      </h2>

      <div className="max-w-5xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;