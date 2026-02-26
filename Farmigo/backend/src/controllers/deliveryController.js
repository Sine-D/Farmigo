// controllers/deliveryController.js
const Order = require('../models/makeOrderModel');
const User = require('../models/userModel');

// Update order dispatch info (Admin/Farmer)
exports.updateDispatch = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { dispatchStatus, address, route } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only admin or the farmer of this order can update dispatch
    if (
      req.user.role !== 'Admin' &&
      order.farmerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (dispatchStatus) order.deliveryStatus = dispatchStatus;
    if (address) order.deliveryAddress = address;
    if (route) order.deliveryRoute = route;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Dispatch info updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for delivery tracking (Farmer/Admin)
exports.getOrdersForDelivery = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Farmer') {
      filter.farmerId = req.user._id;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm delivery by Farmer
exports.confirmDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only assigned farmer can confirm
    if (order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.isDelivered = true;
    order.deliveryStatus = 'Delivered';
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Delivery confirmed',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};