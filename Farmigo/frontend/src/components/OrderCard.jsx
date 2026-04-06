import React from "react";

const OrderCard = ({
  order,
  onCancel,
  onDelete,
  onDeliver,
  isFarmer = false,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-green-700">
            Order #{order.trackingNumber}
          </h3>
          <p className="text-gray-600">Status: {order.status}</p>
          <p className="text-gray-600">Delivery: {order.deliveryStatus}</p>
          <p className="text-gray-600">Payment: {order.paymentStatus}</p>
          <p className="text-gray-800 font-semibold mt-2">
            Total: Rs. {order.totalAmount}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isFarmer && order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button
              onClick={() => onCancel(order._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          )}

          {isFarmer && order.status !== "Delivered" && (
            <button
              onClick={() => onDeliver(order._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            >
              Mark Delivered
            </button>
          )}

          <button
            onClick={() => onDelete(order._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="font-semibold text-lg text-gray-800 mb-3">Items</h4>
        <div className="grid gap-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-green-50 rounded-2xl p-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <h5 className="font-semibold text-gray-800">{item.name}</h5>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="text-gray-600">Rs. {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 bg-gray-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
        <p>{order.shippingAddress?.address}</p>
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
        </p>
        <p>{order.shippingAddress?.country}</p>
      </div>
    </div>
  );
};

export default OrderCard;