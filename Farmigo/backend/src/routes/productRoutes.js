const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    approveProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *   post:
 *     summary: Create a product (Farmer only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               countInStock:
 *                 type: number
 */
router.route('/')
    .get(asyncHandler(getProducts))
    .post(protect, authorize('Farmer'), asyncHandler(createProduct));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   put:
 *     summary: Update product (Farmer/Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   delete:
 *     summary: Delete product (Farmer/Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id')
    .get(asyncHandler(getProductById))
    .put(protect, authorize('Farmer', 'Admin'), asyncHandler(updateProduct))
    .delete(protect, authorize('Farmer', 'Admin'), asyncHandler(deleteProduct));

router.get('/preorders', async (req, res) => {
    const products = await Product.find({ isPreOrder: true, isApproved: true });
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}/approve:
 *   put:
 *     summary: Approve product (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id/approve')
    .put(protect, authorize('Admin'), asyncHandler(approveProduct));

module.exports = router;
