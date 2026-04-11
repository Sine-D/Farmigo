const express = require('express');
const router = express.Router();

const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} = require('../controllers/makeOrderController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ------------------- BUYER ROUTES ------------------- //
router.post('/', protect, authorize('Buyer'), createOrder);
router.get('/buyer', protect, authorize('Buyer'), getBuyerOrders);
router.put('/cancel/:id', protect, authorize('Buyer'), cancelOrder);

// ------------------- FARMER ROUTES ------------------- //
router.get('/farmer', protect, authorize('Farmer'), getFarmerOrders);
router.put('/delivery/:id', protect, authorize('Farmer'), updateDeliveryStatus);

// ------------------- PAYMENT ROUTES ------------------- //
router.put('/payment/:id', protect, updatePaymentStatus);

// ------------------- ADMIN / DELETE ROUTE ------------------- //
// Delete an order completely (hard delete)
router.delete('/:id', protect, deleteOrder);

// ------------------- PAYMENT ROUTES ------------------- //
router.put('/payment/:id', protect, updatePaymentStatus);

// ✅ ADD THIS EMAIL ROUTE
router.post('/send-email', protect, async (req, res) => {
  try {
    const nodemailer = require("nodemailer");

    const { email, orderId } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password",
      },
    });

    await transporter.sendMail({
      from: "Farmigo 🥬",
      to: email,
      subject: "Order Payment Successful",
      html: `
        <h2>Payment Successful 🎉</h2>
        <p>Your Order ID: <b>${orderId}</b></p>
        <p>Your order is now being processed.</p>
      `,
    });

    res.json({ message: "Email sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed" });
  }
});

module.exports = router;