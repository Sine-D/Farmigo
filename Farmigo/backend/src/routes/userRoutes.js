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
    deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Farmer, Buyer]
 *               farmDetails:
 *                 type: object
 *                 properties:
 *                   farmName:
 *                     type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user exists
 */
router.post('/', asyncHandler(registerUser));

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', asyncHandler(authUser));

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.route('/profile')
    .get(protect, asyncHandler(getUserProfile))
    .put(protect, asyncHandler(updateUserProfile));

// Admin routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.route('/')
    .get(protect, authorize('Admin'), asyncHandler(getUsers));

router.route('/:id/approve')
    .put(protect, authorize('Admin'), asyncHandler(approveFarmer));

router.route('/:id/status')
    .put(protect, authorize('Admin'), asyncHandler(updateUserStatus));

router.route('/:id/role')
    .put(protect, authorize('Admin'), asyncHandler(updateUserRole));

router.route('/:id')
    .delete(protect, authorize('Admin'), asyncHandler(deleteUser));

module.exports = router;