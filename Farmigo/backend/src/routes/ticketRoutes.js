const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTickets,
    getAllTickets,
    updateTicketStatus,
    addTicketMessage,
    getTicketMessages,
    getWeatherData
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTicket)
    .get(protect, getTickets);

router.route('/admin')
    .get(protect, authorize('Admin', 'Support'), getAllTickets);

router.route('/:id')
    .put(protect, authorize('Admin', 'Support'), updateTicketStatus);

// Ticket chat/messages (Owner + Admin/Support)
router.route('/:id/messages')
    .post(protect, addTicketMessage)
    .get(protect, getTicketMessages);

router.route('/weather/:city')
    .get(protect, getWeatherData);

module.exports = router;
