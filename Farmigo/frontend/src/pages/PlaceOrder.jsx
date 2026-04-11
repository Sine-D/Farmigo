import React, { useState, useEffect } from "react";
import { createOrder } from "../utils/orderApi";
import { getProducts } from "../utils/productApi";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    items: [{ productId: "", quantity: 1 }],
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "cash_on_delivery",
    deliveryMethod: "standard",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProducts();
      setProducts(data.filter((p) => p.isApproved && p.countInStock > 0));
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "postalCode", "country"].includes(name)) {
      setFormData({
        ...formData,
        shippingAddress: { ...formData.shippingAddress, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const selectedProduct = products.find(
    (p) => p._id === formData.items[0].productId
  );

  const goToPayment = () => {
    if (!selectedProduct) {
      setMessage("Please select a product first");
      return;
    }

    navigate("/payment", {
      state: {
        orderData: {
          farmerId: selectedProduct.farmer,
          items: [
            {
              name: selectedProduct.name,
              image: selectedProduct.image,
              productId: selectedProduct._id,
              quantity: formData.items[0].quantity,
              price: selectedProduct.price,
            },
          ],
          shippingAddress: formData.shippingAddress,
          totalAmount:
            selectedProduct.price * formData.items[0].quantity,
        },
      },
    });
  };

  return (
    <div className="place-order-page">
      <div className="place-order-container">
        <h2 className="place-order-title">Checkout</h2>

        {message && <div className="success-msg">{message}</div>}

        <form className="place-order-grid">
          {/* LEFT */}
          <div className="place-order-card">
            <h2>Product Details</h2>

            <select
              name="productId"
              value={formData.items[0].productId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  items: [
                    {
                      ...formData.items[0],
                      productId: e.target.value,
                    },
                  ],
                })
              }
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - Rs.{p.price}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              value={formData.items[0].quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  items: [
                    {
                      ...formData.items[0],
                      quantity: Number(e.target.value),
                    },
                  ],
                })
              }
              min="1"
            />

            <h2>Shipping Details</h2>

            <input name="address" placeholder="Address" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />
            <input name="country" placeholder="Country" onChange={handleChange} />

            
          </div>

          {/* RIGHT */}
          <div className="place-order-card">
            <h2>Order Summary</h2>

            {selectedProduct ? (
              <div className="order-summary-box">
                <p>{selectedProduct.name}</p>
                <p>Qty: {formData.items[0].quantity}</p>
                <p>
                  Total: Rs.
                  {selectedProduct.price *
                    formData.items[0].quantity}
                </p>

                <button type="button" onClick={goToPayment}>
              Continue to Payment →
            </button>
              </div>
            ) : (
              <p>Select product</p>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;