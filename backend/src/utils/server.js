/**
 * server.js – Application entry point (as required by project structure)
 * ─────────────────────────────────────────────────────────────────────
 * Creates and configures the Express application, registers all middleware
 * and routes, and exports the configured app for use in index.js and tests.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");
const inventoryRoutes = require("../routes/inventoryRoutes");
const errorHandler = require("../middleware/errorHandler");

const app = express();

// ─── Security & Parsing Middleware ────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (Development) ─────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
        next();
    });
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "AgriLink Inventory Management API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "🌾 AgriLink – Inventory Management API is running!",
        docs: "/api-docs",
        health: "/health",
    });
});

// ─── Swagger API Documentation ────────────────────────────────────────────────
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "AgriLink Inventory API Docs",
        customCss: ".swagger-ui .topbar { background-color: #2d6a4f; }",
        swaggerOptions: {
            persistAuthorization: true,
        },
    })
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/inventory", inventoryRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.status(404).json({
        statusCode: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        success: false,
        data: null,
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
