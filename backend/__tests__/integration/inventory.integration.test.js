/**
 * Integration Tests – Inventory API
 * Tests the full request-response cycle against a real MongoDB (test DB).
 *
 * Prerequisites:
 *   - Set MONGO_URI_TEST in .env.test  OR  MONGO_URI will be used
 *   - A valid JWT_SECRET in env
 *
 * Run: npm run test:integration
 */

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Load test environment
require("dotenv").config({ path: ".env.test" });

const app = require("../../src/utils/server");
const Inventory = require("../../src/models/Inventory");
const StockHistory = require("../../src/models/StockHistory");

// ─── Test Data & Auth Tokens ──────────────────────────────────────────────────
const FARMER_ID = new mongoose.Types.ObjectId();
const ADMIN_ID = new mongoose.Types.ObjectId();

const farmerToken = jwt.sign(
    { _id: FARMER_ID, role: "farmer", name: "Test Farmer" },
    process.env.JWT_SECRET || "test_secret",
    { expiresIn: "1h" }
);

const adminToken = jwt.sign(
    { _id: ADMIN_ID, role: "admin", name: "Test Admin" },
    process.env.JWT_SECRET || "test_secret",
    { expiresIn: "1h" }
);

const validInventoryPayload = {
    productName: "Test Tomatoes",
    farmerId: FARMER_ID.toString(),
    category: "vegetables",
    quantity: 100,
    unit: "kg",
    pricePerUnit: 120,
    minimumStockLevel: 10,
    description: "Fresh organic tomatoes",
    harvestDate: "2026-02-10",
    expiryDate: "2026-03-15",
    location: "Matale, Sri Lanka",
    tags: ["organic", "fresh"],
    isOrganic: true,
};

let createdItemId;

// ─── DB Connection ────────────────────────────────────────────────────────────
beforeAll(async () => {
    const testUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    await mongoose.connect(testUri);
});

afterAll(async () => {
    // Clean up test data
    await Inventory.deleteMany({ productName: /Test/ });
    await StockHistory.deleteMany({});
    await mongoose.connection.close();
});

// ─── Health check ─────────────────────────────────────────────────────────────
describe("GET /health", () => {
    it("should return 200 with status OK", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("OK");
    });
});

// ─── POST /api/inventory ──────────────────────────────────────────────────────
describe("POST /api/inventory", () => {
    it("should create a new inventory item (authenticated farmer)", async () => {
        const res = await request(app)
            .post("/api/inventory")
            .set("Authorization", `Bearer ${farmerToken}`)
            .send(validInventoryPayload);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.productName).toBe("Test Tomatoes");
        createdItemId = res.body.data._id;
    });

    it("should return 422 for missing required fields", async () => {
        const res = await request(app)
            .post("/api/inventory")
            .set("Authorization", `Bearer ${farmerToken}`)
            .send({ productName: "Incomplete" }); // missing required fields

        expect(res.statusCode).toBe(422);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 without authentication token", async () => {
        const res = await request(app)
            .post("/api/inventory")
            .send(validInventoryPayload);

        expect(res.statusCode).toBe(401);
    });
});

// ─── GET /api/inventory ───────────────────────────────────────────────────────
describe("GET /api/inventory", () => {
    it("should return paginated inventory list", async () => {
        const res = await request(app)
            .get("/api/inventory")
            .query({ page: 1, limit: 5 });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("inventory");
        expect(res.body.data).toHaveProperty("pagination");
        expect(Array.isArray(res.body.data.inventory)).toBe(true);
    });

    it("should filter by category", async () => {
        const res = await request(app)
            .get("/api/inventory")
            .query({ category: "vegetables" });

        expect(res.statusCode).toBe(200);
        res.body.data.inventory.forEach((item) => {
            expect(item.category).toBe("vegetables");
        });
    });
});

