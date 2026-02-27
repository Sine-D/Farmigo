const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getFarmerReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

router.use(protect);
router.use(authorize('Admin'));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', asyncHandler(getDashboardStats));

/**
 * @swagger
 * /api/admin/reports/farmers:
 *   get:
 *     summary: Get farmer reports
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/reports/farmers', asyncHandler(getFarmerReport));

module.exports = router;
