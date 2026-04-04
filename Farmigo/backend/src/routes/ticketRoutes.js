const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTickets,
    getAllTickets,
    updateTicketStatus,
    deleteTicket,
    addTicketMessage,
    getTicketMessages,
    getWeatherData
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

const asyncHandler = require('../middleware/asyncHandler');

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get user tickets
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a support ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 */
router.route('/')
    .post(protect, asyncHandler(createTicket))
    .get(protect, asyncHandler(getTickets));

/**
 * @swagger
 * /api/tickets/admin:
 *   get:
 *     summary: Get all tickets (Admin/Support only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/admin', protect, authorize('Admin', 'Support'), asyncHandler(getAllTickets));

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update ticket status
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id')
    .put(protect, authorize('Admin', 'Support'), asyncHandler(updateTicketStatus))
    .delete(protect, asyncHandler(deleteTicket));

// Ticket chat/messages (Owner + Admin/Support)
router.route('/:id/messages')
    .post(protect, asyncHandler(addTicketMessage))
    .get(protect, asyncHandler(getTicketMessages));

/**
 * @swagger
 * /api/tickets/weather/{city}:
 *   get:
 *     summary: Get weather and agricultural advice
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 */
router.get('/weather/:city', protect, asyncHandler(getWeatherData));


module.exports = router;
