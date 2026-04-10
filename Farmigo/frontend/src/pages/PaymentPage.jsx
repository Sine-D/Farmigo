import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.orderData;

  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  if (!order) return <p className="page-title">No order data found.</p>;

  // ✅ VALIDATION
  const isCardValid =
    card.number.length === 16 &&
    card.name &&
    card.expiry &&
    card.cvv.length === 3;

  const canPay = method !== "card" ? true : isCardValid;

  // Navigate to Payment Success Page
  const handlePay = () => {
    if (!canPay) return;
    // You can pass the order data to the success page if needed
    navigate("/payment-success", { state: { order } });
  };

  // Navigate to Cancel Order Page with confirmation
  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (confirmCancel) {
      navigate("/cancel-order");
    }
  };

  return (
    <div className="payment-page">
      <h2 className="page-title">Order Confirmation</h2>

      <div className="payment-container">
        {/* LEFT - PAYMENT METHODS */}
        <div className="payment-column-left">
          <div className="payment-box">
            <h2>Payment Methods</h2>
            <p className="sub-text">Choose how you'd like to pay</p>

            <div className="payment-methods">
              <label className={method === "card" ? "selected-method" : ""}>
                <input
                  type="radio"
                  name="payMethod"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />
                💳 Credit / Debit Card
              </label>

              <label className={method === "cod" ? "selected-method" : ""}>
                <input
                  type="radio"
                  name="payMethod"
                  value="cod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                />
                💵 Cash on Delivery
              </label>

              <label className={method === "koko" ? "selected-method" : ""}>
                <input
                  type="radio"
                  name="payMethod"
                  value="koko"
                  checked={method === "koko"}
                  onChange={() => setMethod("koko")}
                />
                📱 KOKO (Buy Now Pay Later)
              </label>

              <label className={method === "paypal" ? "selected-method" : ""}>
                <input
                  type="radio"
                  name="payMethod"
                  value="paypal"
                  checked={method === "paypal"}
                  onChange={() => setMethod("paypal")}
                />
                🅿️ PayPal
              </label>
            </div>

            {/* CARD FORM */}
            {method === "card" && (
              <div className="card-form">
                <input
                  placeholder="Card Number (16 digits)"
                  maxLength="16"
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
                <input
                  placeholder="Name on Card"
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    placeholder="MM/YY"
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  />
                  <input
                    placeholder="CVV"
                    maxLength="3"
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="payment-info">
              {method === "card" && "Supports Visa, Mastercard, and AMEX"}
              {method === "koko" && "Split your payment into 3 installments"}
              {method === "cod" && "Pay when the items reach your doorstep"}
              {method === "paypal" && "Safe and secure PayPal checkout"}
            </div>
          </div>

          {/* BACK BUTTON - Bottom of Left Side */}
          <button className="back-link-btn" onClick={() => navigate(-1)}>
            ← Back to Checkout
          </button>
        </div>

        {/* RIGHT - SUMMARY & ACTION BUTTONS */}
        <div className="order-summary">
          <div className="status-icon">✓</div>
          <h2>Order Summary</h2>
          <p className="sub-text">Check your details before paying</p>

          <div className="summary-box">
            <p><b>Product:</b> {order.items[0].name}</p>
            <p><b>Quantity:</b> {order.items[0].quantity}</p>
            <p><b>Shipping to:</b> {order.shippingAddress.city}, {order.shippingAddress.country}</p>
            <hr style={{ margin: "10px 0", border: "0.5px solid #eee" }} />
            <p style={{ fontSize: "1.2rem", color: "var(--primary-green)" }}>
              <b>Total Amount: Rs.{order.totalAmount}</b>
            </p>
          </div>

          <div className="action-buttons">
            <button 
              className="pay-btn" 
              onClick={handlePay} 
              disabled={!canPay}
              style={{ opacity: canPay ? 1 : 0.6 }}
            >
              Pay Now →
            </button>

            <button className="cancel-order-btn" onClick={handleCancel}>
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;