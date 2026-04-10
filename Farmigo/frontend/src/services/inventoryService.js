/**
 * inventoryService.js – All inventory API calls for FARMIGO
 *
 * Backend response shape:
 *   { statusCode, data, message, success }
 *
 * NOTE:
 * api.js already has baseURL = http://localhost:5001/api
 * So DO NOT add "/api" again here.
 */

import api from "./api";

// ── Public: Marketplace / Customer ────────────────────────────────────────────

/**
 * Fetch all active inventory items (paginated, filterable, searchable).
 */
export const getAllInventory = async (params = {}) => {
  const res = await api.get("/inventory", { params });

  return {
    items: res.data?.data?.inventory || [],
    pagination: res.data?.data?.pagination || {},
  };
};

/**
 * Fetch a single inventory item by ID.
 */
export const getInventoryById = async (id) => {
  const res = await api.get(`/inventory/${id}`);
  return res.data?.data;
};

// ── Alerts & Stats (Protected) ────────────────────────────────────────────────

export const getLowStockItems = async (params = {}) => {
  const res = await api.get("/inventory/alerts/low-stock", { params });
  return res.data?.data; // { count, items }
};

export const getExpiringItems = async (days = 7) => {
  const res = await api.get("/inventory/alerts/expiring", {
    params: { days },
  });
  return res.data?.data;
};

export const getStockStats = async () => {
  const res = await api.get("/inventory/stats/summary");
  return res.data?.data;
};

// ── Farmer / Admin Management ─────────────────────────────────────────────────

export const getMyInventory = async (params = {}) => {
  const res = await api.get("/inventory/my/listings", { params });

  return {
    items: res.data?.data?.inventory || [],
    pagination: res.data?.data?.pagination || {},
  };
};

export const createInventory = async (payload) => {
  const res = await api.post("/inventory", payload);
  return res.data?.data;
};

export const updateInventory = async (id, payload) => {
  const res = await api.put(`/inventory/${id}`, payload);
  return res.data?.data;
};

export const deleteInventory = async (id) => {
  const res = await api.delete(`/inventory/${id}`);
  return res.data;
};

export const restoreInventory = async (id) => {
  const res = await api.patch(`/inventory/${id}/restore`);
  return res.data;
};

export const hardDeleteInventory = async (id) => {
  const res = await api.delete(`/inventory/${id}/hard`);
  return res.data;
};

// ── Stock Operations ──────────────────────────────────────────────────────────

export const reduceStock = async (id, payload) => {
  const res = await api.patch(`/inventory/${id}/reduce-stock`, payload);
  return res.data?.data;
};

// ── Stock History ─────────────────────────────────────────────────────────────

export const getInventoryHistory = async (id, params = {}) => {
  const res = await api.get(`/inventory/${id}/history`, { params });
  return res.data?.data;
};

export const getMyStockHistory = async (params = {}) => {
  const res = await api.get("/inventory/history/my", { params });
  return res.data?.data;
};

export const getStockMovementSummary = async (params = {}) => {
  const res = await api.get("/inventory/history/summary", { params });
  return res.data?.data;
};

// ── Weather Advisory ──────────────────────────────────────────────────────────

export const getWeatherAdvisory = async (location = "Colombo") => {
  const res = await api.get("/inventory/advisory/weather", {
    params: { location },
  });
  return res.data?.data;
};