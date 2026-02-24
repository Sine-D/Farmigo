const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password, role, phoneNumber, location, farmDetails } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phoneNumber,
    location,
    farmDetails: role === 'Farmer' ? farmDetails : undefined,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    token: generateToken(user._id),
  });
};

// LOGIN USER

const authUser = async (req, res) => {
  const { email, password } = req.body;

  // IMPORTANT: must select password manually
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated');
  }

  // If farmer but not approved
  if (user.role === 'Farmer' && !user.isApproved) {
    res.status(403);
    throw new Error('Farmer account pending admin approval');
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


// GET USER PROFILE

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
};

// UPDATE USER PROFILE

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
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
    token: generateToken(updatedUser._id),
  });
};

// GET ALL USERS (ADMIN)

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};


// APPROVE FARMER (ADMIN)
const approveFarmer = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'Farmer') {
    res.status(400);
    throw new Error('User is not a Farmer');
  }

  user.isApproved = true;
  await user.save();

  res.json({ message: 'Farmer approved successfully' });
};

// UPDATE USER STATUS (ADMIN)
const updateUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.json({ message: 'User status updated successfully' });
};

// UPDATE USER ROLE (ADMIN)

const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: 'User role updated successfully' });
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
};