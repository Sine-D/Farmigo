import React from "react";
import "./OrderCard.css";

const OrderCard = ({
  order,
  onCancel,
  onDelete,
  onDeliver,
  isFarmer = false,
}) => {
  return (
    <div className="order-card">

      {/* HEADER */}
      <div className="order-header">
        <div>
          <h3>Order #{order.trackingNumber}</h3>
          <p>Status: {order.status}</p>
          <p>Delivery: {order.deliveryStatus}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p className="total">Total: Rs. {order.totalAmount}</p>
        </div>

        {/* ACTIONS */}
        <div className="order-actions">

          {!isFarmer && order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button className="cancel-btn" onClick={() => onCancel(order._id)}>
              Cancel
            </button>
          )}

          {isFarmer && order.status !== "Delivered" && (
            <button className="deliver-btn" onClick={() => onDeliver(order._id)}>
              Mark Delivered
            </button>
          )}

          <button className="delete-btn" onClick={() => onDelete(order._id)}>
            Delete
          </button>

        </div>
      </div>

      {/* ITEMS */}
      <div className="order-items">
        <h4>Items</h4>

        {order.items.map((item, index) => (
          <div key={index} className="item-box">
            <img src={item.image} alt={item.name} />

            <div>
              <p className="item-name">{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Rs. {item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SHIPPING */}
      <div className="shipping-box">
        <h4>Shipping Address</h4>
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