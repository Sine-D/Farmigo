const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const { sendWhatsApp } = require('../utils/whatsappService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
};

// @desc    Create a notification (Internal usage)
const createNotification = async (userId, title, message, type) => {
  try {
    // 1) Save in-app notification
    await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    // 2) Send WhatsApp alert (optional, if user opted in)
    const user = await User.findById(userId).select('phoneNumber whatsappOptIn');
    if (user?.whatsappOptIn && user?.phoneNumber) {
      await sendWhatsApp(user.phoneNumber, `AgriLink Alert: ${title}\n${message}`);
    }
  } catch (error) {
    console.error('Error creating notification / WhatsApp alert:', error.message);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
};