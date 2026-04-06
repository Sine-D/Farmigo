import React, { useState } from "react";
import { createOrder } from "../utils/orderApi";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    items: [
      {
        productId: "",
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "cash_on_delivery",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "postalCode", "country"].includes(name)) {
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [name]: value,
        },
      });
    } else if (name === "productId" || name === "quantity") {
      setFormData({
        ...formData,
        items: [
          {
            ...formData.items[0],
            [name]: name === "quantity" ? Number(value) : value,
          },
        ],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createOrder(formData);
      setMessage("Order placed successfully!");
      console.log(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Place Order</h2>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            name="productId"
            placeholder="Product ID"
            value={formData.items[0].productId}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.items[0].quantity}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.shippingAddress.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.shippingAddress.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.shippingAddress.postalCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.shippingAddress.country}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;