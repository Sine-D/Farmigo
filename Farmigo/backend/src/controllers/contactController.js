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

// @desc    Get my own contact messages
// @route   GET /api/contact/my
// @access  Private
const getMyMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Reply to a contact message (Admin only)
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
const replyToMessage = asyncHandler(async (req, res) => {
    const { reply } = req.body;
    
    const message = await Contact.findById(req.params.id);

    if (message) {
        message.reply = reply;
        message.status = 'Replied';
        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

module.exports = {
    submitContactForm,
    getAllContactMessages,
    getMyMessages,
    replyToMessage
};
