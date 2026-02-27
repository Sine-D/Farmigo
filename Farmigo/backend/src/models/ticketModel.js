const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Open', 'In Progress', 'Closed'],
            default: 'Open',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Ticket', ticketSchema);
