import React, { useState, useMemo } from "react";
import { FaBell } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";

/**
 * NotificationBell.jsx
 * Notification icon with real-time badge count and dropdown panel.
 * Supports live dismissal and real-time count updates.
 */
const NotificationBell = ({ lowStockRes, expiryRes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Derive notifications from raw data + filter out dismissed ones
  const allNotifications = useMemo(() => {
    const list = [];

    // Low Stock (Yellow/Orange)
    if (lowStockRes?.items) {
      lowStockRes.items.forEach(item => {
        list.push({
          id: `lowstock-${item._id}`,
          type: "low_stock",
          productName: item.productName,
          message: `Stock level critical! Only ${item.quantity} ${item.unit} remaining.`,
          quantity: item.quantity,
          unit: item.unit,
          severity: "warning"
        });
      });
    }

    // Expiring Soon (Amber)
    if (expiryRes?.soonToExpire?.items) {
      expiryRes.soonToExpire.items.forEach(item => {
        list.push({
          id: `expiring-${item._id}`,
          type: "expiring",
          productName: item.productName,
          message: `Approaching expiry date. Action recommended.`,
          date: new Date(item.expiryDate).toLocaleDateString(),
          dateLabel: "Expires",
          severity: "amber"
        });
      });
    }

    // Already Expired (Red)
    if (expiryRes?.alreadyExpired?.items) {
      expiryRes.alreadyExpired.items.forEach(item => {
        list.push({
          id: `expired-${item._id}`,
          type: "expired",
          productName: item.productName,
          message: `Product has expired. Remove from marketplace immediately.`,
          date: new Date(item.expiryDate).toLocaleDateString(),
          dateLabel: "Expired on",
          severity: "critical"
        });
      });
    }

    return list;
  }, [lowStockRes, expiryRes]);

  // Filter out dismissed notifications
  const activeNotifications = useMemo(() => {
    return allNotifications.filter(n => !dismissedIds.has(n.id));
  }, [allNotifications, dismissedIds]);

  const handleDismiss = (id) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleDismissAll = () => {
    const allIds = activeNotifications.map(n => n.id);
    setDismissedIds(prev => new Set([...prev, ...allIds]));
  };

  const count = activeNotifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3.5 rounded-2xl border transition-all duration-300 group active:scale-90 ${
          isOpen 
            ? "bg-white text-emerald-700 border-white shadow-xl" 
            : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
        }`}
      >
        <FaBell
          className={`text-xl transition-transform duration-500 ${isOpen ? "rotate-[20deg]" : "group-hover:rotate-12"}`}
        />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-emerald-800 shadow-lg animate-bounce">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={activeNotifications}
        onDismiss={handleDismiss}
        onDismissAll={handleDismissAll}
      />
    </div>
  );
};

export default NotificationBell;
