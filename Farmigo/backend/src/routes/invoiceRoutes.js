// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { generateInvoice } = require('../controllers/invoiceController');

// Generate invoice PDF for a specific order
router.get('/:orderId', protect, generateInvoice);

module.exports = router;