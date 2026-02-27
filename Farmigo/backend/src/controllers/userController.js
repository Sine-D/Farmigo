const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
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

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && !user.isActive) {
        res.status(401);
        throw new Error('Account is deactivated. Please contact support.');
    }

    if (user && (await user.matchPassword(password))) {
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
        if (req.body.whatsappOptIn !== undefined) user.whatsappOptIn = req.body.whatsappOptIn;
        user.location = req.body.location || user.location;
        if (req.body.farmDetails) {
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

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Approve farmer registration
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveFarmer = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role !== 'Farmer') {
            res.status(400);
            throw new Error('User is not a Farmer');
        }
        user.isApproved = true;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user status (Ban/Deactivate)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isActive = req.body.isActive;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
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
    getUserProfile,
    updateUserProfile,
    getUsers,
    approveFarmer,
    updateUserStatus,
    updateUserRole,
    deleteUser
};
