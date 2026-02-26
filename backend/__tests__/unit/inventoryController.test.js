/**
 * Unit Tests – Inventory Controller
 *
 * Uses prefixed mock objects (mockInventory / mockStockHistory) which Jest
 * allows inside jest.mock factory functions. The factory closes over them,
 * giving full per-test control via .mockResolvedValue etc.
 */

// Objects MUST be prefixed with "mock" to be accessible inside jest.mock factory
const mockInventory = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
};

const mockStockHistory = {
    create: jest.fn(),
    deleteMany: jest.fn(),
};

jest.mock("../../src/models/Inventory", () => mockInventory);
jest.mock("../../src/models/StockHistory", () => mockStockHistory);
jest.mock("axios");

const {
    createInventory,
    getInventoryById,
    deleteInventory,
    reduceStock,
    getLowStockItems,
} = require("../../src/controllers/inventoryController");

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeReq = (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    user: { _id: "farmer001", role: "farmer" },
    resource: null,
    ...overrides,
});

const makeRes = () => {
    const r = {};
    r.status = jest.fn().mockReturnValue(r);
    r.json = jest.fn().mockReturnValue(r);
    return r;
};

const invoke = async (fn, req, res) => {
    const next = jest.fn();
    await fn(req, res, next);
    return { next };
};

beforeEach(() => {
    Object.values(mockInventory).forEach((f) => f.mockReset && f.mockReset());
    Object.values(mockStockHistory).forEach((f) => f.mockReset && f.mockReset());
});

