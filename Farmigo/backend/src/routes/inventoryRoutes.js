const express = require("express");
const router = express.Router();

const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    hardDeleteInventory,
    restoreInventory,
    reduceStock,
    getLowStockItems,
    getExpiringItems,
    getStockStats,
    getWeatherAdvisory,
    getMyInventory,
} = require("../controllers/inventoryController");

const {
    getInventoryHistory,
    getMyStockHistory,
    getStockMovementSummary,
} = require("../controllers/stockHistoryController");


const { validate, createInventorySchema, updateInventorySchema, reduceStockSchema } = require("../middleware/validate");
const { protect, authorize } = require("../middleware/authMiddleware");
const Inventory = require("../models/Inventory");

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items (with pagination, filtering, search)
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [vegetables, fruits, grains, dairy, poultry, herbs, spices, other] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search across product name, description and tags
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: isOrganic
 *         schema: { type: boolean }
 *       - in: query
 *         name: farmerId
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: List of inventory items with pagination metadata
 */
router.get("/", getAllInventory);

// ─── Alert Routes (Protected) ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/alerts/low-stock:
 *   get:
 *     summary: Get all items where quantity is below minimum stock level
 *     tags: [Inventory Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock items with urgency levels
 */
router.get("/alerts/low-stock", protect, authorize("Farmer", "admin"), getLowStockItems);

/**
 * @swagger
 * /api/inventory/alerts/expiring:
 *   get:
 *     summary: Get items expiring within N days (default 7)
 *     tags: [Inventory Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 7 }
 *     responses:
 *       200:
 *         description: Expiring and already expired items
 */
router.get("/alerts/expiring", protect, authorize("Farmer", "admin"), getExpiringItems);

// ─── Statistics ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/stats/summary:
 *   get:
 *     summary: Get stock statistics and dashboard summary
 *     tags: [Inventory Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated inventory statistics
 */
router.get("/stats/summary", protect, authorize("Farmer", "admin"), getStockStats);

// ─── Third-party Advisory ─────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/advisory/weather:
 *   get:
 *     summary: Get weather advisory for farm location (OpenWeatherMap)
 *     tags: [Inventory Advisory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema: { type: string, default: Colombo }
 *     responses:
 *       200:
 *         description: Weather data and farming advisories
 */
router.get("/advisory/weather", protect, authorize("Farmer", "admin"), getWeatherAdvisory);

// ─── History Routes (Protected) ───────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/history/my:
 *   get:
 *     summary: Get stock history for all items of the logged-in farmer
 *     tags: [Stock History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated stock history
 */
router.get("/history/my", protect, authorize("Farmer", "admin"), getMyStockHistory);

/**
 * @swagger
 * /api/inventory/history/summary:
 *   get:
 *     summary: Get aggregated stock movement summary by change type
 *     tags: [Stock History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movement summary grouped by change type
 */
router.get("/history/summary", protect, authorize("Farmer", "admin"), getStockMovementSummary);

/**
 * @swagger
 * /api/inventory/{id}/history:
 *   get:
 *     summary: Get stock history for a single inventory item
 *     tags: [Stock History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated history for this item
 */
router.get("/:id/history", protect, authorize("Farmer", "admin"), getInventoryHistory);

// ─── Farmer Routes ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/my/listings:
 *   get:
 *     summary: Get all inventory listings for the logged-in farmer
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Farmer's inventory items
 */
router.get(
    "/my/listings",
    protect,
    authorize("Farmer", "admin"),
    getMyInventory
);

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryInput'
 *     responses:
 *       201:
 *         description: Inventory item created
 *       422:
 *         description: Validation error
 */
router.post(
    "/",
    protect,
    authorize("Farmer", "admin"),
    validate(createInventorySchema),
    createInventory
);

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated inventory item
 *       403:
 *         description: Unauthorized – not your item
 *       404:
 *         description: Not found
 */
router.put(
    "/:id",
    protect,
    authorize("Farmer", "admin"),
    validate(updateInventorySchema),
    updateInventory
);

// ─── Delete (Soft) ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Soft-delete (deactivate) an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inventory deactivated
 */
router.delete(
    "/:id",
    protect,
    authorize("Farmer", "admin"),
    deleteInventory
);

// ─── Hard Delete (Admin only) ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/{id}/hard:
 *   delete:
 *     summary: Permanently delete an inventory item (Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item permanently deleted
 */
router.delete(
    "/:id/hard",
    protect,
    authorize("admin"),
    hardDeleteInventory
);

// ─── Restore ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item restored
 */
router.patch(
    "/:id/restore",
    protect,
    authorize("Farmer", "admin"),
    restoreInventory
);

// ─── Reduce Stock ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/inventory/{id}/reduce-stock:
 *   patch:
 *     summary: Reduce stock quantity (called when an order is placed)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantityOrdered: { type: number, minimum: 1 }
 *               orderId: { type: string }
 *               note: { type: string }
 *     responses:
 *       200:
 *         description: Stock reduced, with low-stock warning if applicable
 *       409:
 *         description: Insufficient stock
 */
router.patch(
    "/:id/reduce-stock",
    protect,
    validate(reduceStockSchema),
    reduceStock
);

// ─── Get Single (Moved after specific paths) ──────────────────────────────────

router.get("/:id", getInventoryById);

module.exports = router;
