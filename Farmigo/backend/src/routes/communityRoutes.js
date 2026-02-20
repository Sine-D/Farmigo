const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    addComment,
    likePost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/forum')
    .post(protect, createPost)
    .get(getPosts);

router.route('/forum/:id/comment')
    .post(protect, addComment);

router.route('/forum/:id/like')
    .put(protect, likePost);

module.exports = router;
