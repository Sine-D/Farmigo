const mongoose = require('mongoose');

const disputeMessageSchema = mongoose.Schema(
    {
        dispute: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Dispute',
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

module.exports = mongoose.model('DisputeMessage', disputeMessageSchema);
