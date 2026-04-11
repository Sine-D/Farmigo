import React, { useState, useEffect } from "react";
import { fetchMarketPrice, getPriceComparison } from "../../services/marketPriceService";
import { FaArrowUp, FaArrowDown, FaMinus, FaInfoCircle } from "react-icons/fa";

/**
 * MarketPriceWidget
 * Displays a real-time comparison between farmer price and market average.
 */
const MarketPriceWidget = ({ productName, farmerPrice, currency = "LKR" }) => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMarketData = async () => {
      setLoading(true);
      const res = await fetchMarketPrice(productName);
      if (isMounted && res.success) {
        setMarketData(res.data);
      }
      setLoading(false);
    };

    loadMarketData();
    return () => { isMounted = false; };
  }, [productName]);

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-2 py-1">
        <div className="w-2 h-2 bg-gray-200 rounded-full" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!marketData) return null;

  const comparison = getPriceComparison(farmerPrice, marketData.marketPrice);

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 flex flex-col gap-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
          Market Avg <FaInfoCircle size={10} />
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${comparison.color}`}>
          {comparison.status}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-black text-gray-700">
            {currency} {marketData.marketPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">/{marketData.unit || 'kg'}</span>
        </div>

        <div className="flex items-center gap-1">
          {marketData.trend === "up" ? (
            <FaArrowUp size={12} className="text-red-500" />
          ) : marketData.trend === "down" ? (
            <FaArrowDown size={12} className="text-emerald-500" />
          ) : (
            <FaMinus size={12} className="text-gray-300" />
          )}
        </div>
      </div>
      
      {marketData.isEstimated && (
        <p className="text-[8px] text-gray-300 font-medium italic mt-1">
          * Price estimated based on regional trends
        </p>
      )}
    </div>
  );
};

export default MarketPriceWidget;
