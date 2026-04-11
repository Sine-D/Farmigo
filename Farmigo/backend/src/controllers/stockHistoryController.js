const StockHistory = require("../models/StockHistory");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// ─── 1. GET HISTORY FOR AN INVENTORY ITEM ────────────────────────────────────
/**
 * @desc    Get stock history for a specific inventory item
 * @route   GET /api/inventory/:id/history
 * @access  Private (farmer – own item, admin – all)
 */
exports.getInventoryHistory = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        changeType,
        startDate,
        endDate,
    } = req.query;

    const filter = { inventoryId: req.params.id };

    if (changeType) filter.changeType = changeType;

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = end;
        }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [history, total] = await Promise.all([
        StockHistory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        StockHistory.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                history,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Stock history retrieved successfully"
        )
    );
});

// ─── 2. GET FARMER'S COMPLETE STOCK HISTORY ───────────────────────────────────
/**
 * @desc    Get all stock history across all items for a farmer
 * @route   GET /api/inventory/history/my
 * @access  Private (farmer – own, admin uses query param farmerId)
 */
exports.getMyStockHistory = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        changeType,
        startDate,
        endDate,
    } = req.query;

    const filter = {};

    // Farmers see only their own history; admins can filter by farmerId
    if (req.user.role === "farmer") {
        filter.farmerId = req.user._id;
    } else if (req.query.farmerId) {
        filter.farmerId = req.query.farmerId;
    }

    if (changeType) filter.changeType = changeType;

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = end;
        }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [history, total] = await Promise.all([
        StockHistory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        StockHistory.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                history,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Stock history retrieved successfully"
        )
    );
});

// ─── 3. STOCK MOVEMENT SUMMARY (Aggregated) ───────────────────────────────────
/**
 * @desc    Aggregate stock movements grouped by change type for a date range
 * @route   GET /api/inventory/history/summary
 * @access  Private (farmer – own, admin – all)
 */
exports.getStockMovementSummary = asyncHandler(async (req, res) => {
    const { startDate, endDate, inventoryId } = req.query;

    const matchStage = {};

    if (req.user.role === "farmer") {
        matchStage.farmerId = req.user._id;
    }

    if (inventoryId) matchStage.inventoryId = inventoryId;

    if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchStage.createdAt.$lte = end;
        }
    }

    const summary = await StockHistory.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$changeType",
                count: { $sum: 1 },
                totalQuantityMoved: { $sum: { $abs: "$changeAmount" } },
                totalAdded: {
                    $sum: { $cond: [{ $gt: ["$changeAmount", 0] }, "$changeAmount", 0] },
                },
                totalRemoved: {
                    $sum: { $cond: [{ $lt: ["$changeAmount", 0] }, { $abs: "$changeAmount" }, 0] },
                },
            },
        },
        { $sort: { count: -1 } },
    ]);

    res.status(200).json(
        new ApiResponse(200, { summary }, "Stock movement summary retrieved successfully")
    );
});
