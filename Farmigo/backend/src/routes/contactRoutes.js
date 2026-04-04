const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContactMessages
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/contact
// @desc    Submit a contact form message
router.post('/', submitContactForm);

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
router.get('/', protect, authorize('Admin'), getAllContactMessages);

module.exports = router;
