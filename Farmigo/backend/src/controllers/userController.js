const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password, role, phoneNumber, whatsappOptIn, location, farmDetails } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Email validation: must contain @ and end with gmail.com
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please use a valid Gmail address (example@gmail.com)');
  }

  // Password validation: 8+ characters and mixed case (upper and lower)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long and contain both uppercase and lowercase letters');
  }

  // Role-specific validation
  if (role === 'Farmer' && (!farmDetails || !farmDetails.farmName)) {
    res.status(400);
    throw new Error('Farmers must provide farm details');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Buyer', // Default to Buyer if no role provided
    phoneNumber,
    whatsappOptIn,
    location,
    farmDetails: role === 'Farmer' ? farmDetails : undefined
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
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

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create a default Buyer account if doesn't exist
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-10), // Random password
        role: 'Buyer',
      });
    }

    if (!user.isActive) {
      res.status(401);
      throw new Error('Account is deactivated');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401);
    throw new Error('Google authentication failed');
  }
};


// GET USER PROFILE

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
      farmDetails: user.farmDetails
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// UPDATE USER PROFILE

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (user) {
    user.name = req.body.name || user.name;
    // Email change is disabled as per user request
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
    if (req.body.whatsappOptIn !== undefined) user.whatsappOptIn = req.body.whatsappOptIn;
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
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'Admin') {
      res.status(400);
      throw new Error('Cannot delete Admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  registerUser,
  authUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  getUsers,
  approveFarmer,
  updateUserStatus,
  updateUserRole,
  deleteUser
};
