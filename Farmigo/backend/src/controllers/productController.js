const Product = require('../models/productModel');
const { createNotification } = require('./notificationController');

// @desc    Get all products (Admin can see all, buyers see only approved)
// @route   GET /api/products
// @access  Public/Admin
const getProducts = async (req, res) => {
    const isAdmin = req.user && req.user.role === 'Admin';
    const query = isAdmin ? {} : { isApproved: true };

    const products = await Product.find(query).populate('farmer', 'name email');
    res.json(products);
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        category,
        countInStock,
        harvestDate,
        isPreOrder,
        estimatedHarvestDuration
    } = req.body;

    const product = new Product({
        name,
        price,
        farmer: req.user._id,
        image,
        category,
        countInStock,
        description,
        isApproved: false,
        harvestDate,
        isPreOrder,
        estimatedHarvestDuration,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Farmer/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        category,
        countInStock,
        harvestDate,
        isPreOrder,
        estimatedHarvestDuration,
        availabilityStatus
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (
            product.farmer.toString() !== req.user._id.toString() &&
            req.user.role !== 'Admin'
        ) {
            res.status(401);
            throw new Error('Not authorized to update this product');
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.countInStock = countInStock ?? product.countInStock;

        // 🌱 Harvest updates
        product.harvestDate = harvestDate || product.harvestDate;
        product.isPreOrder = isPreOrder ?? product.isPreOrder;
        product.estimatedHarvestDuration =
            estimatedHarvestDuration ?? product.estimatedHarvestDuration;
        product.availabilityStatus =
            availabilityStatus || product.availabilityStatus;

        if (req.user.role === 'Farmer') {
            product.isApproved = false;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

const getProduct = async (req, res) => {
    const isAdmin = req.user && req.user.role === 'Admin';
    const query = isAdmin ? {} : { isApproved: true };

    const products = await Product.find(query).populate('farmer', 'name email');

    // 🌾 Auto-update availability status
    const today = new Date();

    for (let product of products) {
        if (product.harvestDate) {
            if (today >= product.harvestDate) {
                product.availabilityStatus = 'Ready for Harvest';
            }
        }
    }

    res.json(products);
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Farmer/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(401);
            throw new Error('Not authorized to delete this product');
        }

        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Approve/Reject product (Admin)
// @route   PUT /api/products/:id/approve
// @access  Private/Admin
const approveProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.isApproved = req.body.isApproved;
        const updatedProduct = await product.save();

        // Notify farmer
        await createNotification(
            product.farmer,
            'Product Status Update',
            `Your product "${product.name}" has been ${product.isApproved ? 'approved' : 'rejected'}.`,
            'System'
        );

        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    approveProduct,
};
