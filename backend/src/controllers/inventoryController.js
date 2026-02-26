const Inventory = require("../models/Inventory");
const StockHistory = require("../models/StockHistory");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const axios = require("axios");

// ─── Helper: Record stock history ─────────────────────────────────────────────
const recordStockHistory = async ({
    inventoryId,
    farmerId,
    productName,
    changeType,
    previousQuantity,
    changeAmount,
    newQuantity,
    unit,
    orderId = null,
    note = "",
    performedBy = null,
}) => {
    await StockHistory.create({
        inventoryId,
        farmerId,
        productName,
        changeType,
        previousQuantity,
        changeAmount,
        newQuantity,
        unit,
        orderId,
        note,
        performedBy,
    });
};

// ─── 1. CREATE Inventory ──────────────────────────────────────────────────────
/**
 * @desc    Create a new inventory item
 * @route   POST /api/inventory
 * @access  Private (farmer, admin)
 */
exports.createInventory = asyncHandler(async (req, res) => {
    // If farmer is logged in, override farmerId with their own ID for safety
    if (req.user && req.user.role === "farmer") {
        req.body.farmerId = req.user._id;
    }

    const inventory = await Inventory.create(req.body);

    // Record stock history for initial creation
    await recordStockHistory({
        inventoryId: inventory._id,
        farmerId: inventory.farmerId,
        productName: inventory.productName,
        changeType: "ADDED",
        previousQuantity: 0,
        changeAmount: inventory.quantity,
        newQuantity: inventory.quantity,
        unit: inventory.unit,
        note: "Initial inventory creation",
        performedBy: req.user ? req.user._id : null,
    });

    res
        .status(201)
        .json(new ApiResponse(201, inventory, "Inventory item created successfully"));
});

// ─── 2. GET ALL Inventory ─────────────────────────────────────────────────────
/**
 * @desc    Get all inventory items with pagination, filtering, and search
 * @route   GET /api/inventory
 * @access  Public (or Private – depends on deployment choice)
 *
 * Query params:
 *   page, limit, category, isOrganic, minPrice, maxPrice,
 *   search, farmerId, isActive, sortBy, order
 */
exports.getAllInventory = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        category,
        isOrganic,
        minPrice,
        maxPrice,
        search,
        farmerId,
        isActive = "true",
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (isActive !== "all") {
        filter.isActive = isActive === "true";
    }

    if (category) filter.category = category;

    if (isOrganic !== undefined) {
        filter.isOrganic = isOrganic === "true";
    }

    if (farmerId) filter.farmerId = farmerId;

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.pricePerUnit = {};
        if (minPrice !== undefined) filter.pricePerUnit.$gte = Number(minPrice);
        if (maxPrice !== undefined) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    // Full-text search across productName, description, and tags
    if (search) {
        filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const [inventory, total] = await Promise.all([
        Inventory.find(filter).sort(sortObj).skip(skip).limit(limitNum),
        Inventory.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            inventory,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            },
        }, "Inventory retrieved successfully")
    );
});

// ─── 3. GET SINGLE Inventory ──────────────────────────────────────────────────
/**
 * @desc    Get a single inventory item by ID
 * @route   GET /api/inventory/:id
 * @access  Public
 */
exports.getInventoryById = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        throw new ApiError(404, "Inventory item not found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, inventory, "Inventory item retrieved successfully"));
});

// ─── 4. UPDATE Inventory ──────────────────────────────────────────────────────
/**
 * @desc    Update an inventory item
 * @route   PUT /api/inventory/:id
 * @access  Private (farmer – own items, admin – all)
 */
exports.updateInventory = asyncHandler(async (req, res) => {
    // Use resource pre-fetched by ownership middleware if available
    const existing = req.resource || (await Inventory.findById(req.params.id));

    if (!existing) {
        throw new ApiError(404, "Inventory item not found");
    }

    const prevQuantity = existing.quantity;

    // Apply updates
    Object.assign(existing, req.body);
    const updated = await existing.save();

    // Track quantity changes
    if (req.body.quantity !== undefined && req.body.quantity !== prevQuantity) {
        const delta = updated.quantity - prevQuantity;
        await recordStockHistory({
            inventoryId: updated._id,
            farmerId: updated.farmerId,
            productName: updated.productName,
            changeType: delta > 0 ? "RESTOCKED" : "UPDATED",
            previousQuantity: prevQuantity,
            changeAmount: delta,
            newQuantity: updated.quantity,
            unit: updated.unit,
            note: req.body.note || "Manual inventory update",
            performedBy: req.user ? req.user._id : null,
        });
    }

    res
        .status(200)
        .json(new ApiResponse(200, updated, "Inventory item updated successfully"));
});

