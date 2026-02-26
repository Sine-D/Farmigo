/**
 * index.js – Application bootstrap
 * ─────────────────────────────────
 * Connects to MongoDB and starts the HTTP server.
 * The Express app is configured in src/utils/server.js.
 */

require("dotenv").config();
const app = require("./src/utils/server");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Connect to MongoDB first
    await connectDB();

    // Start HTTP server
    app.listen(PORT, () => {
        console.log(`\n🌾 AgriLink Inventory Management API`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🚀 Server      : http://localhost:${PORT}`);
        console.log(`📖 API Docs    : http://localhost:${PORT}/api-docs`);
        console.log(`💚 Health Check: http://localhost:${PORT}/health`);
        console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    process.exit(1);
});

startServer();
