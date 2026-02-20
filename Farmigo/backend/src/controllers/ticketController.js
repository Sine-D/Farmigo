const Ticket = require('../models/ticketModel');
const axios = require('axios');

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
        res.json(updatedTicket);
    } else {
        res.status(404);
        throw new Error('Ticket not found');
    }
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
    getWeatherData
};