// ─── 5. DELETE Inventory (Soft) ───────────────────────────────────────────────
/**
 * @desc    Soft-delete (deactivate) an inventory item
 * @route   DELETE /api/inventory/:id
 * @access  Private (farmer – own items, admin – all)
 */
exports.deleteInventory = asyncHandler(async (req, res) => {
    const existing = req.resource || (await Inventory.findById(req.params.id));

    if (!existing) {
        throw new ApiError(404, "Inventory item not found");
    }

    if (!existing.isActive) {
        throw new ApiError(400, "Inventory item is already deactivated");
    }

    existing.isActive = false;
    await existing.save();

    res
        .status(200)
        .json(new ApiResponse(200, null, "Inventory item deactivated successfully"));
});

// ─── 6. HARD DELETE Inventory ─────────────────────────────────────────────────
/**
 * @desc    Permanently delete an inventory item and its history
 * @route   DELETE /api/inventory/:id/hard
 * @access  Private (admin only)
 */
exports.hardDeleteInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
        throw new ApiError(404, "Inventory item not found");
    }

    // Also remove all history records
    await StockHistory.deleteMany({ inventoryId: req.params.id });

    res
        .status(200)
        .json(new ApiResponse(200, null, "Inventory item permanently deleted"));
});

// ─── 7. RESTORE Inventory ─────────────────────────────────────────────────────
/**
 * @desc    Reactivate a soft-deleted inventory item
 * @route   PATCH /api/inventory/:id/restore
 * @access  Private (farmer – own, admin – all)
 */
exports.restoreInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        throw new ApiError(404, "Inventory item not found");
    }

    if (inventory.isActive) {
        throw new ApiError(400, "Inventory item is already active");
    }

    inventory.isActive = true;
    await inventory.save();

    res
        .status(200)
        .json(new ApiResponse(200, inventory, "Inventory item restored successfully"));
});

// ─── 8. REDUCE STOCK (Order Integration) ─────────────────────────────────────
/**
 * @desc    Reduce stock quantity when an order is placed
 * @route   PATCH /api/inventory/:id/reduce-stock
 * @access  Private (buyer via order service, admin)
 */
exports.reduceStock = asyncHandler(async (req, res) => {
    const { quantityOrdered, orderId, note } = req.body;

    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        throw new ApiError(404, "Inventory item not found");
    }

    if (!inventory.isActive) {
        throw new ApiError(400, "Cannot order from an inactive inventory item");
    }

    if (inventory.quantity < quantityOrdered) {
        throw new ApiError(
            409,
            `Insufficient stock. Available: ${inventory.quantity} ${inventory.unit}, Requested: ${quantityOrdered} ${inventory.unit}`
        );
    }

    const prevQuantity = inventory.quantity;
    inventory.quantity -= quantityOrdered;
    await inventory.save();

    await recordStockHistory({
        inventoryId: inventory._id,
        farmerId: inventory.farmerId,
        productName: inventory.productName,
        changeType: "ORDER",
        previousQuantity: prevQuantity,
        changeAmount: -quantityOrdered,
        newQuantity: inventory.quantity,
        unit: inventory.unit,
        orderId: orderId || null,
        note: note || `Stock reduced for order ${orderId || ""}`,
        performedBy: req.user ? req.user._id : null,
    });

    // Check if now below minimum stock level
    const lowStockWarning =
        inventory.quantity < inventory.minimumStockLevel
            ? {
                warning: true,
                message: `⚠️ Stock is now below minimum level (${inventory.minimumStockLevel} ${inventory.unit})`,
                currentStock: inventory.quantity,
                minimumLevel: inventory.minimumStockLevel,
            }
            : null;

    res.status(200).json(
        new ApiResponse(
            200,
            { updatedInventory: inventory, lowStockWarning },
            `Stock reduced successfully. New quantity: ${inventory.quantity} ${inventory.unit}`
        )
    );
});

