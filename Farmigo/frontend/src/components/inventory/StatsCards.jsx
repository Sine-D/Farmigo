/**
 * StatsCards.jsx – Premium Inventory KPI summary cards.
 */
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaClock, FaBan, FaCoins } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatters";

const StatCard = ({ icon, label, value, sub, accentClass, bgClass, iconBg }) => (
  <div className={`relative overflow-hidden ${bgClass} rounded-[2.5rem] p-7 border border-white shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-500 hover:-translate-y-1.5 group`}>
    <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-[0.06] blur-2xl transition-all duration-700 group-hover:scale-150 ${iconBg}`} />
    
    <div className="relative z-10">
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-current/20 mb-6 transition-transform duration-500 group-hover:rotate-12`}>
        {icon}
      </div>
      
      <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentClass} mb-2`}>{label}</p>
      <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tight mb-2">
        {value ?? "—"}
      </h3>
      {sub && <p className="text-[11px] font-bold text-gray-400 opacity-80">{sub}</p>}
    </div>
  </div>
);

const StatsCards = ({ stats, lowStockCount, expiringCount }) => {
  const ov = stats?.overview || {};

  const cards = [
    {
      icon: <FaBoxOpen />,
      label: "Total Items",
      value: ov.totalItems ?? 0,
      sub: "Total unique products",
      accentClass: "text-blue-500",
      bgClass: "bg-white",
      iconBg: "bg-blue-500",
    },
    {
      icon: <FaCheckCircle />,
      label: "Active Listings",
      value: ov.activeItems ?? 0,
      sub: "Live on marketplace",
      accentClass: "text-emerald-600",
      bgClass: "bg-white",
      iconBg: "bg-emerald-600",
    },
    {
      icon: <FaExclamationTriangle />,
      label: "Low Stock",
      value: ov.lowStockCount ?? lowStockCount ?? 0,
      sub: "Below safety level",
      accentClass: "text-amber-600",
      bgClass: "bg-white",
      iconBg: "bg-amber-500",
    },
    {
      icon: <FaClock />,
      label: "Expiring Soon",
      value: expiringCount ?? 0,
      sub: "Within 3 days",
      accentClass: "text-orange-600",
      bgClass: "bg-white",
      iconBg: "bg-orange-500",
    },
    {
      icon: <FaBan />,
      label: "Out of Stock",
      value: ov.outOfStockCount ?? 0,
      sub: "Unlisted products",
      accentClass: "text-red-500",
      bgClass: "bg-white",
      iconBg: "bg-red-500",
    },
    {
      icon: <FaCoins />,
      label: "Inv. Value",
      value: formatCurrency(ov.totalQuantityValue, "LKR"),
      sub: "Total market value",
      accentClass: "text-teal-600",
      bgClass: "bg-white",
      iconBg: "bg-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((c, i) => (
        <StatCard key={i} {...c} />
      ))}
    </div>
  );
};

export default StatsCards;
