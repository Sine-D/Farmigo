const mongoose = require("mongoose");

/**
 * StockHistory Schema
 * Tracks every change to an inventory item's quantity for auditing and reporting.
 */
const stockHistorySchema = new mongoose.Schema(
    {
        // Reference to the inventory item
        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: [true, "Inventory ID is required"],
            index: true,
        },

        // The farmer who owns the inventory
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Snapshot of product name at time of change (denormalized for reporting)
        productName: {
            type: String,
            required: true,
        },

        // What triggered the change
        changeType: {
            type: String,
            enum: {
                values: [
                    "ADDED",        // New inventory created
                    "UPDATED",      // Manual quantity adjustment
                    "ORDER",        // Stock reduced due to an order
                    "EXPIRED",      // Stock removed due to expiry
                    "DAMAGED",      // Stock removed due to damage/spoilage
                    "RESTOCKED",    // Existing item quantity increased
                    "RESTORED",     // Stock returned from cart/cancellation
                ],
                message: "{VALUE} is not a valid change type",
            },
            required: [true, "Change type is required"],
        },

        // Stock levels around the change
        previousQuantity: {
            type: Number,
            required: true,
        },

        changeAmount: {
            type: Number,
            required: true,
            // Positive = stock increase, Negative = stock decrease
        },

        newQuantity: {
            type: Number,
            required: true,
        },

        unit: {
            type: String,
            required: true,
        },

        // Optional context
        orderId: {
            type: String,
            default: null,
        },

        note: {
            type: String,
            maxlength: [300, "Note cannot exceed 300 characters"],
            default: "",
        },

        // Who performed the action
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast history lookups
stockHistorySchema.index({ inventoryId: 1, createdAt: -1 });
stockHistorySchema.index({ farmerId: 1, createdAt: -1 });
stockHistorySchema.index({ changeType: 1, createdAt: -1 });

module.exports = mongoose.model("StockHistory", stockHistorySchema);