// ─── 9. LOW STOCK ALERT ───────────────────────────────────────────────────────
/**
 * @desc    Get all active inventory items where quantity < minimumStockLevel
 * @route   GET /api/inventory/alerts/low-stock
 * @access  Private (farmer – own, admin – all)
 */
exports.getLowStockItems = asyncHandler(async (req, res) => {
    const { farmerId } = req.query;

    const filter = {
        isActive: true,
        $expr: { $lt: ["$quantity", "$minimumStockLevel"] },
    };

    // Farmers can only see their own low-stock items
    if (req.user && req.user.role === "farmer") {
        filter.farmerId = req.user._id;
    } else if (farmerId) {
        filter.farmerId = farmerId;
    }

    const items = await Inventory.find(filter).sort({ quantity: 1 });

    const enriched = items.map((item) => ({
        ...item.toJSON(),
        deficit: item.minimumStockLevel - item.quantity,
        urgencyLevel:
            item.quantity === 0
                ? "CRITICAL"
                : item.quantity <= item.minimumStockLevel / 2
                    ? "HIGH"
                    : "MEDIUM",
    }));

    res.status(200).json(
        new ApiResponse(
            200,
            { count: enriched.length, items: enriched },
            enriched.length > 0
                ? `${enriched.length} item(s) are below minimum stock levels`
                : "All items are adequately stocked"
        )
    );
});

// ─── 10. EXPIRY WARNING ───────────────────────────────────────────────────────
/**
 * @desc    Get items expiring within a configurable number of days (default: 7)
 * @route   GET /api/inventory/alerts/expiring?days=7
 * @access  Private (farmer – own, admin – all)
 */
exports.getExpiringItems = asyncHandler(async (req, res) => {
    const days = Math.max(1, parseInt(req.query.days) || 7);
    const { farmerId } = req.query;

    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + days);

    const filter = {
        isActive: true,
        expiryDate: { $exists: true, $gte: now, $lte: thresholdDate },
    };

    if (req.user && req.user.role === "farmer") {
        filter.farmerId = req.user._id;
    } else if (farmerId) {
        filter.farmerId = farmerId;
    }

    const items = await Inventory.find(filter).sort({ expiryDate: 1 });

    const enriched = items.map((item) => {
        const msLeft = item.expiryDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
        return {
            ...item.toJSON(),
            daysUntilExpiry: daysLeft,
            urgencyLevel: daysLeft <= 2 ? "CRITICAL" : daysLeft <= 4 ? "HIGH" : "MEDIUM",
        };
    });

    // Also fetch already expired items separately
    const expiredItems = await Inventory.find({
        isActive: true,
        expiryDate: { $exists: true, $lt: now },
        ...(req.user?.role === "farmer" ? { farmerId: req.user._id } : farmerId ? { farmerId } : {}),
    });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                windowDays: days,
                soonToExpire: { count: enriched.length, items: enriched },
                alreadyExpired: {
                    count: expiredItems.length,
                    items: expiredItems,
                },
            },
            `Expiry report generated for the next ${days} day(s)`
        )
    );
});

// ─── 11. STOCK STATISTICS ─────────────────────────────────────────────────────
/**
 * @desc    Get stock statistics / dashboard summary
 * @route   GET /api/inventory/stats/summary
 * @access  Private (farmer – own, admin – all)
 */
