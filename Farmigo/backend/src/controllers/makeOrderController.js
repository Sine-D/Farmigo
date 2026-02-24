// src/controllers/makeOrderController.js
const Order = require('../models/makeOrderModel');

// @desc Create new order (Buyer)
exports.createOrder = async (req, res) => {
  try {
    const {
      farmerId,
      items,
      shippingAddress,
      paymentMethod,
      taxPrice = 0,
      shippingPrice = 0,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const newOrder = await Order.create({
      buyerId: req.user.id,
      farmerId,
      items,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalAmount,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Get all orders for a Buyer
exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id }).populate(
      'items.productId',
      'name price image'
    );
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all orders for a Farmer
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user.id }).populate(
      'items.productId',
      'name price image'
    );
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Delivery Status (Farmer only)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, isDelivered } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.farmerId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (typeof isDelivered === 'boolean') order.isDelivered = isDelivered;
    if (isDelivered) order.deliveredAt = Date.now();

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentResult, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentResult) order.paymentResult = paymentResult;
    if (typeof isPaid === 'boolean') {
      order.isPaid = isPaid;
      if (isPaid) order.paidAt = Date.now();
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.buyerId.toString() !== req.user.id && order.farmerId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    order.deliveryStatus = 'cancelled';
    order.status = 'Cancelled';

    await order.save();
    res.status(200).json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};