// ─── GET /api/inventory/:id ───────────────────────────────────────────────────
describe("GET /api/inventory/:id", () => {
    it("should return a single item by ID", async () => {
        const res = await request(app).get(`/api/inventory/${createdItemId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(createdItemId);
    });

    it("should return 400 for invalid ID format", async () => {
        const res = await request(app).get("/api/inventory/not-a-valid-id");

        expect(res.statusCode).toBe(400);
    });

    it("should return 404 for non-existent ID", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/inventory/${fakeId}`);

        expect(res.statusCode).toBe(404);
    });
});

// ─── PUT /api/inventory/:id ───────────────────────────────────────────────────
describe("PUT /api/inventory/:id", () => {
    it("should update the inventory item (owner)", async () => {
        const res = await request(app)
            .put(`/api/inventory/${createdItemId}`)
            .set("Authorization", `Bearer ${farmerToken}`)
            .send({ pricePerUnit: 200, quantity: 90 });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.pricePerUnit).toBe(200);
    });

    it("should return 422 for invalid update data", async () => {
        const res = await request(app)
            .put(`/api/inventory/${createdItemId}`)
            .set("Authorization", `Bearer ${farmerToken}`)
            .send({ quantity: -10 }); // negative quantity

        expect(res.statusCode).toBe(422);
    });
});

// ─── PATCH /api/inventory/:id/reduce-stock ────────────────────────────────────
describe("PATCH /api/inventory/:id/reduce-stock", () => {
    it("should reduce stock and record history", async () => {
        const res = await request(app)
            .patch(`/api/inventory/${createdItemId}/reduce-stock`)
            .set("Authorization", `Bearer ${farmerToken}`)
            .send({ quantityOrdered: 10, orderId: "order-test-001" });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.updatedInventory.quantity).toBe(80);
    });

    it("should return 409 when stock is insufficient", async () => {
        const res = await request(app)
            .patch(`/api/inventory/${createdItemId}/reduce-stock`)
            .set("Authorization", `Bearer ${farmerToken}`)
            .send({ quantityOrdered: 9999 });

        expect(res.statusCode).toBe(409);
    });
});

// ─── GET /api/inventory/:id/history ──────────────────────────────────────────
describe("GET /api/inventory/:id/history", () => {
    it("should return stock history for an item", async () => {
        const res = await request(app)
            .get(`/api/inventory/${createdItemId}/history`)
            .set("Authorization", `Bearer ${farmerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("history");
        expect(Array.isArray(res.body.data.history)).toBe(true);
        // Should have at least: ADDED (create), UPDATED (update), ORDER (reduce-stock)
        expect(res.body.data.history.length).toBeGreaterThanOrEqual(1);
    });
});

// ─── GET /api/inventory/alerts/low-stock ──────────────────────────────────────
describe("GET /api/inventory/alerts/low-stock", () => {
    it("should return low-stock items for the farmer", async () => {
        const res = await request(app)
            .get("/api/inventory/alerts/low-stock")
            .set("Authorization", `Bearer ${farmerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("items");
    });
});

// ─── GET /api/inventory/alerts/expiring ───────────────────────────────────────
describe("GET /api/inventory/alerts/expiring", () => {
    it("should return expiring items within specified days", async () => {
        const res = await request(app)
            .get("/api/inventory/alerts/expiring")
            .query({ days: 30 })
            .set("Authorization", `Bearer ${farmerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("soonToExpire");
        expect(res.body.data).toHaveProperty("alreadyExpired");
    });
});

// ─── DELETE /api/inventory/:id ────────────────────────────────────────────────
describe("DELETE /api/inventory/:id (soft delete)", () => {
    it("should deactivate the item", async () => {
        const res = await request(app)
            .delete(`/api/inventory/${createdItemId}`)
            .set("Authorization", `Bearer ${farmerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deactivated/i);
    });

    it("should return 400 if item is already deactivated", async () => {
        const res = await request(app)
            .delete(`/api/inventory/${createdItemId}`)
            .set("Authorization", `Bearer ${farmerToken}`);

        expect(res.statusCode).toBe(400);
    });
});
