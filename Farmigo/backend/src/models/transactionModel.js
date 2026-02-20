const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Order',
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Payment', 'Payout', 'Refund'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
        paymentProvider: {
            type: String,
            required: true,
        },
        reference: {
            type: String, // Transaction ID from payment gateway
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
