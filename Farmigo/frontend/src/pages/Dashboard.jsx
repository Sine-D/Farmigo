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

  const cards = [
    {
      icon: <FaSnowflake />,
      title: "Cold Storage",
      desc: "Precision climate control for your perishable assets.",
      color: "bg-blue-50/50 border-blue-100/50",
      iconColor: "bg-blue-500 text-white",
      link: "/#cold-storage",
    },
    {
      icon: <FaShoppingBasket />,
      title: "Marketplace",
      desc: "Direct farm-to-table commerce gateway.",
      color: "bg-[#137f13]/5 border-[#137f13]/10",
      iconColor: "bg-[#137f13] text-white",
      link: "/explore",
    },
    {
      icon: <FaClipboardList />,
      title: "My Orders",
      desc: "Live logistics Tracking and transaction history.",
      color: "bg-amber-50/50 border-amber-100/50",
      iconColor: "bg-amber-500 text-white",
      link: "/cart",
    }
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

        {/* Core Operations Section */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#137f13]/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
            
            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#ccff00] rounded-full" />
                Core Operations
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {cards.map((card, i) => (
                    <Link to={card.link} key={i} className="no-underline group h-full">
                        <div className={`rounded-[32px] border-2 p-8 ${card.color} border-transparent hover:border-[#ccff00] bg-[#fcfcfc] transition-all duration-500 h-full flex flex-col group-hover:shadow-2xl group-hover:bg-white min-h-[400px]`}>
                            <div className={`w-14 h-14 rounded-2xl ${card.iconColor} flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                                {card.icon}
                            </div>
                            <h4 className="font-black text-gray-900 text-xl mb-3 tracking-tight">{card.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed flex-1 font-medium">{card.desc}</p>
                            <div className="mt-8 flex items-center justify-between">
                                <span className="text-[#137f13] font-black text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Launch</span>
                                <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#ccff00] group-hover:text-[#1c2a1c] group-hover:bg-[#ccff00] transition-all transform group-hover:rotate-45">
                                    <FaArrowRight className="text-xs" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                <ContactHistory />
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