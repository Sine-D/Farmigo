const Order = require('../models/makeOrderModel');
const Transaction = require('../models/transactionModel');

// Request a refund (Buyer)
exports.requestRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order not paid, cannot refund' });
    }

    // Create Refund Transaction
    const refundTransaction = await Transaction.create({
      user: req.user._id,
      order: order._id,
      amount: order.totalAmount,
      type: 'Refund',
      status: 'Pending',
      paymentProvider: 'SimulatedGateway',
      reference: 'REFUND-' + Date.now(),
    });

    order.status = 'Refund Requested';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund requested successfully',
      refundTransaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve refund (Admin)
exports.approveRefund = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId).populate('order');

    if (!transaction || transaction.type !== 'Refund') {
      return res.status(404).json({ message: 'Refund transaction not found' });
    }

    transaction.status = 'Completed';
    await transaction.save();

    // Update Order
    const order = transaction.order;
    order.status = 'Refunded';
    order.isPaid = false;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund approved successfully',
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};