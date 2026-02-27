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

// @desc    Update a forum post
// @route   PUT /api/community/forum/:id
// @access  Private
const updatePost = async (req, res) => {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
        // Check if user is post owner or admin
        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('You are not authorized to update this post');
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.category = req.body.category || post.category;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

// @desc    Delete a forum post
// @route   DELETE /api/community/forum/:id
// @access  Private
const deletePost = async (req, res) => {
    const post = await ForumPost.findById(req.params.id);

    if (post) {
        // Check if user is post owner or admin
        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403);
            throw new Error('You are not authorized to delete this post');
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
};

module.exports = {
    createPost,
    getPosts,
    addComment,
    likePost,
    updatePost,
    deletePost
};
