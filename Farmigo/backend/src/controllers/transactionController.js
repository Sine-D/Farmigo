const Transaction = require('../models/transactionModel');
const Order = require('../models/orderModel');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
    const transactions = await Transaction.find({})
        .populate('user', 'name email')
        .populate('order', 'totalPrice status')
        .sort({ createdAt: -1 });
    res.json(transactions);
};

// @desc    Get user transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id })
        .populate('order', 'totalPrice status')
        .sort({ createdAt: -1 });
    res.json(transactions);
};

// @desc    Create a payout (Admin pays farmer)
// @route   POST /api/transactions/payout
// @access  Private/Admin
const createPayout = async (req, res) => {
    const { orderId, farmerId, amount, paymentProvider, reference } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const transaction = await Transaction.create({
        user: farmerId,
        order: orderId,
        amount,
        type: 'Payout',
        status: 'Completed',
        paymentProvider,
        reference
    });

    res.status(201).json(transaction);
};

module.exports = {
    getTransactions,
    getMyTransactions,
    createPayout
};
