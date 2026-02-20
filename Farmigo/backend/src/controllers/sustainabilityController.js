const Surplus = require('../models/surplusModel');
const Donation = require('../models/donationModel');
const User = require('../models/userModel');

// @desc    Add surplus produce
// @route   POST /api/sustainability/surplus
// @access  Private/Farmer
const addSurplus = async (req, res) => {
    const { product, quantity, discountPrice, expiryDate, isForDonation } = req.body;

    const surplus = await Surplus.create({
        farmer: req.user._id,
        product,
        quantity,
        discountPrice,
        expiryDate,
        isForDonation,
    });

    res.status(201).json(surplus);
};

// @desc    Get all surplus items
// @route   GET /api/sustainability/surplus
// @access  Public
const getSurplusItems = async (req, res) => {
    const surplusItems = await Surplus.find({ status: 'Available' }).populate('product').populate('farmer', 'name location');
    res.json(surplusItems);
};

// @desc    Create a donation
// @route   POST /api/sustainability/donate
// @access  Private
const createDonation = async (req, res) => {
    const { ngoId, items } = req.body;

    const donation = await Donation.create({
        donor: req.user._id,
        ngo: ngoId,
        items,
    });

    res.status(201).json(donation);
};

// @desc    Get sustainability metrics
// @route   GET /api/sustainability/metrics
// @access  Public
const getSustainabilityMetrics = async (req, res) => {
    const totalDonated = await Donation.countDocuments({ status: 'Distributed' });
    const wasteReduced = await Surplus.countDocuments({ status: { $in: ['Sold', 'Donated'] } });

    // Mock calculations for impact
    const familiesSupported = totalDonated * 10;
    const kgSaved = wasteReduced * 50;

    res.json({
        familiesSupported,
        kgSaved,
        totalDonated,
        wasteReduced
    });
};

module.exports = {
    addSurplus,
    getSurplusItems,
    createDonation,
    getSustainabilityMetrics
};
