const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Buyer'), addOrderItems)
    .get(protect, authorize('Admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, authorize('Admin', 'Support'), updateOrderToDelivered);

module.exports = router;
