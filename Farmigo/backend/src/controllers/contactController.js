const Contact = require('../models/contactModel');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please provide all required fields (name, email, message)');
    }

    const contact = await Contact.create({
        name,
        email,
        message,
    });

    if (contact) {
        res.status(201).json({
            message: 'Message sent successfully!',
            data: contact
        });
    } else {
        res.status(400);
        throw new Error('Invalid contact data provided');
    }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

module.exports = {
    submitContactForm,
    getAllContactMessages
};
