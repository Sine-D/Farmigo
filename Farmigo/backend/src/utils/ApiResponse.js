/**
 * Standardized API response class for consistent response structure.
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {*}      data       - Response payload
     * @param {string} message    - Human-readable message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

module.exports = ApiResponse;
