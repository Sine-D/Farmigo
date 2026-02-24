require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect Routes (Login Required)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      req.user = user;

      next();

    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }

  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-Based Authorization

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this route`,
      });
    }

    next();
  };
};


module.exports = { protect, authorize };