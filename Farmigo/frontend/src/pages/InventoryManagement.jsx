import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaLeaf,
  FaChartPie,
  FaBoxes,
  FaBell,
  FaHistory,
  FaArrowRight,
  FaSync,
} from "react-icons/fa";
import { toast } from "sonner";

// Services & Components
import {
  getMyInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  restoreInventory,
  getLowStockItems,
  getExpiringItems,
  getStockStats,
  getMyStockHistory,
} from "../services/inventoryService";

import StatsCards from "../components/inventory/StatsCards";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryForm from "../components/inventory/InventoryForm";
import NotificationBell from "../components/inventory/NotificationBell";
import LowStockPanel from "../components/inventory/LowStockPanel";
import ExpiringItemsPanel from "../components/inventory/ExpiringItemsPanel";
import StockHistoryPanel from "../components/inventory/StockHistoryPanel";
import CropInfoPanel from "../components/inventory/CropInfoPanel";
import SoilInfoPanel from "../components/inventory/SoilInfoPanel";
import InventoryAnalytics from "../components/inventory/InventoryAnalytics";

import ConfirmModal from "../components/common/ConfirmModal";
import Loader from "../components/common/Loader";

const CATEGORIES = [
  "all",
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "poultry",
  "herbs",
  "spices",
  "other",
];

// Safely unwrap axios / ApiResponse / already-unwrapped responses
const unwrapResponse = (res) => {
  if (!res) return null;
  if (res.data?.data !== undefined) return res.data.data;
  if (res.data !== undefined) return res.data;
  return res;
};

