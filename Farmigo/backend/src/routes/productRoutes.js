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

router.route('/')
    .get(getProducts)
    .post(protect, authorize('Farmer'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('Farmer', 'Admin'), updateProduct)
    .delete(protect, authorize('Farmer', 'Admin'), deleteProduct);

router.route('/:id/approve')
    .put(protect, authorize('Admin'), approveProduct);

module.exports = router;
