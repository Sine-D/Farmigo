import React, { useEffect, useState } from "react";
import {
  getFarmerOrders,
  updateDeliveryStatus,
  deleteOrder,
} from "../utils/orderApi";
import OrderCard from "../components/OrderCard";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await getFarmerOrders();
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    try {
      await updateDeliveryStatus(id, {
        deliveryStatus: "delivered",
        isDelivered: true,
      });
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
        Farmer Orders
      </h2>

      <div className="max-w-5xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No farmer orders found</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onDelete={handleDelete}
              onDeliver={handleDeliver}
              isFarmer={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FarmerOrders;