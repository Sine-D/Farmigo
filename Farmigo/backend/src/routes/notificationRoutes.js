const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.route('/').get(protect, asyncHandler(getNotifications));

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id/read').put(protect, asyncHandler(markAsRead));

module.exports = router;
