/**
 * formatters.js – Shared data formatting utilities for FARMIGO inventory module
 */

/** Format a price value to LKR currency string */
export const formatCurrency = (amount, currency = "LKR") => {
  if (amount == null) return "N/A";
  return `${currency} ${Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/** Format a date to readable string, with "Today / Yesterday / X days ago" for harvest dates */
export const formatHarvestDate = (dateStr) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
};

/** Format expiry date with urgency info */
export const formatExpiryDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Expired", color: "text-red-600", days: diffDays };
  if (diffDays === 0) return { label: "Expires today", color: "text-red-500", days: 0 };
  if (diffDays <= 2) return { label: `Expires in ${diffDays}d`, color: "text-red-500", days: diffDays };
  if (diffDays <= 7) return { label: `Expires in ${diffDays}d`, color: "text-amber-500", days: diffDays };
  return {
    label: date.toLocaleDateString("en-LK", { day: "numeric", month: "short" }),
    color: "text-gray-400",
    days: diffDays,
  };
};

/** Return stock status label and Tailwind color */
export const getStockStatus = (quantity, minimumStockLevel = 5) => {
  if (quantity === 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" };
  if (quantity < minimumStockLevel) return { label: "Low Stock", color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" };
  return { label: "In Stock", color: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" };
};

/** Return urgency color classes for low-stock urgency levels */
export const urgencyColor = (level) => {
  if (level === "CRITICAL") return "bg-red-100 text-red-700 border-red-200";
  if (level === "HIGH") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
};

/** Category display config */
export const categoryConfig = {
  vegetables: { emoji: "🥬", label: "Vegetables", color: "emerald" },
  fruits: { emoji: "🍎", label: "Fruits", color: "rose" },
  grains: { emoji: "🌾", label: "Grains", color: "amber" },
  dairy: { emoji: "🥛", label: "Dairy", color: "blue" },
  poultry: { emoji: "🐔", label: "Poultry", color: "orange" },
  herbs: { emoji: "🌿", label: "Herbs", color: "teal" },
  spices: { emoji: "🌶️", label: "Spices", color: "red" },
  other: { emoji: "📦", label: "Other", color: "gray" },
};

/** Get placeholder image for a category */
export const getCategoryImage = (category) => {
  const images = {
    vegetables: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&q=80",
    fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
    grains: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
    dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
    poultry: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80",
    herbs: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80",
    spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    other: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
  };
  return images[category] || images.other;
};

/** Change type badge config for stock history */
export const changeTypeBadge = {
  ADDED: { label: "Added", className: "bg-emerald-100 text-emerald-700" },
  RESTOCKED: { label: "Restocked", className: "bg-blue-100 text-blue-700" },
  ORDER: { label: "Order", className: "bg-violet-100 text-violet-700" },
  UPDATED: { label: "Updated", className: "bg-gray-100 text-gray-700" },
  EXPIRED: { label: "Expired", className: "bg-red-100 text-red-700" },
  DAMAGED: { label: "Damaged", className: "bg-orange-100 text-orange-700" },
};
