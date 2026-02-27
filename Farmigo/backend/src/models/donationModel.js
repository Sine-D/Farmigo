const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Can be Farmer or Buyer
        },
        ngo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                name: String,
                quantity: Number,
                unit: String,
            },
        ],
        impactReport: {
            familiesSupported: Number,
            kgDonated: Number,
        },
        status: {
            type: String,
            enum: ['Pending', 'Received', 'Distributed'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Donation', donationSchema);
