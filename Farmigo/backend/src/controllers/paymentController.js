// controllers/paymentController.js

const Order = require('../models/makeOrderModel');
const Transaction = require('../models/transactionModel');

// Create Payment (Buyer)
exports.createPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create Pending Transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      order: order._id,
      amount: order.totalAmount,
      type: 'Payment',
      status: 'Pending',
      paymentProvider: 'SimulatedGateway', // Change when using real gateway
      reference: 'REF-' + Date.now(),
    });

    res.status(200).json({
      success: true,
      message: 'Payment session created',
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Verify Payment (Buyer confirms success)

exports.verifyPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const transaction = await Transaction.findOne({
      order: order._id,
      user: req.user._id,
      type: 'Payment',
      status: 'Pending',
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update Transaction
    transaction.status = 'Completed';
    transaction.reference = 'TXN-' + Date.now();
    await transaction.save();

    // Update Order
    order.isPaid = true;
    order.paymentStatus = 'Completed';
    order.paidAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    })
      .populate('order')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.webhookHandler = async (req, res) => {
  console.log('Webhook received:', req.body);

  // Later: verify signature + update transaction

  res.status(200).send('Webhook processed');
};