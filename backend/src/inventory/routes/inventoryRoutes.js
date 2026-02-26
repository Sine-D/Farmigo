const express = require("express");
const router = express.Router();

const {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getLowStockItems,
    getExpiringItems,
} = require("../controllers/inventoryController");

// Create Inventory
router.post("/", createInventory);

// Get All Inventory
router.get("/", getAllInventory);

// Get Low Stock Items
router.get("/low-stock", getLowStockItems);

// Get Expiring Soon Items
router.get("/expiring", getExpiringItems);

// Get Inventory By ID
router.get("/:id", getInventoryById);

// Update Inventory
router.put("/:id", updateInventory);

// Delete Inventory (Soft Delete)
router.delete("/:id", deleteInventory);

module.exports = router;
