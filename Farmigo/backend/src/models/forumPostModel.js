const mongoose = require('mongoose');

const forumPostSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Farming Tips', 'Market Trends', 'Sustainability', 'General'],
            default: 'General',
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                text: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ForumPost', forumPostSchema);
