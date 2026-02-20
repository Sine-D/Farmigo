const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getFarmerReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getDashboardStats);
router.get('/reports/farmers', getFarmerReport);

module.exports = router;
