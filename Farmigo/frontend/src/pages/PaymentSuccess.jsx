import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  return (
    <div className="payment-page">
      <div className="result-card" style={{ textAlign: "center", maxWidth: "600px", margin: "auto", background: "white", padding: "40px", borderRadius: "20px" }}>
        <div className="status-icon" style={{ margin: "0 auto 20px", width: "60px", height: "60px", fontSize: "30px" }}>✓</div>
        <h1 style={{ color: "var(--primary-green)" }}>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order for <b>{order?.items[0].name}</b> is being processed.</p>
        
        <div className="summary-box" style={{ margin: "20px 0", textAlign: "left" }}>
          <p>Order ID: #ORD-{Math.floor(Math.random() * 100000)}</p>
          <p>Amount Paid: Rs.{order?.totalAmount}</p>
        </div>

        <button className="pay-btn" onClick={() => navigate("/explore")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;