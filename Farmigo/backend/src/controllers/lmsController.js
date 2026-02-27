const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

// @desc    Create a new course
// @route   POST /api/lms/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { title, description, category, modules, quizzes } = req.body;

    const course = await Course.create({
        title,
        description,
        category,
        modules,
        quizzes,
        instructor: req.user._id,
    });

    res.status(201).json(course);
};

// @desc    Get all courses
// @route   GET /api/lms/courses
// @access  Public
const getCourses = async (req, res) => {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
};

// @desc    Enroll in a course
// @route   POST /api/lms/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
    const enrollmentExists = await Enrollment.findOne({
        user: req.user._id,
        course: req.params.id,
    });

    if (enrollmentExists) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
        user: req.user._id,
        course: req.params.id,
    });

    res.status(201).json(enrollment);
};

// @desc    Update course progress
// @route   PUT /api/lms/enrollments/:id
// @access  Private
const updateProgress = async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (enrollment) {
        if (enrollment.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }
        enrollment.progress = req.body.progress || enrollment.progress;
        if (enrollment.progress >= 100) {
            enrollment.isCompleted = true;
        }
        const updatedEnrollment = await enrollment.save();
        res.json(updatedEnrollment);
    } else {
        res.status(404);
        throw new Error('Enrollment not found');
    }
};

// @desc    Get user learning dashboard
// @route   GET /api/lms/dashboard
// @access  Private
const getLearningDashboard = async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
    res.json(enrollments);
};

module.exports = {
    createCourse,
    getCourses,
    enrollInCourse,
    updateProgress,
    getLearningDashboard,
};