const InventoryManagement = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // ── Dashboard Data State ────────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    overview: {
      totalItems: 0,
      activeItems: 0,
      totalQuantityValue: 0,
      lowStockCount: 0,
      expiringSoonCount: 0,
      outOfStockCount: 0,
    },
    byCategory: [],
    topValueItems: [],
  });
  const [lowStockRes, setLowStockRes] = useState({ count: 0, items: [] });
  const [expiryRes, setExpiryRes] = useState({
    soonToExpire: { count: 0, items: [] },
    alreadyExpired: { count: 0, items: [] },
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── UI State ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("productName");
  const [order, setOrder] = useState("asc");

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
    type: null,
  });

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const role = String(user.role || "").toLowerCase();
    if (role !== "farmer" && role !== "admin") {
      toast.error("Access denied: specialized dashboard only for farmers.");
      navigate("/marketplace");
    }
  }, [user, navigate]);

  // ── Fetch Logic (Live Updates) ──────────────────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    try {
      const [invRes, stRes, lowRes, expRes, histRes] = await Promise.all([
        getMyInventory({
          sortBy,
          order,
          category: category !== "all" ? category : undefined,
        }),
        getStockStats(),
        getLowStockItems(),
        getExpiringItems({ days: 3 }),
        getMyStockHistory({ limit: 8 }),
      ]);

      const inv = unwrapResponse(invRes) || {};
      const st = unwrapResponse(stRes) || {};
      const low = unwrapResponse(lowRes) || {};
      const exp = unwrapResponse(expRes) || {};
      const hist = unwrapResponse(histRes) || {};

      setItems(inv.inventory || inv.items || []);
      setStats({
        overview: st.overview || {
          totalItems: 0,
          activeItems: 0,
          totalQuantityValue: 0,
          lowStockCount: 0,
          expiringSoonCount: 0,
          outOfStockCount: 0,
        },
        byCategory: st.byCategory || [],
        topValueItems: st.topValueItems || [],
      });

      setLowStockRes({
        count: low.count || 0,
        items: low.items || [],
      });

      setExpiryRes({
        soonToExpire: {
          count: exp.soonToExpire?.count || 0,
          items: exp.soonToExpire?.items || [],
        },
        alreadyExpired: {
          count: exp.alreadyExpired?.count || 0,
          items: exp.alreadyExpired?.items || [],
        },
      });

      setHistory(hist.history || hist.items || []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      toast.error("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, category]);

  // Initial Load + Auto Refresh
  useEffect(() => {
    fetchDashboardData();

    const handleSync = () => fetchDashboardData();

    window.addEventListener("inventoryUpdated", handleSync);
    window.addEventListener("focus", handleSync);

    const interval = setInterval(handleSync, 60000);

    return () => {
      window.removeEventListener("inventoryUpdated", handleSync);
      window.removeEventListener("focus", handleSync);
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  // ── CRUD Handlers ───────────────────────────────────────────────────────────
  const handleSave = async (payload) => {
    setServerErrors(null);

    try {
      if (editItem) {
        await updateInventory(editItem._id, payload);
        toast.success("Listing updated successfully!");
      } else {
        await createInventory(payload);
        toast.success("New listing created!");
      }

      setShowForm(false);
      setEditItem(null);
      fetchDashboardData();
      window.dispatchEvent(new Event("inventoryUpdated"));
    } catch (err) {
      const msg = err?.response?.data?.message || "Operation failed.";
      const backendErrs = err?.response?.data?.errors;

      if (backendErrs) {
        setServerErrors(backendErrs);
        toast.error("Validation failed. Please correct the highlighted fields.");
      } else {
        toast.error(msg);
      }
    }
  };

  const handleAction = async () => {
    const { item, type } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, open: false }));

    try {
      if (type === "delete") {
        await deleteInventory(item._id);
      } else {
        await restoreInventory(item._id);
      }

      toast.success(
        type === "delete" ? "Listing deactivated" : "Listing restored"
      );
      fetchDashboardData();
      window.dispatchEvent(new Event("inventoryUpdated"));
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  // ── Memoized Filters ────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((i) =>
      (i.productName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const totalItems = stats?.overview?.totalItems || 0;

  if (loading && items.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* ── Dashboard Header ── */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 pt-12 pb-24 px-6 md:px-12 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] -ml-24 -mb-24" />
        </div>

        <div className="max-w-7xl mx-auto relative z-[40]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-emerald-400/30">
                  Farmer Workspace
                </span>
                <div className="flex items-center gap-1.5 text-emerald-100/40 text-[10px] font-bold uppercase">
                  <FaSync className="animate-spin-slow" /> Live Sync Active
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Welcome, {user?.name?.split(" ")[0] || "Farmer"}{" "}
                <span className="text-emerald-400">👋</span>
              </h1>

              <p className="text-emerald-100/60 mt-2 font-medium">
                Manage your fields, monitor harvests, and grow your sales.
              </p>
            </div>

            <div className="flex items-center gap-4 relative z-[60]">
              <NotificationBell
                lowStockRes={lowStockRes}
                expiryRes={expiryRes}
              />

              <button
                onClick={() => {
                  setEditItem(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 active:scale-95 group"
              >
                <FaPlus className="text-emerald-900 group-hover:rotate-90 transition-transform duration-500" />
                <span className="uppercase tracking-widest text-xs">
                  New Listing
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 relative z-20">
        <StatsCards
          stats={stats}
          lowStockCount={lowStockRes?.count || 0}
          expiringCount={expiryRes?.soonToExpire?.count || 0}
        />

        <div className="mt-12 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit">
            {[
              { id: "overview", label: "Overview", icon: <FaChartPie /> },
              { id: "inventory", label: "My Inventory", icon: <FaBoxes /> },
              { id: "alerts", label: "Smart Alerts", icon: <FaBell /> },
              { id: "history", label: "Stock History", icon: <FaHistory /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "inventory" && (
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-gray-700"
                />
              </div>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none pl-5 pr-10 py-3.5 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-[10px] uppercase cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FaFilter
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                  size={10}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && (
            <>
              <InventoryAnalytics items={items} stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                          <FaLeaf />
                        </div>
                        Highest Value Produce
                      </h3>

                      <button
                        onClick={() => setActiveTab("inventory")}
                        className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase flex items-center gap-2 group"
                      >
                        See All Listings{" "}
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(stats?.topValueItems || []).map((item, idx) => (
                        <div
                          key={item._id || `${item.productName}-${idx}`}
                          className="p-5 rounded-[2rem] bg-gray-50/50 border border-transparent hover:border-emerald-100 hover:bg-white transition-all group/card"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-gray-200 group-hover/card:text-emerald-300 transition-colors">
                              0{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-black text-gray-800 truncate mb-0.5 uppercase tracking-tight">
                                {item.productName}
                              </p>
                              <p className="text-xs font-bold text-emerald-600">
                                LKR{" "}
                                {Number(item.totalValue || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">
                      Recent Movements
                    </h3>
                    <StockHistoryPanel history={history.slice(0, 5)} compact />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">
                      Inventory Mix
                    </h3>

                    <div className="space-y-5">
                      {(stats?.byCategory || []).map((cat) => (
                        <div key={cat._id || "uncategorized"} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest capitalize">
                              {cat._id || "other"}
                            </span>
                            <span className="text-xs font-black text-emerald-600">
                              {cat.count || 0} Items
                            </span>
                          </div>

                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                              style={{
                                width: `${
                                  ((cat.count || 0) / (totalItems || 1)) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <SoilInfoPanel />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CropInfoPanel />

                <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
                  <div className="absolute -right-4 -bottom-4 text-emerald-800 text-9xl font-black group-hover:scale-110 transition-transform duration-700 opacity-20">
                    <FaLeaf />
                  </div>

                  <div>
                    <h3 className="text-lg font-black uppercase mb-4 tracking-tight">
                      Pro Tip
                    </h3>
                    <p className="text-sm text-emerald-100/70 font-medium leading-relaxed mb-6 max-w-md">
                      Items reaching their expiry date should be promoted or
                      discounted to reduce waste.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => setActiveTab("alerts")}
                      className="px-6 py-3 bg-emerald-400 text-emerald-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all"
                    >
                      Track Alerts
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "inventory" && (
            <InventoryTable
              items={filteredItems}
              onEdit={(item) => {
                setEditItem(item);
                setShowForm(true);
              }}
              onDelete={(item) =>
                setConfirmModal({ open: true, item, type: "delete" })
              }
              onRestore={(item) =>
                setConfirmModal({ open: true, item, type: "restore" })
              }
              sortBy={sortBy}
              order={order}
              onSort={(key) => {
                setOrder(sortBy === key && order === "asc" ? "desc" : "asc");
                setSortBy(key);
              }}
            />
          )}

          {activeTab === "alerts" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LowStockPanel items={lowStockRes?.items || []} />
              <ExpiringItemsPanel
                soon={expiryRes?.soonToExpire?.items || []}
                expired={expiryRes?.alreadyExpired?.items || []}
              />
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-[3rem] p-10 border border-emerald-50 shadow-sm">
              <StockHistoryPanel history={history} />
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">
              {editItem ? "Edit Your Listing" : "New Field Listing"}
            </h2>

            <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <InventoryForm
                initialData={editItem}
                serverErrors={serverErrors}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditItem(null);
                  setServerErrors(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.open}
        title={
          confirmModal.type === "delete"
            ? "Deactivate Listing?"
            : "Restore Listing?"
        }
        message={`This will ${
          confirmModal.type === "delete" ? "remove" : "return"
        } '${confirmModal.item?.productName || ""}' from the public marketplace.`}
        confirmText={
          confirmModal.type === "delete" ? "Deactivate" : "Restore"
        }
        onConfirm={handleAction}
        onCancel={() =>
          setConfirmModal({ open: false, item: null, type: null })
        }
        type={confirmModal.type === "delete" ? "danger" : "success"}
      />
    </div>
  );
};

export default InventoryManagement;