import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

import {
  updatePaymentStatus,
  sendOrderEmail,
} from "../utils/orderApi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 🚨 Redirect if no order (prevents crashes on refresh)
  useEffect(() => {
    if (!order) {
      navigate("/explore");
    }
  }, [order, navigate]);

  // ✅ UPDATE PAYMENT + SEND EMAIL
  useEffect(() => {
    const completePayment = async () => {
      try {
        if (!order?._id) return;

        await updatePaymentStatus(order._id, {
          status: "Paid",
        });

        await sendOrderEmail({
          orderId: order._id,
          email: userInfo?.email,
        });

        console.log("✅ Payment updated & email sent");
      } catch (err) {
        console.error("Payment update error:", err);
      }
    };

    completePayment();
  }, [order, userInfo]);

  // ✅ DOWNLOAD INVOICE (FIXED)
  const downloadInvoice = () => {
    const doc = new jsPDF();

    // 🟢 HEADER
    doc.setFontSize(20);
    doc.text("FARMIGO", 14, 20);

    doc.setFontSize(10);
    doc.text("Fresh Farm Products Marketplace", 14, 26);
    doc.text("Email: support@farmigo.com", 14, 32);

    // 🟢 INVOICE INFO
    doc.setFontSize(16);
    doc.text("INVOICE", 150, 20);

    doc.setFontSize(10);
    doc.text(`Invoice ID: ${order?._id || ""}`, 150, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 34);

    // 🟢 CUSTOMER INFO
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 50);

    doc.setFontSize(10);
    doc.text(userInfo?.email || "Customer", 14, 56);
    doc.text(order?.shippingAddress?.city || "", 14, 62);

    // 🟢 TABLE (FIXED SAFE MAP)
    autoTable(doc, {
      startY: 70,
      head: [["Product", "Qty", "Price", "Total"]],
      body: (order?.items || []).map((item) => [
        item.name,
        item.quantity,
        `Rs.${item.price}`,
        `Rs.${item.quantity * item.price}`,
      ]),
    });

    // 🟢 TOTAL (SAFE)
    const finalY = doc.lastAutoTable?.finalY || 90;

    doc.setFontSize(12);
    doc.text(`Total Amount: Rs.${order?.totalAmount || 0}`, 14, finalY + 10);

    // 🟢 FOOTER
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "Thank you for shopping with Farmigo 🌱",
      14,
      finalY + 25
    );

    doc.save(`invoice_${order?._id || "order"}.pdf`);
  };

  if (!order) return <p>No order found</p>;

  return (
    <div className="payment-page">
      <div className="result-card">

        <div className="status-icon success">✓</div>

        <h1>Payment Successful!</h1>

        <p>
          Your order for <b>{order?.items?.[0]?.name}</b> is confirmed 🎉
        </p>

        <div className="summary-box">
          <p><b>Order ID:</b> {order?._id}</p>
          <p><b>Total Paid:</b> Rs.{order?.totalAmount}</p>
          <p><b>Email:</b> {userInfo?.email}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">

          <button onClick={downloadInvoice}>
            📄 Download Invoice
          </button>

          <button
            onClick={() =>
              sendOrderEmail({
                orderId: order?._id,
                email: userInfo?.email,
              })
            }
          >
            📧 Send Email Again
          </button>

          <button onClick={() => navigate("/explore")}>
            Continue Shopping
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;