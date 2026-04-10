const mongoose = require("mongoose");

/**
 * Inventory Schema – AgriLink Marketplace
 * Represents a single produce listing by a farmer.
 */
const inventorySchema = new mongoose.Schema(
    {
        // ── Core Product Info ─────────────────────────────────────────────────────
        productName: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [2, "Product name must be at least 2 characters"],
            maxlength: [100, "Product name cannot exceed 100 characters"],
            index: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },

        // ── Farmer Reference ─────────────────────────────────────────────────────
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Farmer ID is required"],
            index: true,
        },

        // ── Category & Tags ──────────────────────────────────────────────────────
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: [
                    "vegetables",
                    "fruits",
                    "grains",
                    "dairy",
                    "poultry",
                    "herbs",
                    "spices",
                    "other",
                ],
                message: "{VALUE} is not a valid category",
            },
            index: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        isOrganic: {
            type: Boolean,
            default: false,
        },

        // ── Stock ────────────────────────────────────────────────────────────────
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"],
        },

        unit: {
            type: String,
            required: [true, "Unit is required"],
            enum: {
                values: ["kg", "g", "pieces", "liters", "bundles", "dozen"],
                message: "{VALUE} is not a supported unit",
            },
        },

        minimumStockLevel: {
            type: Number,
            default: 5,
            min: [0, "Minimum stock level cannot be negative"],
        },

        // ── Pricing ──────────────────────────────────────────────────────────────
        pricePerUnit: {
            type: Number,
            required: [true, "Price per unit is required"],
            min: [0, "Price cannot be negative"],
        },

        currency: {
            type: String,
            default: "LKR",
        },

        // ── Dates ────────────────────────────────────────────────────────────────
        harvestDate: {
            type: Date,
        },

        expiryDate: {
            type: Date,
        },

        // ── Location ─────────────────────────────────────────────────────────────
        location: {
            type: String,
            trim: true,
            maxlength: [200, "Location cannot exceed 200 characters"],
        },

        // ── Status ───────────────────────────────────────────────────────────────
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// ── Compound Indexes ──────────────────────────────────────────────────────────
inventorySchema.index({ farmerId: 1, isActive: 1 });
inventorySchema.index({ category: 1, isActive: 1 });
inventorySchema.index({ productName: "text", description: "text", tags: "text" });

// ── Virtual: isLowStock ───────────────────────────────────────────────────────
inventorySchema.virtual("isLowStock").get(function () {
    return this.quantity <= this.minimumStockLevel;
});

// ── Virtual: isExpiring ──────────────────────────────────────────────────────
inventorySchema.virtual("isExpiring").get(function () {
    if (!this.expiryDate) return false;
    const diff = this.expiryDate.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 3; // within 3 days OR already expired (negative days)
});

// ── Virtual: daysUntilExpiry ──────────────────────────────────────────────────
inventorySchema.virtual("daysUntilExpiry").get(function () {
    if (!this.expiryDate) return null;
    const diff = this.expiryDate.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// ── toJSON: include virtuals ──────────────────────────────────────────────────
inventorySchema.set("toJSON", { virtuals: true });
inventorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Inventory", inventorySchema);
