const Joi = require("joi");
const ApiError = require("../utils/ApiError");

// ─── SIMPLE INVENTORY VALIDATION ─────────────────────────────────────────────

const createInventorySchema = Joi.object({
    productName: Joi.string().required(),
    farmerId: Joi.string().required(),
    category: Joi.string().required(),
    quantity: Joi.number().required(),
    unit: Joi.string().required(),
    pricePerUnit: Joi.number().required(),

    minimumStockLevel: Joi.number().optional(),
    description: Joi.string().optional(),
    harvestDate: Joi.string().optional(),
    expiryDate: Joi.string().optional(),
    location: Joi.string().optional(),
    tags: Joi.array().optional(),
    isOrganic: Joi.boolean().optional(),
}).options({ stripUnknown: true });


const updateInventorySchema = Joi.object({
    productName: Joi.string().optional(),
    farmerId: Joi.string().optional(),
    category: Joi.string().optional(),
    quantity: Joi.number().optional(),
    unit: Joi.string().optional(),
    pricePerUnit: Joi.number().optional(),
    minimumStockLevel: Joi.number().optional(),
    description: Joi.string().optional(),
    harvestDate: Joi.string().optional(),
    expiryDate: Joi.string().optional(),
    location: Joi.string().optional(),
    tags: Joi.array().optional(),
    isOrganic: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
}).options({ stripUnknown: true });


const reduceStockSchema = Joi.object({
    quantityOrdered: Joi.number().required(),
    orderId: Joi.string().optional(),
    note: Joi.string().optional(),
}).options({ stripUnknown: true });


// ─── VALIDATION MIDDLEWARE ────────────────────────────────────────────

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
        return next(
            new ApiError(422, error.details[0].message)
        );
    }

    req.body = value;
    next();
};

module.exports = {
    validate,
    createInventorySchema,
    updateInventorySchema,
    reduceStockSchema,
};