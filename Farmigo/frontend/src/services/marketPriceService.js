/**
 * marketPriceService.js
 * Simulates real-time market price discovery for agriculture products.
 * In a production app, this would fetch from Agmarknet (Data.gov.in) OR a global commodity API.
 */

// Simulated market data based on current Sri Lankan / Global trends
const MOCK_MARKET_PRICES = {
  tomato: { marketPrice: 160.0, trend: "up", unit: "kg" },
  onion: { marketPrice: 120.0, trend: "down", unit: "kg" },
  rice: { marketPrice: 220.0, trend: "stable", unit: "kg" },
  milk: { marketPrice: 350.0, trend: "up", unit: "liters" },
  eggs: { marketPrice: 60.0, trend: "stable", unit: "pieces" },
  carrots: { marketPrice: 240.0, trend: "up", unit: "kg" },
  potatoes: { marketPrice: 180.0, trend: "down", unit: "kg" },
};

/**
 * Fetches market price for a given product name.
 * @param {string} productName 
 */
export const fetchMarketPrice = async (productName) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const key = productName.toLowerCase().split(' ').find(word => MOCK_MARKET_PRICES[word]);
  
  if (key && MOCK_MARKET_PRICES[key]) {
    return {
      success: true,
      data: MOCK_MARKET_PRICES[key]
    };
  }

  // Random price generator for unknown products (to keep demo alive)
  return {
    success: true,
    data: {
      marketPrice: Math.floor(Math.random() * (300 - 50) + 50),
      trend: Math.random() > 0.5 ? "up" : "down",
      unit: "kg",
      isEstimated: true
    }
  };
};

/**
 * Compares farmer price to market price
 */
export const getPriceComparison = (farmerPrice, marketPrice) => {
  const diff = ((farmerPrice - marketPrice) / marketPrice) * 100;

  if (Math.abs(diff) <= 5) return { status: "Best Price", color: "text-emerald-500", label: "Competitive" };
  if (diff < -5) return { status: "Below Market", color: "text-blue-500", label: "Great Deal" };
  return { status: "Above Market", color: "text-amber-500", label: "Premium" };
};
