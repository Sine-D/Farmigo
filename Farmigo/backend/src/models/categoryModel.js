const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: String,
        icon: String, // URL or string identifier
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', categorySchema);
