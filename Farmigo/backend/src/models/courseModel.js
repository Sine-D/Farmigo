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
            enum: ['Sustainable Farming', 'Digital Marketing', 'Financial Literacy', 'Agri-Tech', 'Agriculture', 'Technology', 'Business', 'Science'],
            required: true,
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        },
        thumbnail: {
            type: String,
            default: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop'
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
        studentCount: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 0
        },
        price: {
            type: String,
            default: 'FREE'
        },
        duration: {
            type: String,
            default: '0h 00m'
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
