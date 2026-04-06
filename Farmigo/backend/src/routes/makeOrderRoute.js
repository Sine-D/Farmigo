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

module.exports = router;