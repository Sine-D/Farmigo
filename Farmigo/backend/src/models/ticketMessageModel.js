const mongoose = require('mongoose');

// Stores a conversation thread inside a support ticket.
// Kept as a separate collection to avoid growing the Ticket document.
const ticketMessageSchema = mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Ticket',
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        senderRole: {
            type: String,
            enum: ['Buyer', 'Farmer', 'Admin', 'Support', 'NGO'],
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
            trim: true,
            maxlength: 2000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TicketMessage', ticketMessageSchema);