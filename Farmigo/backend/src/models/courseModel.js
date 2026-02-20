const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Sustainable Farming', 'Digital Marketing', 'Financial Literacy', 'Agri-Tech'],
            required: true,
        },
        modules: [
            {
                title: String,
                contentUrl: String, // Video or PDF link
                contentType: { type: String, enum: ['Video', 'PDF', 'Article'] },
            },
        ],
        quizzes: [
            {
                question: String,
                options: [String],
                correctOption: Number, // Index
            },
        ],
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);
