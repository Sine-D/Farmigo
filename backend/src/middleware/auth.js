const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Verifies the JWT Bearer token from the Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { _id, role, name, email }
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token.");
    }
});

/**
 * Role-based access control middleware factory.
 * @param {...string} roles - Allowed roles (e.g., "farmer", "admin")
 */
const authorizeRoles = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access forbidden. Allowed roles: ${roles.join(", ")}`
            );
        }
        next();
    });

/**
 * Ensures the requesting farmer owns the inventory item,
 * OR the user is an admin (who can access everything).
 * Must be called after verifyToken.
 */
const verifyOwnershipOrAdmin = (Model) =>
    asyncHandler(async (req, res, next) => {
        if (req.user.role === "admin") return next();

        const resource = await Model.findById(req.params.id);
        if (!resource) {
            throw new ApiError(404, "Resource not found.");
        }

        if (resource.farmerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You do not have permission to access this resource.");
        }

        req.resource = resource; // pass to controller to avoid double DB query
        next();
    });

module.exports = { verifyToken, authorizeRoles, verifyOwnershipOrAdmin };
