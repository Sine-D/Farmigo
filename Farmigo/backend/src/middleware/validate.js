const Joi = require("joi");
const ApiError = require("../utils/ApiError");

// ─── Shared custom messages ───────────────────────────────────────────────────
const messages = {
    "number.min": "{{#label}} must be at least {{#limit}}",
    "number.max": "{{#label}} must be at most {{#limit}}",
    "string.empty": "{{#label}} cannot be empty",
    "any.required": "{{#label}} is required",
};

// ─── Inventory validation schemas ─────────────────────────────────────────────

const createInventorySchema = Joi.object({
    productName: Joi.string().trim().min(2).max(100).required().messages({
        "string.min": "Product name must be at least 2 characters",
        "string.max": "Product name cannot exceed 100 characters",
        "any.required": "Product name is required",
    }),

    farmerId: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .required()
        .messages({
            "string.pattern.base": "farmerId must be a valid MongoDB ObjectId",
            "any.required": "Farmer ID is required",
        }),

    category: Joi.string()
        .valid(
            "vegetables",
            "fruits",
            "grains",
            "dairy",
            "poultry",
            "herbs",
            "spices",
            "other"
        )
        .required()
        .messages({
            "any.only":
                "Category must be one of: vegetables, fruits, grains, dairy, poultry, herbs, spices, other",
            "any.required": "Category is required",
        }),

    quantity: Joi.number().min(0).required().messages(messages),

    unit: Joi.string()
        .valid("kg", "g", "pieces", "liters", "bundles", "dozen")
        .required()
        .messages({
            "any.only": "Unit must be one of: kg, g, pieces, liters, bundles, dozen",
            "any.required": "Unit is required",
        }),

    pricePerUnit: Joi.number().min(0).required().messages({
        "number.min": "Price per unit must be 0 or greater",
        "any.required": "Price per unit is required",
    }),

    minimumStockLevel: Joi.number().min(0).default(5),

    description: Joi.string().trim().max(500).optional(),

    harvestDate: Joi.date().iso().optional(),

    expiryDate: Joi.date().iso().greater(Joi.ref("harvestDate")).optional().messages({
        "date.greater": "Expiry date must be after harvest date",
    }),

    location: Joi.string().trim().max(200).optional(),

    tags: Joi.array().items(Joi.string().trim()).max(10).optional(),

    isOrganic: Joi.boolean().default(false),
}).options({ stripUnknown: true });

const updateInventorySchema = Joi.object({
    productName: Joi.string().trim().min(2).max(100).optional(),
    category: Joi.string()
        .valid(
            "vegetables",
            "fruits",
            "grains",
            "dairy",
            "poultry",
            "herbs",
            "spices",
            "other"
        )
        .optional(),
    quantity: Joi.number().min(0).optional(),
    unit: Joi.string()
        .valid("kg", "g", "pieces", "liters", "bundles", "dozen")
        .optional(),
    pricePerUnit: Joi.number().min(0).optional(),
    minimumStockLevel: Joi.number().min(0).optional(),
    description: Joi.string().trim().max(500).optional().allow(""),
    harvestDate: Joi.date().iso().optional(),
    expiryDate: Joi.date().iso().optional(),
    location: Joi.string().trim().max(200).optional().allow(""),
    tags: Joi.array().items(Joi.string().trim()).max(10).optional(),
    isOrganic: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
}).options({ stripUnknown: true });

const reduceStockSchema = Joi.object({
    quantityOrdered: Joi.number().min(1).required().messages({
        "number.min": "Quantity ordered must be at least 1",
        "any.required": "Quantity ordered is required",
    }),
    orderId: Joi.string().trim().optional(),
    note: Joi.string().trim().max(200).optional(),
}).options({ stripUnknown: true });

// ─── Validation middleware factory ────────────────────────────────────────────

/**
 * Returns Express middleware that validates req.body against the given Joi schema.
 * @param {Joi.ObjectSchema} schema
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const details = error.details.map((d) => ({
            field: d.context.label || d.path.join("."),
            message: d.message,
        }));
        return next(
            new ApiError(422, "Validation failed. Please check your input.", details)
        );
    }

    req.body = value; // replace with Joi-sanitised + defaulted value
    next();
};

module.exports = {
    validate,
    createInventorySchema,
    updateInventorySchema,
    reduceStockSchema,
};
