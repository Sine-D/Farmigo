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
  updateUserRole,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', authUser);

// USER ROUTES (Logged In)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ADMIN ROUTES

router.get('/', protect, authorize('Admin'), getUsers);

router.put('/:id/approve', protect, authorize('Admin'), approveFarmer);

router.put('/:id/status', protect, authorize('Admin'), updateUserStatus);

router.put('/:id/role', protect, authorize('Admin'), updateUserRole);


module.exports = router;