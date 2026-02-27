const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *   post:
 *     summary: Create a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.route('/')
    .get(asyncHandler(getCategories))
    .post(protect, authorize('Admin'), asyncHandler(createCategory));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id')
    .put(protect, authorize('Admin'), asyncHandler(updateCategory))
    .delete(protect, authorize('Admin'), asyncHandler(deleteCategory));

module.exports = router;
