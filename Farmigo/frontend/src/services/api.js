/**
 * api.js – Axios base instance for FARMIGO
 * Handles base URL + auth token automatically
 */

import axios from "axios";

// 🔥 IMPORTANT: matches your backend (port 5001 + /api)
// On Vercel, if backend and frontend are in the same project, we can use a relative path
const BASE_URL = import.meta.env.PROD 
  ? "/api" 
  : (import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api");




// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Request interceptor: attach JWT token ───────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle global errors ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // 🔐 Handle expired/invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/login";
    }

    // You can add more global error handling here if needed
    return Promise.reject(error);
  }
);

export default api;