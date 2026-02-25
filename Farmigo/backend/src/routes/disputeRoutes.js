const express = require('express');
const router = express.Router();

const {
    createDispute,
    getMyDisputes,
    getAllDisputes,
    updateDisputeStatus,
    addDisputeMessage,
    getDisputeMessages,
} = require('../controllers/disputeController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Buyer/Farmer create dispute
router.route('/').post(protect, createDispute);

// User views their disputes
router.route('/my').get(protect, getMyDisputes);

// Admin/Support views all disputes
router.route('/admin').get(protect, authorize('Admin', 'Support'), getAllDisputes);

// Admin/Support updates status
router
    .route('/:id/status')
    .put(protect, authorize('Admin', 'Support'), updateDisputeStatus);

// Messages (involved users + Admin/Support)
router
    .route('/:id/messages')
    .post(protect, addDisputeMessage)
    .get(protect, getDisputeMessages);

module.exports = router;
