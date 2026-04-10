import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingBasket, FaClipboardList, FaArrowRight,
  FaHeadset, FaLeaf, FaHeart, FaHistory, FaMapMarkerAlt,
  FaWallet, FaBell
} from 'react-icons/fa';

const BuyerDashboard = ({ user, handleLogout }) => {
  const buyerOps = [
    {
      icon: <FaShoppingBasket />,
      title: "Marketplace",
      desc: "Source fresh, organic produce directly from verified farmers.",
      tag: "Shopping",
      stat: "2.4k",
      statLabel: "Offerings",
      link: "/explore",
      accent: "#137f13",
      accentLight: "#f0fdf4",
      accentBorder: "#bbf7d0",
      tagBg: "bg-emerald-100 text-emerald-700",
      iconBg: "bg-[#137f13]",
      barColor: "bg-emerald-400",
    },
    {
      icon: <FaClipboardList />,
      title: "Active Orders",
      desc: "Track your current shipments and delivery status in real-time.",
      tag: "Logistics",
      stat: "3",
      statLabel: "Moving",
      link: "/cart",
      accent: "#f59e0b",
      accentLight: "#fffbeb",
      accentBorder: "#fde68a",
      tagBg: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-500",
      barColor: "bg-amber-400",
    },
    {
      icon: <FaHeart />,
      title: "Favorites",
      desc: "Quickly repurchase from the farmers and stores you love.",
      tag: "Social",
      stat: "12",
      statLabel: "Farms",
      link: "/explore",
      accent: "#ec4899",
      accentLight: "#fdf2f8",
      accentBorder: "#fbcfe8",
      tagBg: "bg-pink-100 text-pink-700",
      iconBg: "bg-pink-500",
      barColor: "bg-pink-400",
    },
    {
      icon: <FaHistory />,
      title: "Order History",
      desc: "Review your past transactions and download invoices.",
      tag: "Records",
      stat: "42",
      statLabel: "Completed",
      link: "/cart",
      accent: "#6366f1",
      accentLight: "#eef2ff",
      accentBorder: "#c7d2fe",
      tagBg: "bg-indigo-100 text-indigo-700",
      iconBg: "bg-indigo-500",
      barColor: "bg-indigo-400",
    },
  ];

  return (
    <div className="buyer-dashboard animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* ── Hero Banner ───────────────────────────────────────── */}
      <div className="relative rounded-[36px] overflow-hidden mb-10 shadow-[0_24px_80px_rgba(30,58,138,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2e] via-[#2d336b] to-[#1e1b4b]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-400/15 border border-blue-400/25 text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                <FaShoppingBasket size={10} /> Member Hub
              </span>
              <span className="flex items-center gap-1.5 text-white/30 text-[9px] font-black uppercase tracking-widest">
                <FaLeaf className="text-[8px] text-[#ccff00]" /> Eco-Conscious Buyer
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-none uppercase">
              Hello, <span className="text-[#ccff00]">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-white/40 font-medium max-w-[440px] text-sm leading-relaxed">
              Find the freshest produce directly from local fields. Every purchase supports sustainable agriculture.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Impact Points</p>
              <p className="text-2xl font-black text-white">4,250<span className="text-white/40 text-lg"> pts</span></p>
              <p className="text-[9px] text-[#ccff00] font-bold mt-1">↑ Level 4 Sustainer</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <FaBell className="animate-swing" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Buyer Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Orders", value: "03", icon: "📦", color: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Total Saved", value: "32%", icon: "💰", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "CO2 Offset", value: "14Kg", icon: "🌍", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { label: "Favorites", value: "12", icon: "💖", color: "bg-pink-50 text-pink-600 border-pink-100" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${stat.color} shadow-sm group hover:-translate-y-1 transition-all`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* ── Operations Bento Grid ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {buyerOps.map((op, i) => (
          <Link to={op.link} key={i} className="no-underline group h-full">
            <div
              className="relative rounded-[28px] p-6 border-2 flex flex-col gap-5 transition-all duration-400 hover:shadow-2xl h-full"
              style={{ background: op.accentLight, borderColor: op.accentBorder }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${op.iconBg} text-white rounded-2xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {op.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${op.tagBg}`}>{op.tag}</span>
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg tracking-tight mb-1">{op.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{op.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
                <div>
                  <p className="text-xl font-black text-gray-900 leading-none">{op.stat}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{op.statLabel}</p>
                </div>
                <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center group-hover:rotate-45 transition-transform" style={{ borderColor: op.accent, color: op.accent }}>
                  <FaArrowRight className="text-[10px]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
