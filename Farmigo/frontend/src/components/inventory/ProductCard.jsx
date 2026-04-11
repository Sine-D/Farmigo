/**
 * ProductCard.jsx – Marketplace product card for FARMIGO inventory items.
 * Displays all key fields from the Inventory schema.
 */
import { useState, useEffect } from "react";
import { FaStar, FaLeaf, FaMapMarkerAlt, FaShoppingCart, FaCheckCircle, FaGlobe } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  formatCurrency,
  formatHarvestDate,
  getStockStatus,
  getCategoryImage,
  categoryConfig,
} from "../../utils/formatters";
import { getUSDRate, formatUSD } from "../../services/currencyService";

const ProductCard = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [usdRate, setUsdRate] = useState(null);

  useEffect(() => {
    getUSDRate().then(setUsdRate);
  }, []);

  const stock = getStockStatus(item.quantity, item.minimumStockLevel);
  const catCfg = categoryConfig[item.category] || categoryConfig.other;
  const isOutOfStock = item.quantity === 0;
  const inCart = cartItems.find((c) => c._id === item._id);
  const imageSrc = (!imgError && item.image) ? item.image : getCategoryImage(item.category);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col group">
      {/* Image */}
      <div
        className="relative h-52 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/inventory/${item._id}`)}
      >
        <img
          src={imageSrc}
          alt={item.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md">
          <FaStar className="text-amber-400 text-xs" />
          <span className="text-xs font-bold text-gray-700">
            {(4 + Math.random()).toFixed(1)}
          </span>
        </div>

        {/* Organic badge */}
        {item.isOrganic && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-md">
            <FaLeaf className="text-[10px]" /> Organic
          </div>
        )}

        {/* Category pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-gray-600">
          {catCfg.emoji} {catCfg.label}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-sm px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-gray-900 text-base leading-snug cursor-pointer hover:text-emerald-700 transition-colors line-clamp-2 mb-1"
          onClick={() => navigate(`/inventory/${item._id}`)}
        >
          {item.productName}
        </h3>

        <p className="text-xs text-gray-500 mb-3">
          By <span className="font-semibold text-emerald-700">{item.farmerName || "FARMIGO Farmer"}</span>
        </p>

        {/* Price + Location row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-emerald-700 font-black text-lg">
              {formatCurrency(item.pricePerUnit, item.currency || "LKR")}
              <span className="text-gray-400 font-normal text-xs">/{item.unit}</span>
            </span>
            {usdRate && (
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 -mt-1">
                <FaGlobe className="text-[9px]" /> {formatUSD(item.pricePerUnit, usdRate)} USD
              </span>
            )}
          </div>
          {item.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaMapMarkerAlt className="text-[10px]" />
              <span className="truncate max-w-[100px]">{item.location}</span>
            </div>
          )}
        </div>

        {/* Harvest date */}
        <p className="text-xs text-gray-400 mb-3">
          🌱 Harvested: {formatHarvestDate(item.harvestDate)}
        </p>

        {/* Stock status */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${stock.badge} mb-4 w-fit`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {stock.label} • {item.quantity} {item.unit}
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => addToCart(item)}
          disabled={isOutOfStock}
          className={`mt-auto w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
            ${isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : inCart
                ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-emerald-200 hover:shadow-lg"
            }`}
        >
          {inCart ? (
            <>
              <FaCheckCircle /> In Cart ({inCart.cartQty})
            </>
          ) : (
            <>
              <FaShoppingCart /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
