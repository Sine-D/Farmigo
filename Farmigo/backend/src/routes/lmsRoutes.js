const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    enrollInCourse,
    updateProgress,
    getLearningDashboard,
    deleteCourse,
    updateCourse,
} = require('../controllers/lmsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/lms/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [LMS]
 *   post:
 *     summary: Create a course (Admin only)
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 */
router.route('/courses')
    .post(protect, authorize('Admin'), asyncHandler(createCourse))
    .get(asyncHandler(getCourses));

router.route('/courses/:id')
    .put(protect, authorize('Admin'), asyncHandler(updateCourse))
    .delete(protect, authorize('Admin'), asyncHandler(deleteCourse));

/**
 * @swagger
 * /api/lms/courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/courses/:id/enroll')
    .post(protect, asyncHandler(enrollInCourse));

/**
 * @swagger
 * /api/lms/enrollments/{id}:
 *   put:
 *     summary: Update course progress
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/enrollments/:id')
    .put(protect, asyncHandler(updateProgress));

/**
 * @swagger
 * /api/lms/dashboard:
 *   get:
 *     summary: Get learning dashboard
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 */
router.get('/dashboard', protect, asyncHandler(getLearningDashboard));

module.exports = router;
