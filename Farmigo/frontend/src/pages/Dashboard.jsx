import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaLeaf, FaSignOutAlt, FaUser, FaSnowflake,
  FaShoppingBasket, FaClipboardList, FaCog,
  FaArrowRight, FaHeadset, FaRocket, FaShieldAlt
} from 'react-icons/fa';
import { BiMoon, BiSun, BiTrendingUp } from "react-icons/bi";
import ContactHistory from '../components/ContactHistory';
import ProfileModal from '../components/ProfileModal';

import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex items-center gap-3 text-[#137f13]">
          <FaLeaf className="animate-spin text-2xl" />
          <span className="font-bold text-lg text-gray-600">Syncing Ecosystem...</span>
        </div>
      </div>
    );
  }

  const ops = [
    {
      icon: <FaSnowflake />,
      title: "Cold Storage",
      desc: "Precision climate control for your perishable assets.",
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
      icon: <FaShoppingBasket />,
      title: "Marketplace",
      desc: "Direct farm-to-table commerce gateway.",
      tag: "Commerce",
      stat: "1.2k",
      statLabel: "Live Listings",
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
      title: "My Orders",
      desc: "Live logistics tracking and transaction history.",
      tag: "Logistics",
      stat: "12",
      statLabel: "Active",
      link: "/cart",
      accent: "#f59e0b",
      accentLight: "#fffbeb",
      accentBorder: "#fde68a",
      tagBg: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-500",
      barColor: "bg-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
      <div className="pt-[110px] pb-20 px-4 sm:px-8 max-w-[1400px] mx-auto">
        
        {/* ── Hero Banner ───────────────────────────────────────── */}
        <div className="relative rounded-[36px] overflow-hidden mb-10 shadow-[0_24px_80px_rgba(19,127,19,0.18)]">
          {/* base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#1c2a1c] to-[#0a1f1a]" />
          {/* color blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ccff00]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-[#137f13]/30 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#71f66a]/5 rounded-full blur-[60px] pointer-events-none" />
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Left — greeting */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-[#ccff00]/15 border border-[#ccff00]/25 text-[#ccff00] text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-pulse" />
                  System Online
                </span>
                <span className="flex items-center gap-1.5 text-white/30 text-[9px] font-black uppercase tracking-widest">
                  <FaShieldAlt className="text-[8px] text-[#71f66a]" /> Verified Profile
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-none">
                Welcome, <span className="text-[#ccff00]">{user.name.split(' ')[0]}</span>
                <span className="text-[#71f66a]/60"> .</span>
              </h1>
              <p className="text-white/40 font-medium max-w-[440px] text-sm leading-relaxed">
                Manage your agricultural supply chain and connect with the global market.
              </p>
            </div>

            {/* Right — balance card + logout */}
            <div className="flex items-center gap-4">
              {/* Balance */}
              <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Current Balance</p>
                <p className="text-2xl font-black text-white">LKR 42,500<span className="text-white/40 text-lg">.00</span></p>
                <p className="text-[9px] text-[#71f66a] font-bold mt-1">↑ +2.4% this month</p>
              </div>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1.5 group"
                title="Logout"
              >
                <div className="w-14 h-14 bg-[#ccff00] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(204,255,0,0.35)] group-hover:scale-110 group-hover:bg-[#b8e600] transition-all">
                  <FaSignOutAlt className="text-xl text-red-600" />
                </div>
                <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Colorful Stats Grid ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Active Orders",
              value: "12",
              trend: "+2 this week",
              trendUp: true,
              icon: "📦",
              accent: "from-violet-500 to-purple-600",
              glow: "rgba(139,92,246,0.25)",
              bg: "bg-gradient-to-br from-violet-50 to-purple-50",
              border: "border-violet-100",
              labelColor: "text-violet-400",
              trendBg: "bg-violet-100 text-violet-600",
            },
            {
              label: "Tons Traded",
              value: "8.4",
              trend: "Market high",
              trendUp: true,
              icon: "📈",
              accent: "from-sky-400 to-blue-600",
              glow: "rgba(14,165,233,0.25)",
              bg: "bg-gradient-to-br from-sky-50 to-blue-50",
              border: "border-sky-100",
              labelColor: "text-sky-400",
              trendBg: "bg-sky-100 text-sky-600",
            },
            {
              label: "Storage Capacity",
              value: "84%",
              trend: "Optimal",
              trendUp: true,
              icon: "🧊",
              accent: "from-emerald-400 to-teal-600",
              glow: "rgba(16,185,129,0.25)",
              bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
              border: "border-emerald-100",
              labelColor: "text-emerald-500",
              trendBg: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Eco Rating",
              value: "Grade A",
              trend: "Top 5%",
              trendUp: true,
              icon: "🌿",
              accent: "from-amber-400 to-orange-500",
              glow: "rgba(251,191,36,0.25)",
              bg: "bg-gradient-to-br from-amber-50 to-orange-50",
              border: "border-amber-100",
              labelColor: "text-amber-500",
              trendBg: "bg-amber-100 text-amber-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`relative ${stat.bg} border ${stat.border} rounded-3xl p-6 overflow-hidden group cursor-default
                transition-all duration-500 hover:-translate-y-1`}
              style={{ boxShadow: `0 8px 30px ${stat.glow}` }}
            >
              {/* gradient pill accent top-right */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${stat.accent} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-md`} />
              {/* emoji icon */}
              <div className="text-3xl mb-4 select-none">{stat.icon}</div>
              <p className={`${stat.labelColor} text-[10px] font-black uppercase tracking-widest mb-1`}>{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{stat.value}</h3>
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${stat.trendBg}`}>
                {stat.trendUp ? '↑' : '↓'} {stat.trend}
              </span>
            </div>
          ))}
        </div>

        {/* ── Core Operations ─── bento grid ───────────────────── */}
        <div className="mb-12">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-[#ccff00]" />
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Core Operations</h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ops.length + 1} modules</span>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {ops.map((op, i) => (
              <Link to={op.link} key={i} className="no-underline group">
                <div
                  className="relative rounded-[28px] p-6 border-2 overflow-hidden flex flex-col gap-5
                    transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                  style={{
                    background: op.accentLight,
                    borderColor: op.accentBorder,
                    boxShadow: `0 4px 20px ${op.accent}18`,
                  }}
                >
                  {/* Top row: icon + tag */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 ${op.iconBg} text-white rounded-2xl flex items-center justify-center text-lg shadow-lg
                        group-hover:scale-110 transition-transform duration-300`}
                    >
                      {op.icon}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${op.tagBg}`}>
                      {op.tag}
                    </span>
                  </div>

                  {/* Title + desc */}
                  <div>
                    <h4 className="font-black text-gray-900 text-lg tracking-tight mb-1">{op.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">{op.desc}</p>
                  </div>

                  {/* Stat row */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <div>
                      <p className="text-2xl font-black text-gray-900 leading-none">{op.stat}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{op.statLabel}</p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center
                        group-hover:rotate-45 transition-transform duration-300"
                      style={{ borderColor: op.accent, color: op.accent }}
                    >
                      <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${op.barColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-[28px]`} />
                </div>
              </Link>
            ))}

            {/* Support Hub — ContactHistory embedded in its own styled shell */}
            <div className="relative rounded-[28px] border-2 border-dashed border-[#137f13]/20 bg-[#f9fefe] overflow-hidden flex flex-col
              transition-all duration-400 hover:-translate-y-1"
              style={{ boxShadow: '0 4px 20px rgba(19,127,19,0.07)' }}
            >
              {/* Top ribbon */}
              <div className="px-6 pt-5 pb-3 bg-[#137f13]/5 border-b border-[#137f13]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#137f13] text-white rounded-xl flex items-center justify-center text-sm shadow-md">
                    <FaHeadset />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm leading-none">Support Hub</h4>
                    <p className="text-[10px] text-[#137f13] font-bold uppercase tracking-widest mt-0.5">Live tickets</p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#137f13]/10 text-[#137f13]">Support</span>
              </div>
              {/* ContactHistory component inside */}
              <div className="flex-1 overflow-hidden">
                <ContactHistory compact />
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM UTILITY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              className="bg-[#1c2a1c] rounded-[40px] p-8 md:p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer"
              onClick={() => setIsProfileOpen(true)}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                <div>
                    <h3 className="text-2xl font-black mb-2">Account Settings</h3>
                    <p className="text-white/60 font-medium text-sm">Security & multi-channel preferences.</p>
                </div>
                <div className="w-14 h-14 bg-[#ccff00] text-[#1c2a1c] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <FaCog className="text-xl" />
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#137f13] to-[#1c2a1c] rounded-[40px] p-8 md:p-10 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-[#ccff00] flex items-center justify-center text-[#1c2a1c] text-2xl shadow-2xl">
                        <FaRocket />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-1">Scale your Farm</h4>
                        <p className="text-white/70 text-sm font-medium">Read our new trade analytics guide.</p>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-5">
                    <FaLeaf className="text-9xl" />
                </div>
            </div>
        </div>

      </div>

      {/* Profile Sync Popup */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default Dashboard;