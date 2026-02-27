const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    addComment,
    likePost,
    updatePost,
    deletePost
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/community/forum:
 *   post:
 *     summary: Create a forum post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *   get:
 *     summary: Get all forum posts
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 */
router.route('/forum')
    .post(protect, asyncHandler(createPost))
    .get(asyncHandler(getPosts));

/**
 * @swagger
 * /api/community/forum/{id}:
 *   put:
 *     summary: Update a forum post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   delete:
 *     summary: Delete a forum post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/forum/:id')
    .put(protect, asyncHandler(updatePost))
    .delete(protect, asyncHandler(deletePost));

router.route('/forum/:id/comment')
    .post(protect, asyncHandler(addComment));

router.route('/forum/:id/like')
    .put(protect, asyncHandler(likePost));

module.exports = router;
