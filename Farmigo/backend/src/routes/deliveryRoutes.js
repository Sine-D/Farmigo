// routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  updateDispatch,
  getOrdersForDelivery,
  confirmDelivery,
} = require('../controllers/deliveryController');

// Get all orders for delivery tracking
router.get('/', protect, authorize('Farmer', 'Admin'), getOrdersForDelivery);

// Update dispatch info (Admin/Farmer)
router.put('/:orderId/dispatch', protect, authorize('Farmer', 'Admin'), updateDispatch);

// Confirm delivery (Farmer)
router.put('/:orderId/confirm', protect, authorize('Farmer'), confirmDelivery);

module.exports = router;