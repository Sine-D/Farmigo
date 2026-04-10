/**
 * Wraps an async route handler and forwards any thrown errors to Express's
 * next() error-handling middleware, eliminating repetitive try/catch blocks.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
