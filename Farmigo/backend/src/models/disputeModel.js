const mongoose = require('mongoose');

const disputeSchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Order',
            index: true,
        },
        openedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // All parties involved (buyer + farmer(s)).
        involvedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                index: true,
            },
        ],
        reason: {
            type: String,
            required: true,
            enum: [
                'Late Delivery',
                'Wrong Item',
                'Poor Quality',
                'Payment Issue',
                'Damaged Item',
                'Other',
            ],
            default: 'Other',
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
            maxlength: 3000,
        },
        status: {
            type: String,
            enum: ['Open', 'Under Review', 'Resolved', 'Rejected'],
            default: 'Open',
            index: true,
        },
        resolutionNote: {
            type: String,
            default: '',
            maxlength: 3000,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resolvedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);
