const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTickets,
    getAllTickets,
    updateTicketStatus,
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

router.route('/weather/:city')
    .get(protect, getWeatherData);

module.exports = router;
