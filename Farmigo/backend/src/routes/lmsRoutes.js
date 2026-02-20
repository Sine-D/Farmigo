const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    enrollInCourse,
    updateProgress,
    getLearningDashboard,
} = require('../controllers/lmsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/courses')
    .post(protect, authorize('Admin'), createCourse)
    .get(getCourses);

router.route('/courses/:id/enroll')
    .post(protect, enrollInCourse);

router.route('/enrollments/:id')
    .put(protect, updateProgress);

router.get('/dashboard', protect, getLearningDashboard);

module.exports = router;
