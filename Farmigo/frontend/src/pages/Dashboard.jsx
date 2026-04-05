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
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#137f13]/10 text-[#137f13] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#137f13]/20">
                        System Online
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <FaShieldAlt className="text-[9px]" /> Verified Profile
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1c2a1c] mb-2">
                    Welcome, {user.name.split(' ')[0]} <span className="text-[#137f13]">.</span>
                </h1>
                <p className="text-gray-500 font-medium max-w-[500px]">
                    Manage your agricultural supply chain and connect with the global market.
                </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col items-end px-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Current Balance</p>
                    <p className="text-xl font-black text-gray-900">LKR 42,500.00</p>
                </div>
                <div className="w-12 h-12 bg-[#ccff00] rounded-xl flex items-center justify-center text-[#1c2a1c] shadow-md cursor-pointer hover:scale-105 transition-transform" onClick={handleLogout}>
                    <FaSignOutAlt className="text-xl text-red-500" />
                </div>
            </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Active Orders", value: "12", trend: "+2 this week" },
            { label: "Tons Traded", value: "8.4", trend: "Market high" },
            { label: "Storage Capacity", value: "84%", trend: "Optimal" },
            { label: "Eco Rating", value: "Grade A", trend: "Top 5%" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
              <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-[#137f13] transition-colors">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mb-2 truncate">{stat.value}</h3>
              <p className="text-[10px] font-bold text-[#137f13] bg-[#f0fdf4] inline-block px-2 py-0.5 rounded-md">{stat.trend}</p>
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