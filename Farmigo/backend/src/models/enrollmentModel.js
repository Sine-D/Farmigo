const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        progress: {
            type: Number,
            default: 0, // Percentage
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        score: {
            type: Number,
            default: 0,
        },
        certificateUrl: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
