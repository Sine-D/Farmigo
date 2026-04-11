const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    let errors = err.errors || null;

    // Convert array of details (from Joi/ApiError) to Key-Value Object for frontend
    if (Array.isArray(errors)) {
        const formattedErrors = {};
        errors.forEach(e => {
            if (e.field) {
                formattedErrors[e.field] = e.message;
            }
        });
        errors = formattedErrors;
    }

    // Handle Mongoose Validation Error (Database level)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = "Validation failed. Please check your input.";
        errors = errors || {};
        Object.keys(err.errors).forEach(key => {
            errors[key] = err.errors[key].message;
        });
    }

    // Handle Mongoose Cast Error (Invalid IDs)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found. Invalid ${err.path}`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
