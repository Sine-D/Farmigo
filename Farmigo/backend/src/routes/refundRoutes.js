const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { requestRefund, approveRefund } = require('../controllers/refundController');

// Buyer requests a refund
router.post('/request/:orderId', protect, authorize('Buyer'), requestRefund);

// Admin approves refund
router.put('/approve/:transactionId', protect, authorize('Admin'), approveRefund);

module.exports = router;