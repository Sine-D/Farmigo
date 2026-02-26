const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        farmerId: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        unit: {
            type: String,
            enum: ["kg", "g", "pieces", "liters"],
            required: true,
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0,
        },

        minimumStockLevel: {
            type: Number,
            default: 5,
        },

        harvestDate: {
            type: Date,
        },

        expiryDate: {
            type: Date,
        },

        location: {
            type: String,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
