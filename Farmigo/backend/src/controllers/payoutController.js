// controllers/payoutController.js

const Transaction = require('../models/transactionModel');
const Order = require('../models/makeOrderModel');
const User = require('../models/userModel');

// Admin triggers payout for a farmer
exports.createFarmerPayout = async (req, res) => {
  try {
    const { farmerId, amount, paymentProvider } = req.body;

    const farmer = await User.findById(farmerId);

    if (!farmer || farmer.role !== 'Farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payout amount' });
    }

    const payoutTransaction = await Transaction.create({
      user: farmer._id,
      order: null, // optional, could attach if linked to specific order
      amount,
      type: 'Payout',
      status: 'Pending',
      paymentProvider,
      reference: 'PAYOUT-' + Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Payout created successfully',
      payoutTransaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin updates payout status (e.g., Completed / Failed)
exports.updatePayoutStatus = async (req, res) => {
  try {
    const payout = await Transaction.findById(req.params.transactionId);

    if (!payout || payout.type !== 'Payout') {
      return res.status(404).json({ message: 'Payout transaction not found' });
    }

    const { status, reference } = req.body;

    if (!['Pending', 'Completed', 'Failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    payout.status = status;
    if (reference) payout.reference = reference;

    await payout.save();

    res.status(200).json({
      success: true,
      message: 'Payout status updated',
      payout,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Farmer views their payouts
exports.getMyPayouts = async (req, res) => {
  try {
    const payouts = await Transaction.find({
      user: req.user._id,
      type: 'Payout',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payouts,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};