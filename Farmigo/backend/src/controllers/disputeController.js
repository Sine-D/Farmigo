const Dispute = require('../models/disputeModel');
const DisputeMessage = require('../models/disputeMessageModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { createNotification } = require('./notificationController');

// Helper: get all Admin/Support user IDs (for internal notifications)
const getSupportAndAdminIds = async () => {
    const staff = await User.find({ role: { $in: ['Admin', 'Support'] } }).select('_id');
    return staff.map((u) => u._id);
};

// Helper: unique ObjectId string list
const uniqIds = (ids) => {
    const set = new Set(ids.map((x) => x.toString()));
    return Array.from(set);
};

// @desc    Create a dispute (Buyer/Farmer)
// @route   POST /api/disputes
// @access  Private
const createDispute = async (req, res, next) => {
    try {
        const { orderId, reason, description } = req.body;

        if (!orderId || !description) {
            res.status(400);
            throw new Error('Please provide orderId and description');
        }

        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Collect all farmer(s) from products in orderItems
        const productIds = order.orderItems.map((i) => i.product);
        const products = await Product.find({ _id: { $in: productIds } }).select('farmer');
        const farmerIds = uniqIds(products.map((p) => p.farmer).filter(Boolean));

        const buyerId = order.buyer?.toString();
        const openerId = req.user._id.toString();
        const isBuyer = buyerId === openerId;
        const isFarmer = farmerIds.includes(openerId);

        if (!isBuyer && !isFarmer && !['Admin', 'Support'].includes(req.user.role)) {
            res.status(403);
            throw new Error('Not authorized to open a dispute for this order');
        }

        const involvedUsers = uniqIds([buyerId, ...farmerIds]).filter(Boolean);

        const dispute = await Dispute.create({
            order: order._id,
            openedBy: req.user._id,
            involvedUsers,
            reason: reason || 'Other',
            description,
            status: 'Open',
        });

        // Notify other involved users
        const targets = involvedUsers.filter((id) => id !== openerId);
        await Promise.all(
            targets.map((uid) =>
                createNotification(
                    uid,
                    'New Dispute Opened',
                    `A dispute was opened for Order ${order._id}. Reason: ${dispute.reason}`,
                    'Dispute'
                )
            )
        );

        // Notify Admin/Support
        const staffIds = await getSupportAndAdminIds();
        await Promise.all(
            staffIds.map((uid) =>
                createNotification(
                    uid,
                    'Dispute Needs Review',
                    `New dispute opened for Order ${order._id}.`,
                    'Dispute'
                )
            )
        );

        res.status(201).json(dispute);
    } catch (err) {
        next(err);
    }
};

// @desc    Get disputes where current user is involved
// @route   GET /api/disputes/my
// @access  Private
const getMyDisputes = async (req, res, next) => {
    try {
        const disputes = await Dispute.find({ involvedUsers: req.user._id })
            .sort({ createdAt: -1 })
            .populate('openedBy', 'name email role')
            .populate('order', 'status totalPrice createdAt');

        res.json(disputes);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all disputes (Admin/Support)
// @route   GET /api/disputes/admin
// @access  Private/Admin/Support
const getAllDisputes = async (req, res, next) => {
    try {
        const disputes = await Dispute.find({})
            .sort({ createdAt: -1 })
            .populate('openedBy', 'name email role')
            .populate('resolvedBy', 'name email role')
            .populate('order', 'status totalPrice createdAt');

        res.json(disputes);
    } catch (err) {
        next(err);
    }
};

// @desc    Update dispute status (Admin/Support)
// @route   PUT /api/disputes/:id/status
// @access  Private/Admin/Support
const updateDisputeStatus = async (req, res, next) => {
    try {
        const { status, resolutionNote } = req.body;
        const dispute = await Dispute.findById(req.params.id);

        if (!dispute) {
            res.status(404);
            throw new Error('Dispute not found');
        }

        if (status) dispute.status = status;
        if (typeof resolutionNote === 'string') dispute.resolutionNote = resolutionNote;

        if (['Resolved', 'Rejected'].includes(dispute.status)) {
            dispute.resolvedBy = req.user._id;
            dispute.resolvedAt = new Date();
        }

        const updated = await dispute.save();

        // Notify all involved users
        await Promise.all(
            (updated.involvedUsers || []).map((uid) =>
                createNotification(
                    uid,
                    'Dispute Status Updated',
                    `Dispute status is now: ${updated.status}.`,
                    'Dispute'
                )
            )
        );

        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// @desc    Add message to dispute (involved users + Admin/Support)
// @route   POST /api/disputes/:id/messages
// @access  Private
const addDisputeMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400);
            throw new Error('Please add a message');
        }

        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            res.status(404);
            throw new Error('Dispute not found');
        }

        const isInvolved = (dispute.involvedUsers || []).some(
            (u) => u.toString() === req.user._id.toString()
        );
        const isStaff = ['Admin', 'Support'].includes(req.user.role);

        if (!isInvolved && !isStaff) {
            res.status(403);
            throw new Error('Not authorized to message in this dispute');
        }

        const created = await DisputeMessage.create({
            dispute: dispute._id,
            sender: req.user._id,
            senderRole: req.user.role,
            message,
        });

        // Notify everyone except sender
        const targets = (dispute.involvedUsers || [])
            .map((x) => x.toString())
            .filter((id) => id !== req.user._id.toString());

        await Promise.all(
            targets.map((uid) =>
                createNotification(uid, 'New Dispute Message', 'You received a new dispute message.', 'Dispute')
            )
        );

        // Also notify staff if sender is not staff
        if (!isStaff) {
            const staffIds = await getSupportAndAdminIds();
            await Promise.all(
                staffIds.map((uid) =>
                    createNotification(uid, 'New Dispute Message', 'A new message was added to a dispute.', 'Dispute')
                )
            );
        }

        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// @desc    Get dispute messages (involved users + Admin/Support)
// @route   GET /api/disputes/:id/messages
// @access  Private
const getDisputeMessages = async (req, res, next) => {
    try {
        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            res.status(404);
            throw new Error('Dispute not found');
        }

        const isInvolved = (dispute.involvedUsers || []).some(
            (u) => u.toString() === req.user._id.toString()
        );
        const isStaff = ['Admin', 'Support'].includes(req.user.role);
        if (!isInvolved && !isStaff) {
            res.status(403);
            throw new Error('Not authorized');
        }

        const messages = await DisputeMessage.find({ dispute: dispute._id })
            .sort({ createdAt: 1 })
            .populate('sender', 'name email role');

        res.json(messages);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createDispute,
    getMyDisputes,
    getAllDisputes,
    updateDisputeStatus,
    addDisputeMessage,
    getDisputeMessages,
};
