import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaLeaf, FaSignOutAlt, FaUser, FaSnowflake,
  FaShoppingBasket, FaClipboardList, FaCog,
  FaArrowRight, FaHeadset
} from 'react-icons/fa';
import { BiMoon, BiSun } from "react-icons/bi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

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
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex items-center gap-3 text-[#137f13]">
          <FaLeaf className="animate-spin text-2xl" />
          <span className="font-bold text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  const cards = [
    {
      icon: <FaSnowflake />,
      title: "Cold Storage",
      desc: "Manage your cold storage facilities and monitor conditions.",
      color: "bg-blue-50 border-blue-100",
      iconColor: "bg-blue-100 text-blue-600",
      link: "/#cold-storage",
    },
    {
      icon: <FaShoppingBasket />,
      title: "Marketplace",
      desc: "Browse and purchase fresh produce from local farmers.",
      color: "bg-green-50 border-green-100",
      iconColor: "bg-green-100 text-[#137f13]",
      link: "/explore",
    },
    {
      icon: <FaClipboardList />,
      title: "My Orders",
      desc: "Track your orders and view your full order history.",
      color: "bg-amber-50 border-amber-100",
      iconColor: "bg-amber-100 text-amber-600",
      link: "/cart",
    },
    {
      icon: <FaHeadset />,
      title: "Support Center",
      desc: "Manage support tickets, disputes, and chat-based issue resolution.",
      color: "bg-emerald-50 border-emerald-100",
      iconColor: "bg-emerald-100 text-emerald-600",
      link: "/support",
    },
    {
      icon: <FaCog />,
      title: "Profile Settings",
      desc: "Update your account information and preferences.",
      color: "bg-purple-50 border-purple-100",
      iconColor: "bg-purple-100 text-purple-600",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10">
        <div className="bg-gradient-to-br from-[#1c2a1c] to-[#2d4a2d] rounded-[28px] p-8 md:p-10 mb-10 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ccff00]/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#137f13]/20" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#ccff00] flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaUser className="text-2xl text-[#1c2a1c]" />
            </div>
            <div>
              <p className="text-[#ccff00] font-bold text-sm uppercase tracking-widest mb-1">Welcome back 👋</p>
              <h2 className="text-3xl font-black text-white mb-1">{user.name}</h2>
              <p className="text-white/60 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Orders Placed", value: "12" },
            { label: "Storage Booked", value: "3" },
            { label: "Products Bought", value: "28" },
            { label: "Open Issues", value: "Manage in Support" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center flex flex-col justify-center">
              <p className="text-2xl font-black text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-5">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card, i) => (
            <Link to={card.link} key={i} className="no-underline group">
              <div className={`bg-white rounded-[24px] border p-6 ${card.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col`}>
                <div className={`w-12 h-12 rounded-xl ${card.iconColor} flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h4 className="font-black text-gray-900 text-base mb-2">{card.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{card.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[#137f13] font-bold text-sm">
                  <span>Go</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;