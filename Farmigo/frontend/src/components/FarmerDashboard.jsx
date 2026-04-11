import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaSnowflake, FaShoppingBasket, FaClipboardList, FaArrowRight,
  FaHeadset, FaRocket, FaGraduationCap, FaWarehouse, FaTractor,
  FaChartLine, FaSeedling
} from 'react-icons/fa';
import { BiTrendingUp } from "react-icons/bi";

const FarmerDashboard = ({ user, handleLogout }) => {
  const farmerOps = [
    {
      icon: <FaSnowflake />,
      title: "Cold Storage",
      desc: "Manage your climate-controlled storage units and inventory.",
      tag: "Infrastructure",
      stat: "–3°C",
      statLabel: "Avg. Temp",
      link: "/#cold-storage",
      accent: "#3b82f6",
      accentLight: "#eff6ff",
      accentBorder: "#bfdbfe",
      tagBg: "bg-blue-100 text-blue-600",
      iconBg: "bg-blue-500",
      barColor: "bg-blue-400",
    },
    {
      icon: <FaWarehouse />,
      title: "Inventory",
      desc: "Manage your live produce listings and price points.",
      tag: "Supply",
      stat: "24",
      statLabel: "Live Items",
      link: "/explore",
      accent: "#137f13",
      accentLight: "#f0fdf4",
      accentBorder: "#bbf7d0",
      tagBg: "bg-emerald-100 text-emerald-700",
      iconBg: "bg-[#137f13]",
      barColor: "bg-emerald-400",
    },
    {
      icon: <FaChartLine />,
      title: "Sales Analytics",
      desc: "Track your revenue, market trends, and top buyers.",
      tag: "Business",
      stat: "LKR 120k",
      statLabel: "Monthly",
      link: "/admin",
      accent: "#f59e0b",
      accentLight: "#fffbeb",
      accentBorder: "#fde68a",
      tagBg: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-500",
      barColor: "bg-amber-400",
    },
    {
      icon: <FaGraduationCap />,
      title: "LMS Academy",
      desc: "Learn modern techniques for organic and high-yield farming.",
      tag: "Training",
      stat: "4.9",
      statLabel: "Course Score",
      link: "/lms",
      accent: "#10b981",
      accentLight: "#ecfdf5",
      accentBorder: "#a7f3d0",
      tagBg: "bg-emerald-100 text-emerald-700",
      iconBg: "bg-emerald-500",
      barColor: "bg-emerald-400",
    },
  ];

  return (
    <div className="farmer-dashboard animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ── Hero Banner ───────────────────────────────────────── */}
      <div className="relative rounded-[36px] overflow-hidden mb-10 shadow-[0_24px_80px_rgba(19,127,19,0.18)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#1c2a1c] to-[#0a1f1a]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ccff00]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-[#137f13]/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-[#ccff00]/15 border border-[#ccff00]/25 text-[#ccff00] text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                <FaTractor /> Producer Portal
              </span>
              <span className="flex items-center gap-1.5 text-white/30 text-[9px] font-black uppercase tracking-widest">
                <FaSeedling className="text-[8px] text-[#71f66a]" /> Verified Farmer
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-none uppercase">
              Morning, <span className="text-[#ccff00]">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-white/40 font-medium max-w-[440px] text-sm leading-relaxed">
              Your harvest is powering the ecosystem. Manage storage, analyze sales, and scale your reach.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-white">LKR 142k<span className="text-white/40 text-lg">.50</span></p>
              <p className="text-[9px] text-[#71f66a] font-bold mt-1">↑ +14% growth</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-14 h-14 bg-[#ccff00] rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all text-red-600"
            >
              <FaRocket className="rotate-45" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Farmer Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Storage Used", value: "72%", icon: "🧊", color: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Active Listings", value: "24", icon: "🌱", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Market Reach", value: "85km", icon: "🚀", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { label: "Sustainability", value: "Grade A", icon: "🌿", color: "bg-amber-50 text-amber-600 border-amber-100" },
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
        {farmerOps.map((op, i) => (
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
                  <p className="text-2xl font-black text-gray-900 leading-none">{op.stat}</p>
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

export default FarmerDashboard;
