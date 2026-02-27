const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getMyTransactions,
    createPayout
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('Admin'), getTransactions);

router.route('/my').get(protect, getMyTransactions);

router.route('/payout')
    .post(protect, authorize('Admin'), createPayout);

module.exports = router;