exports.getStockStats = asyncHandler(async (req, res) => {
    const matchStage =
        req.user && req.user.role === "farmer"
            ? { farmerId: req.user._id }
            : {};

    const [stats] = await Inventory.aggregate([
        { $match: matchStage },
        {
            $facet: {
                overview: [
                    {
                        $group: {
                            _id: null,
                            totalItems: { $sum: 1 },
                            activeItems: { $sum: { $cond: ["$isActive", 1, 0] } },
                            totalQuantityValue: {
                                $sum: { $multiply: ["$quantity", "$pricePerUnit"] },
                            },
                            lowStockCount: {
                                $sum: {
                                    $cond: [{ $lt: ["$quantity", "$minimumStockLevel"] }, 1, 0],
                                },
                            },
                            outOfStockCount: {
                                $sum: { $cond: [{ $eq: ["$quantity", 0] }, 1, 0] },
                            },
                        },
                    },
                ],
                byCategory: [
                    { $match: { isActive: true } },
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 },
                            totalQuantity: { $sum: "$quantity" },
                            avgPrice: { $avg: "$pricePerUnit" },
                        },
                    },
                    { $sort: { count: -1 } },
                ],
                topValueItems: [
                    { $match: { isActive: true } },
                    {
                        $addFields: {
                            totalValue: { $multiply: ["$quantity", "$pricePerUnit"] },
                        },
                    },
                    { $sort: { totalValue: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            productName: 1,
                            quantity: 1,
                            unit: 1,
                            pricePerUnit: 1,
                            totalValue: 1,
                            category: 1,
                        },
                    },
                ],
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(200, stats, "Stock statistics retrieved successfully")
    );
});

// ─── 12. THIRD-PARTY: Weather Advisory ────────────────────────────────────────
/**
 * @desc    Get current weather advisory for a farm location using OpenWeatherMap API.
 *          This helps farmers understand weather impact on their produce.
 * @route   GET /api/inventory/advisory/weather?location=Colombo
 * @access  Private (farmer, admin)
 */
exports.getWeatherAdvisory = asyncHandler(async (req, res) => {
    const location = req.query.location || "Colombo";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        throw new ApiError(
            503,
            "Weather service is not configured. Please set OPENWEATHER_API_KEY in environment variables."
        );
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
    )}&appid=${apiKey}&units=metric`;

    let weatherData;
    try {
        const response = await axios.get(weatherUrl, { timeout: 5000 });
        weatherData = response.data;
    } catch (err) {
        if (err.response?.status === 404) {
            throw new ApiError(404, `Location "${location}" not found in weather service`);
        }
        throw new ApiError(502, "Failed to reach weather service. Please try again later.");
    }

    // Generate farming advisory based on weather conditions
    const temp = weatherData.main.temp;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const humidity = weatherData.main.humidity;

    const advisories = [];

    if (temp > 35) {
        advisories.push({
            level: "WARNING",
            message: "High temperature detected. Ensure perishables are stored in cool areas. Leafy vegetables may wilt faster.",
            affectedCategories: ["vegetables", "fruits", "herbs"],
        });
    }

    if (humidity > 80) {
        advisories.push({
            level: "CAUTION",
            message: "High humidity detected. Risk of mould and fungal growth. Check stored grains and dried produce.",
            affectedCategories: ["grains", "spices"],
        });
    }

    if (weatherMain.includes("rain") || weatherMain.includes("storm")) {
        advisories.push({
            level: "INFO",
            message: "Rainfall expected. Good conditions for leafy crops but protect harvested produce from moisture.",
            affectedCategories: ["vegetables", "fruits"],
        });
    }

    if (advisories.length === 0) {
        advisories.push({
            level: "OK",
            message: "Weather conditions are favourable for produce storage and transportation.",
            affectedCategories: [],
        });
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                location: weatherData.name,
                country: weatherData.sys.country,
                weather: {
                    condition: weatherData.weather[0].description,
                    temperature: `${temp}°C`,
                    humidity: `${humidity}%`,
                    windSpeed: `${weatherData.wind.speed} m/s`,
                },
                farmingAdvisory: advisories,
                fetchedAt: new Date().toISOString(),
            },
            `Weather advisory for ${weatherData.name} retrieved successfully`
        )
    );
});

// ─── 13. GET FARMER'S OWN INVENTORY ──────────────────────────────────────────
/**
 * @desc    Get all inventory items for the currently logged-in farmer
 * @route   GET /api/inventory/my/listings
 * @access  Private (farmer)
 */
exports.getMyInventory = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        category,
        isActive = "true",
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    const filter = { farmerId: req.user._id };

    if (isActive !== "all") filter.isActive = isActive === "true";
    if (category) filter.category = category;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [inventory, total] = await Promise.all([
        Inventory.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limitNum),
        Inventory.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                inventory,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Your inventory retrieved successfully"
        )
    );
});
