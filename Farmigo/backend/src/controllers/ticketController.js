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
        return res.json({
            city,
            temperature: '25°C',
            condition: 'Clear',
            humidity: 60,
            agriculturalAdvice: 'API Key not configured. Showing mock advice: Ideal weather for general farm maintenance.',
            note: 'Please add your OpenWeather API Key to the .env file.'
        });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const { main, weather, name } = response.data;
        const temp = main.temp;
        const humidity = main.humidity;
        const condition = weather[0].main;

        let advice = '';

        // Agricultural advice logic
        if (condition === 'Rain' || condition === 'Drizzle') {
            advice = 'Rain expected. Avoid harvesting tomatoes or other delicate fruits today to prevent rot. Ensure drainage is clear.';
        } else if (temp > 30) {
            advice = 'High temperatures detected. Increase irrigation frequency for young crops and provide shade if possible.';
        } else if (humidity > 80) {
            advice = 'High humidity levels. Monitor for fungal infections or pests. Good time for organic soil enrichment.';
        } else if (condition === 'Clear' || condition === 'Clouds') {
            advice = 'Optimal conditions for harvesting and outdoor maintenance. A great day to apply fertilizers.';
        } else {
            advice = 'Maintain standard care. Keep an eye on local alerts.';
        }

        res.json({
            city: name,
            temperature: `${temp}°C`,
            condition: condition,
            humidity: `${humidity}%`,
            agriculturalAdvice: advice
        });
    } catch (error) {
        res.status(error.response?.status || 500);
        throw new Error(error.response?.data?.message || 'Failed to fetch weather data from OpenWeather');
    }
};

module.exports = {
    createTicket,
    getTickets,
    getAllTickets,
    updateTicketStatus,
    getWeatherData
};