// ═══════════════════════════════════════════════════════════════════════════════
// createInventory
// ═══════════════════════════════════════════════════════════════════════════════
describe("createInventory", () => {
    test("201 – creates item and records ADDED stock history", async () => {
        const item = {
            _id: "i1",
            productName: "Tomato",
            farmerId: "f1",
            category: "vegetables",
            quantity: 100,
            unit: "kg",
        };
        mockInventory.create.mockResolvedValue(item);
        mockStockHistory.create.mockResolvedValue({});

        const req = makeReq({ body: { ...item } });
        const res = makeRes();
        const { next } = await invoke(createInventory, req, res);

        expect(next).not.toHaveBeenCalled();
        expect(mockInventory.create).toHaveBeenCalledTimes(1);
        expect(mockStockHistory.create).toHaveBeenCalledTimes(1);
        expect(mockStockHistory.create).toHaveBeenCalledWith(
            expect.objectContaining({ changeType: "ADDED" })
        );
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("farmer: farmerId overridden by req.user._id", async () => {
        mockInventory.create.mockImplementation((d) =>
            Promise.resolve({ ...d, _id: "i2" })
        );
        mockStockHistory.create.mockResolvedValue({});

        const req = makeReq({
            body: {
                farmerId: "EVIL",
                productName: "X",
                category: "vegetables",
                quantity: 1,
                unit: "kg",
            },
            user: { _id: "realFarmer", role: "farmer" },
        });
        const res = makeRes();
        await invoke(createInventory, req, res);
        expect(req.body.farmerId).toBe("realFarmer");
    });

    test("DB error → next(error)", async () => {
        mockInventory.create.mockRejectedValue(new Error("DB fail"));
        const req = makeReq({ body: {} });
        const res = makeRes();
        const { next } = await invoke(createInventory, req, res);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getInventoryById
// ═══════════════════════════════════════════════════════════════════════════════
describe("getInventoryById", () => {
    test("200 – returns found item", async () => {
        mockInventory.findById.mockResolvedValue({ _id: "i1", productName: "Rice" });
        const req = makeReq({ params: { id: "i1" } });
        const res = makeRes();
        const { next } = await invoke(getInventoryById, req, res);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("404 → next(ApiError{statusCode:404}) when not found", async () => {
        mockInventory.findById.mockResolvedValue(null);
        const req = makeReq({ params: { id: "non-exist" } });
        const res = makeRes();
        const { next } = await invoke(getInventoryById, req, res);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 404 });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// reduceStock
// ═══════════════════════════════════════════════════════════════════════════════
describe("reduceStock", () => {
    const fakeInv = (overrides = {}) => ({
        _id: "i1",
        productName: "Onion",
        farmerId: "f1",
        quantity: 100,
        unit: "kg",
        minimumStockLevel: 10,
        isActive: true,
        save: jest.fn().mockResolvedValue(true),
        ...overrides,
    });

    test("200 – reduces quantity, records ORDER history", async () => {
        const inv = fakeInv();
        mockInventory.findById.mockResolvedValue(inv);
        mockStockHistory.create.mockResolvedValue({});

        const req = makeReq({ params: { id: "i1" }, body: { quantityOrdered: 30 } });
        const res = makeRes();
        const { next } = await invoke(reduceStock, req, res);

        expect(next).not.toHaveBeenCalled();
        expect(inv.quantity).toBe(70);
        expect(inv.save).toHaveBeenCalled();
        expect(mockStockHistory.create).toHaveBeenCalledWith(
            expect.objectContaining({ changeType: "ORDER", changeAmount: -30 })
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("409 – insufficient stock → next(ApiError{statusCode:409})", async () => {
        mockInventory.findById.mockResolvedValue(fakeInv({ quantity: 3 }));
        const req = makeReq({ params: { id: "i1" }, body: { quantityOrdered: 99 } });
        const res = makeRes();
        const { next } = await invoke(reduceStock, req, res);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 409 });
    });

    test("400 – inactive item → next(ApiError{statusCode:400})", async () => {
        mockInventory.findById.mockResolvedValue(fakeInv({ isActive: false }));
        const req = makeReq({ params: { id: "i1" }, body: { quantityOrdered: 5 } });
        const res = makeRes();
        const { next } = await invoke(reduceStock, req, res);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 400 });
    });

    test("low-stock warning included when quantity drops below minimum", async () => {
        // quantity: 12 → order 5 → new 7 < minimumStockLevel 10
        const inv = fakeInv({ quantity: 12, minimumStockLevel: 10 });
        mockInventory.findById.mockResolvedValue(inv);
        mockStockHistory.create.mockResolvedValue({});

        const req = makeReq({ params: { id: "i1" }, body: { quantityOrdered: 5 } });
        const res = makeRes();
        const { next } = await invoke(reduceStock, req, res);

        expect(next).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledTimes(1);
        const body = res.json.mock.calls[0][0];
        expect(body.data.lowStockWarning).not.toBeNull();
        expect(body.data.lowStockWarning.warning).toBe(true);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// deleteInventory (soft delete)
// ═══════════════════════════════════════════════════════════════════════════════
describe("deleteInventory", () => {
    test("200 – soft-deletes active item", async () => {
        const inv = {
            _id: "i1",
            isActive: true,
            save: jest.fn().mockResolvedValue(true),
        };
        mockInventory.findById.mockResolvedValue(inv);
        const req = makeReq({ params: { id: "i1" } });
        const res = makeRes();
        const { next } = await invoke(deleteInventory, req, res);
        expect(next).not.toHaveBeenCalled();
        expect(inv.isActive).toBe(false);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test("400 – already deactivated → next(ApiError{400})", async () => {
        mockInventory.findById.mockResolvedValue({ _id: "i1", isActive: false });
        const req = makeReq({ params: { id: "i1" } });
        const res = makeRes();
        const { next } = await invoke(deleteInventory, req, res);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 400 });
    });

    test("404 – not found → next(ApiError{404})", async () => {
        mockInventory.findById.mockResolvedValue(null);
        const req = makeReq({ params: { id: "ghost" } });
        const res = makeRes();
        const { next } = await invoke(deleteInventory, req, res);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 404 });
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getLowStockItems
// ═══════════════════════════════════════════════════════════════════════════════
describe("getLowStockItems", () => {
    test("200 – returns items enriched with urgency levels", async () => {
        const fakeItems = [
            {
                quantity: 0,
                minimumStockLevel: 5,
                toJSON: () => ({ quantity: 0, minimumStockLevel: 5 }),
            },
            {
                quantity: 2,
                minimumStockLevel: 10,
                toJSON: () => ({ quantity: 2, minimumStockLevel: 10 }),
            },
        ];
        mockInventory.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeItems),
        });

        const req = makeReq({ query: {} });
        const res = makeRes();
        const { next } = await invoke(getLowStockItems, req, res);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        const { data } = res.json.mock.calls[0][0];
        expect(data.count).toBe(2);
        expect(data.items[0].urgencyLevel).toBe("CRITICAL"); // quantity 0
    });
});
