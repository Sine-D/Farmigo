const Ticket = require('../models/ticketModel');
const TicketMessage = require('../models/ticketMessageModel');
const User = require('../models/userModel');
const axios = require('axios');
const { createNotification } = require('./notificationController');

// Helper: notify all Admin/Support users
const notifyStaff = async (title, message, type = 'Ticket') => {
    const staff = await User.find({ role: { $in: ['Admin', 'Support'] } }).select('_id');
    await Promise.all(staff.map((u) => createNotification(u._id, title, message, type)));
};

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
    const { subject, description, priority } = req.body;

    if (!subject || !description) {
        res.status(400);
        throw new Error('Please add a subject and description');
    }

    const ticket = await Ticket.create({
        subject,
        description,
        priority,
        user: req.user._id,
    });

    // Notify Admin/Support that a new ticket exists
    await notifyStaff('New Support Ticket', `New ticket: ${ticket.subject}`, 'Ticket');

    res.status(201).json(ticket);
};

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
    const tickets = await Ticket.find({ user: req.user._id });
    res.json(tickets);
};

// @desc    Get all tickets (Admin/Support only)
// @route   GET /api/tickets/admin
// @access  Private/Admin/Support
const getAllTickets = async (req, res) => {
    const tickets = await Ticket.find({}).populate('user', 'name email');
    res.json(tickets);
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id
// @access  Private/Admin/Support
const updateTicketStatus = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
        ticket.status = req.body.status || ticket.status;
        const updatedTicket = await ticket.save();

        // Notify ticket owner
        await createNotification(
            ticket.user,
            'Ticket Status Updated',
            `Your ticket "${ticket.subject}" is now: ${updatedTicket.status}`,
            'Ticket'
        );

        res.json(updatedTicket);
    } else {
        res.status(404);
        throw new Error('Ticket not found');
    }
};

// @desc    Add a message to a ticket (Owner + Admin/Support)
// @route   POST /api/tickets/:id/messages
// @access  Private
const addTicketMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        res.status(400);
        throw new Error('Please add a message');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isStaff = ['Admin', 'Support'].includes(req.user.role);
    if (!isOwner && !isStaff) {
        res.status(403);
        throw new Error('Not authorized to message on this ticket');
    }

    const created = await TicketMessage.create({
        ticket: ticket._id,
        sender: req.user._id,
        senderRole: req.user.role,
        message,
    });

    // Notify the other side
    if (isStaff) {
        await createNotification(
            ticket.user,
            'Support Replied',
            `Support replied to your ticket: ${ticket.subject}`,
            'Ticket'
        );
    } else {
        await notifyStaff('New Ticket Message', `New reply on ticket: ${ticket.subject}`, 'Ticket');
    }

    res.status(201).json(created);
};

// @desc    Get ticket messages (Owner + Admin/Support)
// @route   GET /api/tickets/:id/messages
// @access  Private
const getTicketMessages = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isStaff = ['Admin', 'Support'].includes(req.user.role);
    if (!isOwner && !isStaff) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const messages = await TicketMessage.find({ ticket: ticket._id })
        .sort({ createdAt: 1 })
        .populate('sender', 'name email role');

    res.json(messages);
};

// @desc    Get weather data for farmer (Third-party API)
// @route   GET /api/tickets/weather/:city
// @access  Private
const getWeatherData = async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_weather_api_key_here') {
        // Mock data if API key is not provided
        return res.json({
            city,
            temperature: '25°C',
            condition: 'Sunny',
            forecast: 'Clear skies for the next 3 days. Good for harvesting.',
            note: 'API Key not configured. Showing mock data.'
        });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        res.json({
            city: response.data.name,
            temperature: `${response.data.main.temp}°C`,
            condition: response.data.weather[0].main,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed
        });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch weather data');
    }
};

module.exports = {
    createTicket,
    getTickets,
    getAllTickets,
    updateTicketStatus,
    addTicketMessage,
    getTicketMessages,
    getWeatherData
};
