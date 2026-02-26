// routes/payoutRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createFarmerPayout,
  updatePayoutStatus,
  getMyPayouts,
} = require('../controllers/payoutController');

// Admin creates a payout for a farmer
router.post('/', protect, authorize('Admin'), createFarmerPayout);

// Admin updates payout status
router.put('/:transactionId', protect, authorize('Admin'), updatePayoutStatus);

// Farmer views their payouts
router.get('/my', protect, authorize('Farmer'), getMyPayouts);

module.exports = router;