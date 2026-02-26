const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Global error handling middleware.
 * Catches all errors forwarded via next(err) and returns a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ID format: ${err.value}`;
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value for field(s): ${field}`;
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 422;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your session has expired. Please log in again.";
    }

    // Log error in non-production environments
    if (process.env.NODE_ENV !== "production") {
        console.error(`[ERROR] ${statusCode} – ${message}`);
        console.error(err.stack);
    }

    res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
    );
};

module.exports = errorHandler;
