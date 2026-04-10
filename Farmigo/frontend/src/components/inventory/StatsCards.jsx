/**
 * StatsCards.jsx – Inventory KPI summary cards for the management dashboard.
 */
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaClock, FaBan, FaCoins } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatters";

const StatCard = ({ icon, label, value, sub, accentClass, bgClass, iconBg }) => (
  <div className={`${bgClass} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-white text-lg shadow-md`}>
        {icon}
      </div>
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest ${accentClass} mb-1`}>{label}</p>
    <p className="text-2xl font-black text-gray-900 leading-none">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const StatsCards = ({ stats, lowStockCount, expiringCount }) => {
  // stats = { overview: [{ totalItems, activeItems, totalQuantityValue, lowStockCount, outOfStockCount }], ... }
  const ov = stats?.overview?.[0] || {};

  const cards = [
    {
      icon: <FaBoxOpen />,
      label: "Total Items",
      value: ov.totalItems ?? 0,
      sub: "All inventory records",
      accentClass: "text-violet-500",
      bgClass: "bg-violet-50",
      iconBg: "bg-violet-500",
    },
    {
      icon: <FaCheckCircle />,
      label: "Active Items",
      value: ov.activeItems ?? 0,
      sub: "Currently listed",
      accentClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      iconBg: "bg-emerald-600",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Low Stock",
      value: ov.lowStockCount ?? lowStockCount ?? 0,
      sub: "Below minimum level",
      accentClass: "text-amber-600",
      bgClass: "bg-amber-50",
      iconBg: "bg-amber-500",
    },
    {
      icon: <FaClock />,
      label: "Expiring Soon",
      value: expiringCount ?? 0,
      sub: "Within 7 days",
      accentClass: "text-orange-600",
      bgClass: "bg-orange-50",
      iconBg: "bg-orange-500",
    },
    {
      icon: <FaBan />,
      label: "Out of Stock",
      value: ov.outOfStockCount ?? 0,
      sub: "Needs restock",
      accentClass: "text-red-600",
      bgClass: "bg-red-50",
      iconBg: "bg-red-500",
    },
    {
      icon: <FaCoins />,
      label: "Inventory Value",
      value: formatCurrency(ov.totalQuantityValue, "LKR"),
      sub: "Qty × Price (active)",
      accentClass: "text-blue-600",
      bgClass: "bg-blue-50",
      iconBg: "bg-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <StatCard key={i} {...c} />
      ))}
    </div>
  );
};

export default StatsCards;
