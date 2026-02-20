const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    approveFarmer,
    updateUserStatus,
    updateUserRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes
router.route('/')
    .get(protect, authorize('Admin'), getUsers);

router.route('/:id/approve')
    .put(protect, authorize('Admin'), approveFarmer);

router.route('/:id/status')
    .put(protect, authorize('Admin'), updateUserStatus);

router.route('/:id/role')
    .put(protect, authorize('Admin'), updateUserRole);

module.exports = router;
