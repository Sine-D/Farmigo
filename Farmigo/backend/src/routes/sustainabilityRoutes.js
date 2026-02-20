const express = require('express');
const router = express.Router();
const {
    addSurplus,
    getSurplusItems,
    createDonation,
    getSustainabilityMetrics,
} = require('../controllers/sustainabilityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/surplus')
    .post(protect, authorize('Farmer'), addSurplus)
    .get(getSurplusItems);

router.route('/donate')
    .post(protect, createDonation);

router.route('/metrics')
    .get(getSustainabilityMetrics);

module.exports = router;
