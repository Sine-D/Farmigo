const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContactMessages,
    getMyMessages,
    replyToMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/contact
// @desc    Submit a contact form message
router.post('/', submitContactForm);

// @route   GET /api/contact/my
// @desc    Get my own messages
router.get('/my', protect, getMyMessages);

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
router.get('/', protect, authorize('Admin'), getAllContactMessages);

// @route   PUT /api/contact/:id/reply
// @desc    Reply to a message (Admin only)
router.put('/:id/reply', protect, authorize('Admin'), replyToMessage);

module.exports = router;
