const ForumPost = require('../models/forumPostModel');

// @desc    Create a forum post
// @route   POST /api/community/forum
// @access  Private
const createPost = async (req, res) => {
    const { title, content, category } = req.body;

    const post = await ForumPost.create({
        user: req.user._id,
        title,
        content,
        category,
    });

    res.status(201).json(post);
};

// @desc    Get all forum posts
// @route   GET /api/community/forum
// @access  Public
const getPosts = async (req, res) => {
    const posts = await ForumPost.find({}).populate('user', 'name role').sort({ createdAt: -1 });
    res.json(posts);
};

// @desc    Add comment to post
// @route   POST /api/community/forum/:id/comment
// @access  Private
const addComment = async (req, res) => {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
        const comment = {
            user: req.user._id,
            text: req.body.text,
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

// @desc    Like a post
// @route   PUT /api/community/forum/:id/like
// @access  Private
const likePost = async (req, res) => {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

module.exports = {
    createPost,
    getPosts,
    addComment,
    likePost
};
