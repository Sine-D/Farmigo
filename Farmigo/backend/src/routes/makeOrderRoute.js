const express = require('express');
const router = express.Router();

const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  cancelOrder,
} = require('../controllers/makeOrderController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ------------------- BUYER ROUTES ------------------- //
router.post('/', protect, authorize('buyer'), createOrder);
router.get('/buyer', protect, authorize('buyer'), getBuyerOrders);
router.put('/cancel/:id', protect, authorize('buyer'), cancelOrder);

// ------------------- FARMER ROUTES ------------------- //
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.put('/delivery/:id', protect, authorize('farmer'), updateDeliveryStatus);

// ------------------- PAYMENT ROUTES ------------------- //
router.put('/payment/:id', protect, updatePaymentStatus);

module.exports = router;