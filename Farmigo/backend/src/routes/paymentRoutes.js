// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  verifyPayment,
  getMyTransactions,
  webhookHandler,
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Create payment for an order (Buyer)
router.post('/create/:orderId', protect, authorize('Buyer'), createPaymentIntent);

// Verify payment after success (Buyer)
router.post('/verify/:orderId', protect, authorize('Buyer'), verifyPayment);

// Get logged-in user's transaction history
router.get('/my-transactions', protect, getMyTransactions);

// Webhook endpoint (no auth)
router.post('/webhook', webhookHandler);

module.exports = router;