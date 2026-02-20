const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a product name'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        countInStock: {
            type: Number,
            required: [true, 'Please add stock quantity'],
            default: 0,
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
