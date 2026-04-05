const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  approveFarmer,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

// PUBLIC
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(authUser));

// USER
router
  .route('/profile')
  .get(protect, asyncHandler(getUserProfile))
  .put(protect, asyncHandler(updateUserProfile));

// ADMIN
router
  .route('/')
  .get(protect, authorize('Admin'), asyncHandler(getUsers));

router
  .route('/:id/approve')
  .put(protect, authorize('Admin'), asyncHandler(approveFarmer));

router
  .route('/:id/status')
  .put(protect, authorize('Admin'), asyncHandler(updateUserStatus));

router
  .route('/:id/role')
  .put(protect, authorize('Admin'), asyncHandler(updateUserRole));

router
  .route('/:id')
  .delete(protect, authorize('Admin'), asyncHandler(deleteUser));

module.exports = router;