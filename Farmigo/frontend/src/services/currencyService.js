import axios from "axios";

/**
 * currencyService.js – Handles currency conversion for FARMIGO.
 * Uses exchangerate-api.com (v4) for live LKR rates.
 */

const CACHE_KEY = "farmigo_usd_rate";
const CACHE_TTL = 3600000; // 1 hour

export const getUSDRate = async () => {
    try {
        // Check cache first to avoid rate limiting
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { rate, ts } = JSON.parse(cached);
            if (Date.now() - ts < CACHE_TTL) return rate;
        }

        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/LKR");
        const rate = response.data.rates.USD;

        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }));
        return rate;
    } catch (error) {
        console.warn("Currency conversion API failed, using fallback.");
        return 0.0033; // Approx fallback (1 LKR = 0.0033 USD)
    }
};

export const formatUSD = (lkrAmount, rate) => {
    const usd = lkrAmount * rate;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(usd);
};
