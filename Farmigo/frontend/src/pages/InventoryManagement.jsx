/**
 * InventoryManagement.jsx – Farmer/Admin inventory management dashboard.
 * Combines: stats, alerts, CRUD table, add/edit modal, stock history.
 * Route: /inventory/manage   (protected – farmer/admin)
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus, FaSearch, FaFilter, FaLeaf, FaSignOutAlt,
  FaTimes, FaCloudSunRain,
} from "react-icons/fa";
import { toast } from "sonner";

import {
  getMyInventory, createInventory, updateInventory,
  deleteInventory, restoreInventory,
  getLowStockItems, getExpiringItems, getStockStats,
  getMyStockHistory, getWeatherAdvisory,
} from "../services/inventoryService";

import StatsCards from "../components/inventory/StatsCards";
import LowStockPanel from "../components/inventory/LowStockPanel";
import ExpiringItemsPanel from "../components/inventory/ExpiringItemsPanel";
import StockHistoryPanel from "../components/inventory/StockHistoryPanel";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryForm from "../components/inventory/InventoryForm";
import ConfirmModal from "../components/common/ConfirmModal";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";
import { categoryConfig } from "../utils/formatters";

const CATEGORIES = ["all", "vegetables", "fruits", "grains", "dairy", "poultry", "herbs", "spices", "other"];

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  // ── Data state ──────────────────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);
  const [lowStockData, setLowStockData] = useState({ count: 0, items: [] });
  const [expiryData, setExpiryData] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview | inventory | alerts | history

  // Filter / sort state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isActiveFilter, setIsActiveFilter] = useState("true"); // "true" | "false" | "all"
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null, type: null });

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login");
    } else if (user.role !== "Farmer" && user.role !== "admin" && user.role !== "Admin") {
      toast.error("Unauthorized: You must be a farmer or admin to access this dashboard");
      navigate("/marketplace");
    }
  }, [user, navigate]);

  // ── Debounce search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch dashboard data ─────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      const [statsRes, lowRes, expRes, histRes] = await Promise.all([
        getStockStats().catch(() => null),
        getLowStockItems().catch(() => null),
        getExpiringItems(7).catch(() => null),
        getMyStockHistory({ limit: 20 }).catch(() => null),
      ]);
      if (statsRes) setStats(statsRes);
      if (lowRes) setLowStockData(lowRes);
      if (expRes) setExpiryData(expRes);
      if (histRes) setHistory(histRes.history || []);
    } catch { /* silent */ }
  }, []);

  // ── Fetch inventory table ────────────────────────────────────────────────────
  const fetchInventory = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = { page, limit: 10, sortBy, order };
      if (isActiveFilter !== "all") params.isActive = isActiveFilter;
      if (category !== "all") params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await getMyInventory(params);
      setItems(data.inventory || []);
      setPagination(data.pagination || {});
    } catch (err) {
      toast.error("Failed to load inventory list");
    } finally {
      setTableLoading(false);
    }
  }, [page, sortBy, order, isActiveFilter, category, debouncedSearch]);

  // ── Initial load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchInventory()]);
      setLoading(false);
      // Weather advisory (non-blocking)
      getWeatherAdvisory("Colombo").then(setWeather).catch(() => null);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchInventory();
  }, [fetchInventory]);

  useEffect(() => { setPage(1); }, [category, debouncedSearch, isActiveFilter, sortBy, order]);

  // ── CRUD Handlers ────────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    setFormLoading(true);
    try {
      await createInventory(payload);
      toast.success("✅ Inventory item created successfully!");
      setShowForm(false);
      await Promise.all([fetchInventory(), fetchDashboard()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (payload) => {
    setFormLoading(true);
    try {
      await updateInventory(editItem._id, payload);
      toast.success("✅ Inventory item updated!");
      setShowForm(false);
      setEditItem(null);
      await Promise.all([fetchInventory(), fetchDashboard()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteInventory(confirmModal.item._id);
      toast.success("Item deactivated");
      setConfirmModal({ open: false, item: null, type: null });
      await Promise.all([fetchInventory(), fetchDashboard()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to deactivate item");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRestore = async () => {
    setConfirmLoading(true);
    try {
      await restoreInventory(confirmModal.item._id);
      toast.success("✅ Item restored successfully!");
      setConfirmModal({ open: false, item: null, type: null });
      await Promise.all([fetchInventory(), fetchDashboard()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to restore item");
    } finally {
      setConfirmLoading(false);
    }
  };

  const openEdit = (item) => { setEditItem(item); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditItem(null); };

  // ── Sort handler ─────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (field === sortBy) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setOrder("desc"); }
  };

  if (loading) return <Loader fullPage text="Loading your inventory dashboard..." />;

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "inventory", label: "📦 Inventory" },
    { key: "alerts", label: `⚠️ Alerts ${(lowStockData.count || 0) + (expiryData?.soonToExpire?.count || 0) > 0 ? `(${(lowStockData.count || 0) + (expiryData?.soonToExpire?.count || 0)})` : ""}` },
    { key: "history", label: "📋 History" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 pt-24 pb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaLeaf className="text-emerald-300" />
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest">
                Inventory Manager
              </span>
            </div>
            <h1 className="text-2xl font-black">
              Welcome, {user?.name?.split(" ")[0] || "Farmer"}
            </h1>
            <p className="text-white/60 text-sm mt-0.5">Manage your farm produce listings</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Weather widget */}
            {weather && (
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
                <FaCloudSunRain className="text-blue-300" />
                <div>
                  <p className="font-bold">{weather.location}</p>
                  <p className="text-white/60 text-xs">{weather.weather?.condition} · {weather.weather?.temperature}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => { setEditItem(null); setShowForm(true); }}
              id="add-inventory-btn"
              className="flex items-center gap-2 bg-white text-emerald-800 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md"
            >
              <FaPlus /> Add Item
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto flex gap-1 mt-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-t-xl text-sm font-semibold transition-all
                ${activeTab === t.key
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Overview Tab ──────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <StatsCards
              stats={stats}
              lowStockCount={lowStockData?.count}
              expiringCount={expiryData?.soonToExpire?.count}
            />

            {/* Category breakdown */}
            {stats?.byCategory?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Inventory by Category</h3>
                <div className="space-y-3">
                  {stats.byCategory.map((cat) => {
                    const cfg = categoryConfig[cat._id] || categoryConfig.other;
                    const pct = Math.min(100, Math.round((cat.count / (stats?.overview?.[0]?.activeItems || 1)) * 100));
                    return (
                      <div key={cat._id} className="flex items-center gap-3">
                        <span className="text-lg w-6">{cfg.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-700">{cfg.label}</span>
                            <span className="text-gray-400">{cat.count} items · {cat.totalQuantity} total qty</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top value items */}
            {stats?.topValueItems?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">🏆 Top Value Items</h3>
                <div className="space-y-3">
                  {stats.topValueItems.map((item, i) => (
                    <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                      <span className="w-7 h-7 bg-emerald-100 text-emerald-700 font-black text-xs rounded-full flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.quantity} {item.unit} in stock</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-emerald-700 text-sm">
                          LKR {Number(item.totalValue || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">total value</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather advisory */}
            {weather?.farmingAdvisory?.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-3">
                  <FaCloudSunRain /> Weather Advisory – {weather.location}
                </h3>
                <div className="space-y-2">
                  {weather.farmingAdvisory.map((adv, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm ${
                      adv.level === "WARNING" ? "bg-red-50 border-red-100 text-red-700" :
                      adv.level === "CAUTION" ? "bg-amber-50 border-amber-100 text-amber-700" :
                      "bg-blue-50 border-blue-100 text-blue-700"
                    }`}>
                      <span className="font-bold">[{adv.level}]</span> {adv.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Inventory Tab ─────────────────────────────────────────────────── */}
        {activeTab === "inventory" && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    id="inv-table-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search my inventory..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Category */}
                <select
                  id="inv-table-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Status */}
                <select
                  id="inv-table-status"
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                  <option value="all">All Status</option>
                </select>

                {/* Sort */}
                <select
                  id="inv-table-sort"
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [s, o] = e.target.value.split("-");
                    setSortBy(s);
                    setOrder(o);
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="pricePerUnit-asc">Price Asc</option>
                  <option value="pricePerUnit-desc">Price Desc</option>
                  <option value="quantity-asc">Stock Asc</option>
                  <option value="quantity-desc">Stock Desc</option>
                </select>

                <button
                  onClick={() => { setSearch(""); setCategory("all"); setIsActiveFilter("true"); }}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 font-semibold"
                >
                  <FaTimes /> Reset
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {tableLoading ? (
                <Loader fullPage text="Loading inventory..." />
              ) : (
                <>
                  <InventoryTable
                    items={items}
                    onEdit={openEdit}
                    onDelete={(item) => setConfirmModal({ open: true, item, type: "delete" })}
                    onRestore={(item) => setConfirmModal({ open: true, item, type: "restore" })}
                    sortBy={sortBy}
                    order={order}
                    onSort={handleSort}
                  />

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-5">
                      <button
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700"
                      >
                        ← Prev
                      </button>
                      <span className="text-sm text-gray-500 font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700"
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 text-center mt-3">
                    Showing {items.length} of {pagination.total || items.length} items
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Alerts Tab ───────────────────────────────────────────────────── */}
        {activeTab === "alerts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockPanel items={lowStockData?.items || []} />
            <ExpiringItemsPanel data={expiryData} />
          </div>
        )}

        {/* ── History Tab ──────────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <StockHistoryPanel history={history} />
        )}
      </div>

      {/* ── Add / Edit Form Modal ────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {editItem ? "✏️ Edit Inventory Item" : "➕ Add New Item"}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {editItem ? `Editing: ${editItem.productName}` : "Fill in the details for your new listing"}
                </p>
              </div>
              <button onClick={closeForm} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <FaTimes />
              </button>
            </div>

            <InventoryForm
              initialData={editItem}
              onSubmit={editItem ? handleUpdate : handleCreate}
              onCancel={closeForm}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* ── Confirm Modal ────────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, item: null, type: null })}
        onConfirm={confirmModal.type === "delete" ? handleDelete : handleRestore}
        loading={confirmLoading}
        title={confirmModal.type === "delete" ? "Deactivate Item?" : "Restore Item?"}
        message={
          confirmModal.type === "delete"
            ? `"${confirmModal.item?.productName}" will be deactivated and hidden from the marketplace. You can restore it anytime.`
            : `"${confirmModal.item?.productName}" will be restored and visible on the marketplace again.`
        }
        confirmLabel={confirmModal.type === "delete" ? "Deactivate" : "Restore"}
        confirmClass={
          confirmModal.type === "delete"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }
      />
    </div>
  );
};

export default InventoryManagement;
