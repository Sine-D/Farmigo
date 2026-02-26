const Inventory = require("../models/Inventory");

// Create Inventory Item
exports.createInventory = async (req, res) => {
    try {
        const inventory = new Inventory(req.body);
        const savedInventory = await inventory.save();
        res.status(201).json(savedInventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Inventory
exports.getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Inventory By ID
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Inventory
exports.updateInventory = async (req, res) => {
    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Inventory (Soft Delete)
exports.deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        res.status(200).json({ message: "Inventory deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Low Stock Items
exports.getLowStockItems = async (req, res) => {
    try {
        const items = await Inventory.find({
            $expr: { $lt: ["$quantity", "$minimumStockLevel"] },
            isActive: true,
        });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Expiring Soon Items (Next 7 Days)
exports.getExpiringItems = async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const items = await Inventory.find({
            expiryDate: { $gte: today, $lte: nextWeek },
            isActive: true,
        });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
