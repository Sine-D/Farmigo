const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AgriLink – Inventory Management API",
            version: "1.0.0",
            description: `
## 🌾 AgriLink Inventory Management API

A RESTful API for managing farm produce inventory for the **AgriLink** marketplace – 
a platform connecting small-scale farmers directly with buyers, supporting **SDG Goal 2: Zero Hunger**.

### Features
- Full CRUD operations for inventory items
- Stock reduction with order integration
- Low-stock alerts with urgency levels
- Expiry warnings and reports
- Stock history tracking and auditing
- Weather-based farming advisories (OpenWeatherMap)
- Role-based access control (farmer / admin / buyer)
      `,
            contact: {
                name: "AgriLink Dev Team",
                email: "dev@agrilink.lk",
            },
            license: {
                name: "MIT",
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === "production"
                    ? process.env.BACKEND_URL || "https://agrilink-api.onrender.com"
                    : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.NODE_ENV === "production" ? "Production Server" : "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: **Bearer &lt;token&gt;**",
                },
            },
            schemas: {
                CreateInventoryInput: {
                    type: "object",
                    required: ["productName", "farmerId", "category", "quantity", "unit", "pricePerUnit"],
                    properties: {
                        productName: { type: "string", example: "Organic Tomatoes", minLength: 2, maxLength: 100 },
                        farmerId: { type: "string", example: "64b8f3a2c4e2b1a3d5f6e789" },
                        category: {
                            type: "string",
                            enum: ["vegetables", "fruits", "grains", "dairy", "poultry", "herbs", "spices", "other"],
                            example: "vegetables",
                        },
                        description: { type: "string", example: "Farm-fresh organic tomatoes grown without pesticides" },
                        quantity: { type: "number", minimum: 0, example: 150 },
                        unit: { type: "string", enum: ["kg", "g", "pieces", "liters", "bundles", "dozen"], example: "kg" },
                        pricePerUnit: { type: "number", minimum: 0, example: 120 },
                        minimumStockLevel: { type: "number", default: 5, example: 10 },
                        harvestDate: { type: "string", format: "date", example: "2026-02-20" },
                        expiryDate: { type: "string", format: "date", example: "2026-03-05" },
                        location: { type: "string", example: "Matale, Sri Lanka" },
                        tags: { type: "array", items: { type: "string" }, example: ["organic", "fresh", "local"] },
                        isOrganic: { type: "boolean", default: false, example: true },
                    },
                },
                UpdateInventoryInput: {
                    type: "object",
                    properties: {
                        productName: { type: "string" },
                        category: { type: "string", enum: ["vegetables", "fruits", "grains", "dairy", "poultry", "herbs", "spices", "other"] },
                        quantity: { type: "number", minimum: 0 },
                        unit: { type: "string", enum: ["kg", "g", "pieces", "liters", "bundles", "dozen"] },
                        pricePerUnit: { type: "number", minimum: 0 },
                        minimumStockLevel: { type: "number", minimum: 0 },
                        description: { type: "string" },
                        harvestDate: { type: "string", format: "date" },
                        expiryDate: { type: "string", format: "date" },
                        location: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        isOrganic: { type: "boolean" },
                        isActive: { type: "boolean" },
                    },
                },
                InventoryItem: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        productName: { type: "string" },
                        farmerId: { type: "string" },
                        category: { type: "string" },
                        description: { type: "string" },
                        quantity: { type: "number" },
                        unit: { type: "string" },
                        pricePerUnit: { type: "number" },
                        currency: { type: "string", default: "LKR" },
                        minimumStockLevel: { type: "number" },
                        harvestDate: { type: "string", format: "date-time" },
                        expiryDate: { type: "string", format: "date-time" },
                        location: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        isOrganic: { type: "boolean" },
                        isActive: { type: "boolean" },
                        isLowStock: { type: "boolean", description: "Virtual field: quantity < minimumStockLevel" },
                        daysUntilExpiry: { type: "number", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        statusCode: { type: "integer" },
                        data: { type: "object" },
                        message: { type: "string" },
                        success: { type: "boolean" },
                    },
                },
            },
        },
        tags: [
            { name: "Inventory", description: "Inventory CRUD operations" },
            { name: "Inventory Alerts", description: "Low-stock and expiry alerts" },
            { name: "Inventory Stats", description: "Statistics and dashboard data" },
            { name: "Inventory Advisory", description: "Third-party integrations (weather)" },
            { name: "Stock History", description: "Stock movement history and auditing" },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
