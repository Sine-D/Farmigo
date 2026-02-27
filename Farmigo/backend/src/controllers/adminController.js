const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
        totalUsers,
        totalProducts,
    });
};

// @desc    Get farmer activity report
// @route   GET /api/admin/reports/farmers
// @access  Private/Admin
const getFarmerReport = async (req, res) => {
    const farmers = await User.find({ role: 'Farmer' }).select('name email isApproved createdAt');

    // Enrich with product counts
    const enrichedFarmers = await Promise.all(farmers.map(async (farmer) => {
        const productCount = await Product.countDocuments({ farmer: farmer._id });
        return {
            ...farmer._doc,
            productCount
        };
    }));

    res.json(enrichedFarmers);
};

module.exports = {
    getDashboardStats,
    getFarmerReport
};
