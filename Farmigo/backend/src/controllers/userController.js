const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// REGISTER
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    whatsappOptIn,
    location,
    farmDetails,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please use a valid Gmail address');
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error(
      'Password must contain upper & lowercase letters and be 8+ characters'
    );
  }

  // Farmer validation
  if (role === 'Farmer' && (!farmDetails || !farmDetails.farmName)) {
    res.status(400);
    throw new Error('Farmers must provide farm details');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Buyer',
    phoneNumber,
    whatsappOptIn,
    location,
    farmDetails: role === 'Farmer' ? farmDetails : undefined,
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    token: generateToken(user._id),
  });
};

// LOGIN
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated');
  }

  if (user.role === 'Farmer' && !user.isApproved) {
    res.status(403);
    throw new Error('Farmer account pending approval');
  }

  if (await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// PROFILE
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      whatsappOptIn: user.whatsappOptIn,
      location: user.location,
      farmDetails: user.farmDetails,
      isApproved: user.isApproved,
      isActive: user.isActive,
      badges: user.badges,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.phoneNumber !== undefined) {
    user.phoneNumber = req.body.phoneNumber;
  }

  if (req.body.whatsappOptIn !== undefined) {
    user.whatsappOptIn = req.body.whatsappOptIn;
  }

  user.location = req.body.location || user.location;

  if (req.body.farmDetails && user.role === 'Farmer') {
    user.farmDetails = req.body.farmDetails;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phoneNumber: updatedUser.phoneNumber,
    whatsappOptIn: updatedUser.whatsappOptIn,
    location: updatedUser.location,
    farmDetails: updatedUser.farmDetails,
    isApproved: updatedUser.isApproved,
    token: generateToken(updatedUser._id),
  });
};

// ADMIN
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const approveFarmer = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isApproved = true;
  await user.save();

  res.json({ message: 'Farmer approved' });
};

const updateUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.json({ message: 'User status updated' });
};

const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: 'User role updated' });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'Admin') {
    res.status(400);
    throw new Error('Cannot delete Admin user');
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User removed' });
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  approveFarmer,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};