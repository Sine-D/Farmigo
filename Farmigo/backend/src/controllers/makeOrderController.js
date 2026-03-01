const Order = require('../models/makeOrderModel');
const Product = require('../models/productModel');

// @desc Create new order (Buyer)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) { //prevents empty orders
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    // Build order items from product info
    let orderItems = [];
    let totalAmount = 0;
    let farmerId = null;
    let harvestDate = null;
    let expectedDeliveryDate = null;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      if (!farmerId) farmerId = product.farmer;
      if (!harvestDate) harvestDate = product.harvestDate;
      if (!expectedDeliveryDate) expectedDeliveryDate = product.harvestDate; // can add logic for delivery

      const price = product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        name: product.name,
        productId: product._id,
        image: product.image,
        quantity: item.quantity,
        price,
      });
    }

    const newOrder = await Order.create({
      buyerId: req.user._id,
      farmerId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice: 0,
      shippingPrice: 0,
      totalAmount,
      harvestDate,
      expectedDeliveryDate,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get buyer orders
exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get farmer orders
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id })
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update delivery status (Farmer)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, isDelivered } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.farmerId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (typeof isDelivered === 'boolean') {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
      }
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentResult, isPaid } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentResult) order.paymentResult = paymentResult;

    if (typeof isPaid === 'boolean') {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = Date.now();
        order.paymentStatus = 'paid';
      }
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.buyerId.toString() !== req.user._id.toString() &&
        order.farmerId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    order.deliveryStatus = 'cancelled';
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};