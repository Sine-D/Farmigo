import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Payment.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const order = state?.orderData;

  const [method, setMethod] = useState("card");
  const [paid, setPaid] = useState(false);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  if (!order) return <p>No order data found</p>;

  const handlePayNow = () => {
    // simulate payment success
    setTimeout(() => {
      setPaid(true);
    }, 1000);
  };

  return (
    <div className="payment-page">

      <h1 className="page-title">Order Confirmation</h1>

      <div className="payment-container">

        {/* LEFT SIDE - ORDER SUMMARY */}
        <div className="order-summary">

          <div className="status-icon">✔</div>

          <h2>Booking Confirmed</h2>
          <p className="sub-text">
            Review your order before completing payment.
          </p>

          <div className="summary-box">

            <p><b>Product:</b> {order.items[0].name}</p>
            <p><b>Quantity:</b> {order.items[0].quantity}</p>
            <p><b>Price:</b> Rs. {order.items[0].price}</p>
            <p>
              <b>Total:</b> Rs.{" "}
              {order.items[0].price * order.items[0].quantity}
            </p>

            <hr />

            <p><b>Delivery:</b> Standard Doorstep</p>
            <p>
              <b>Address:</b>{" "}
              {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}
            </p>

            <p><b>Estimated Email:</b> Sent after payment</p>
          </div>

          {paid ? (
            <div className="success-box">
              <h3>🎉 Payment Successful</h3>
              <p>Your order has been saved successfully.</p>
              <p>📧 Email confirmation sent to your inbox.</p>

              <button className="secondary-btn">
                Save Receipt
              </button>

              <button className="secondary-btn">
                Send Email Again
              </button>
            </div>
          ) : (
            <button className="pay-btn" onClick={handlePayNow}>
              Pay Now
            </button>
          )}
        </div>

        {/* RIGHT SIDE - PAYMENT OPTIONS */}
        <div className="payment-box">

          <h2>Select Payment Method</h2>

          <div className="payment-methods">

            <label>
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              Credit / Debit Cards (Visa, Mastercard, AMEX)
            </label>

            <label>
              <input
                type="radio"
                onChange={() => setMethod("koko")}
              />
              KOKO (Buy Now Pay Later)
            </label>

            <label>
              <input
                type="radio"
                onChange={() => setMethod("cod")}
              />
              Cash on Delivery (COD)
            </label>

            <label>
              <input
                type="radio"
                onChange={() => setMethod("paypal")}
              />
              PayPal
            </label>
          </div>

          {method === "card" && (
            <div className="card-form">
              <input
                placeholder="Card Number"
                onChange={(e) =>
                  setCard({ ...card, number: e.target.value })
                }
              />
              <input
                placeholder="Card Holder Name"
                onChange={(e) =>
                  setCard({ ...card, name: e.target.value })
                }
              />
              <input
                placeholder="Expiry (MM/YY)"
                onChange={(e) =>
                  setCard({ ...card, expiry: e.target.value })
                }
              />
              <input
                placeholder="CVV"
                onChange={(e) =>
                  setCard({ ...card, cvv: e.target.value })
                }
              />
            </div>
          )}

          <div className="payment-info">
            {method === "card" &&
              "Supports Visa, Mastercard & AMEX securely"}
            {method === "koko" &&
              "Split your payment into installments with KOKO"}
            {method === "cod" &&
              "Pay when your order is delivered"}
            {method === "paypal" &&
              "You will be redirected to PayPal"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;