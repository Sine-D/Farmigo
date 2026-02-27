const express = require('express');
const router = express.Router();
const {
    addSurplus,
    getSurplusItems,
    createDonation,
    getSustainabilityMetrics,
} = require('../controllers/sustainabilityController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/sustainability/surplus:
 *   post:
 *     summary: Add surplus produce
 *     tags: [Sustainability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *   get:
 *     summary: Get all surplus items
 *     tags: [Sustainability]
 */
router.route('/surplus')
    .post(protect, authorize('Farmer'), asyncHandler(addSurplus))
    .get(asyncHandler(getSurplusItems));

/**
 * @swagger
 * /api/sustainability/donate:
 *   post:
 *     summary: Create a donation request
 *     tags: [Sustainability]
 *     security:
 *       - bearerAuth: []
 */
router.route('/donate')
    .post(protect, asyncHandler(createDonation));

/**
 * @swagger
 * /api/sustainability/metrics:
 *   get:
 *     summary: Get sustainability metrics
 *     tags: [Sustainability]
 */
router.route('/metrics')
    .get(asyncHandler(getSustainabilityMetrics));

module.exports = router;
