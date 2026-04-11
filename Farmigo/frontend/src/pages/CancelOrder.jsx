import React from "react";
import { useNavigate } from "react-router-dom";

const CancelOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", background: "white", padding: "50px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <h1 style={{ color: "#e74c3c", fontSize: "40px" }}>Order Cancelled</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>Your order process was stopped. No charges were made.</p>
        
        <button className="secondary-btn" onClick={() => navigate("/explore")} style={{ textAlign: "center", padding: "15px" }}>
          Return to Marketplace
        </button>
      </div>
    </div>
  );
};

export default CancelOrder;