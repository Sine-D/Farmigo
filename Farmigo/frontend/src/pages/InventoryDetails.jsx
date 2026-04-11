/**
 * InventoryDetails.jsx – Single product detail page.
 * Route: /inventory/:id
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaLeaf, FaMapMarkerAlt, FaCalendarAlt,
  FaStar, FaClock, FaShoppingCart, FaMinus, FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import { getInventoryById, getAllInventory } from "../services/inventoryService";
import { useCart } from "../context/CartContext";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";
import ProductCard from "../components/inventory/ProductCard";
import {
  formatCurrency, formatHarvestDate, formatExpiryDate,
  getStockStatus, getCategoryImage, categoryConfig,
} from "../utils/formatters";

const InventoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInventoryById(id);
        setItem(data);
        // Fetch related (same category)
        const rel = await getAllInventory({ category: data.category, limit: 4, isActive: "true" });
        setRelated((rel.inventory || []).filter((r) => r._id !== id).slice(0, 3));
      } catch (err) {
        setError(err?.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <Loader fullPage text="Loading product..." />;
  if (error || !item) return (
    <div className="pt-28">
      <ErrorState message={error} onRetry={() => navigate(-1)} />
    </div>
  );

  const stock = getStockStatus(item.quantity, item.minimumStockLevel);
  const cat = categoryConfig[item.category] || categoryConfig.other;
  const expiry = formatExpiryDate(item.expiryDate);
  const imageSrc = (!imgError && item.image) ? item.image : getCategoryImage(item.category);
  const inCart = cartItems.find((c) => c._id === item._id);
  const maxQty = Math.min(item.quantity, 20);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* ── Image ──────────────────────────────────────────────────────── */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white h-[420px]">
            <img
              src={imageSrc}
              alt={item.productName}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            {item.isOrganic && (
              <div className="absolute top-4 left-4 bg-emerald-500 text-white font-bold text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <FaLeaf /> Certified Organic
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
              <FaStar className="text-amber-400" />
              <span className="font-bold text-sm">{(4 + Math.random()).toFixed(1)}</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-md">
              {cat.emoji} {cat.label}
            </div>
          </div>

          {/* ── Info ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
              {item.productName}
            </h1>
            <p className="text-gray-500 text-sm mb-5">
              Sold by{" "}
              <span className="font-bold text-emerald-700">
                {item.farmerName || "FARMIGO Farmer"}
              </span>
            </p>

            {/* Price */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 mb-5">
              <p className="text-3xl font-black text-emerald-700">
                {formatCurrency(item.pricePerUnit, item.currency || "LKR")}
                <span className="text-gray-400 font-normal text-base ml-1">per {item.unit}</span>
              </p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mt-2 ${stock.badge}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {stock.label} • {item.quantity} {item.unit} available
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.description}</p>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {item.harvestDate && (
                <div className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <FaCalendarAlt className="text-emerald-500 text-sm flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Harvested</p>
                    <p className="text-sm font-bold text-gray-700">{formatHarvestDate(item.harvestDate)}</p>
                  </div>
                </div>
              )}
              {expiry && (
                <div className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <FaClock className={`text-sm flex-shrink-0 ${expiry.color}`} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Expiry</p>
                    <p className={`text-sm font-bold ${expiry.color}`}>{expiry.label}</p>
                  </div>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <FaMapMarkerAlt className="text-emerald-500 text-sm flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Storage</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{item.location}</p>
                  </div>
                </div>
              )}
              {item.tags?.length > 0 && (
                <div className="col-span-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity selector + Add to Cart */}
            {item.quantity > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>

                <button
                  id="detail-add-cart"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200 text-sm"
                >
                  {inCart ? <FaCheckCircle /> : <FaShoppingCart />}
                  {inCart ? `In Cart (${inCart.cartQty})` : `Add ${qty} to Cart`}
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 px-5 py-3 rounded-xl text-red-600 font-semibold text-sm">
                ❌ This item is currently out of stock
              </div>
            )}

            {/* Total price preview */}
            {item.quantity > 0 && (
              <p className="text-xs text-gray-400 mt-3">
                Subtotal for {qty} {item.unit}:{" "}
                <strong className="text-emerald-700">{formatCurrency(item.pricePerUnit * qty, item.currency)}</strong>
              </p>
            )}
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5">
              🌿 More {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <ProductCard key={r._id} item={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDetails;
