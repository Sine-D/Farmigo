/**
 * InventoryMarketplace.jsx – Public-facing Farm Fresh Marketplace page.
 * Fetches live inventory from backend, supports search, category filter, pagination.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaLeaf,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { getAllInventory } from "../services/inventoryService";
import ProductCard from "../components/inventory/ProductCard";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { useCart } from "../context/CartContext";
import { categoryConfig } from "../utils/formatters";

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

const InventoryMarketplace = () => {
  const { totalItems } = useCart();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [isOrganic, setIsOrganic] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 50,
        sortBy,
        order,
        isActive: "true",
      };

      if (activeCategory !== "all") params.category = activeCategory;
      if (isOrganic) params.isOrganic = "true";

      const data = await getAllInventory(params);

      setItems(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Marketplace fetch error:", err);
      setError(
        err?.response?.data?.message || "Failed to load marketplace inventory"
      );
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, activeCategory, isOrganic]);

  useEffect(() => {
    fetchInventory();

    // Listen for live inventory updates
    const handleUpdate = () => fetchInventory();
    window.addEventListener("inventoryUpdated", handleUpdate);
    return () => window.removeEventListener("inventoryUpdated", handleUpdate);
  }, [fetchInventory]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, isOrganic, sortBy, order]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) => {
      const productName = item.productName?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const farmer = item.farmerName?.toLowerCase() || "farmigo farmer";

      return (
        productName.includes(q) ||
        description.includes(q) ||
        category.includes(q) ||
        farmer.includes(q)
      );
    });
  }, [items, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white">
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white px-4 pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
              Live Market
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Farm Fresh <span className="text-emerald-300">Marketplace</span> 🌿
          </h1>
          <p className="text-white/70 text-base md:text-lg font-medium mb-8 max-w-xl mx-auto">
            Connect directly with local farmers and access fresh produce stored in nearby cold storages
          </p>

          <div className="relative max-w-xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              id="marketplace-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tomatoes, milk, rice..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-gray-800 bg-white shadow-xl outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const cfg = categoryConfig[cat];
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                    ${activeCategory === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
                    }`}
                >
                  {cfg ? cfg.emoji : "🏪"}{" "}
                  {cat === "all" ? "All Products" : cfg?.label || cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${isOrganic ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                onClick={() => setIsOrganic(!isOrganic)}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOrganic ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </div>
              <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <FaLeaf className="text-emerald-500" /> Organic Only
              </span>
            </label>

            <select
              id="marketplace-sort"
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split("-");
                setSortBy(s);
                setOrder(o);
              }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="pricePerUnit-asc">Price: Low → High</option>
              <option value="pricePerUnit-desc">Price: High → Low</option>
              <option value="quantity-desc">Most Stock</option>
            </select>

            <Link
              to="/cart"
              id="marketplace-cart-btn"
              className="relative flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-md"
            >
              <FaShoppingCart />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-5">
            {search ? (
              <>
                Showing results for <strong>"{search}"</strong> —{" "}
              </>
            ) : null}
            <strong>{filteredItems.length}</strong> product
            {filteredItems.length !== 1 ? "s" : ""} found
            {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
          </p>
        )}

        {loading ? (
          <Loader fullPage text="Fetching fresh produce..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchInventory} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="🌾"
            title="No products found"
            description="Try adjusting your search or category filter"
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                  setIsOrganic(false);
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <ProductCard key={item._id || item.id} item={item} />
              ))}
            </div>

            {pagination.totalPages > 1 && !search && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${p === page
                          ? "bg-emerald-600 text-white shadow-md"
                          : "border border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryMarketplace;