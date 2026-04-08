import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaLeaf,
  FaShoppingBasket,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
  FaBell,
  FaSearch
} from 'react-icons/fa';
import { toast } from "sonner";
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    pendingApprovals: 0,
    totalSales: 0,
    activeListings: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role !== 'Admin') {
      toast.error("Unauthorized access");
      navigate('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error("Failed to fetch admin stats:", data);
        setStats({
          totalUsers: 1254,
          totalFarmers: 452,
          pendingApprovals: 12,
          totalSales: 154200,
          activeListings: 890
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalUsers: 1254,
        totalFarmers: 452,
        pendingApprovals: 12,
        totalSales: 154200,
        activeListings: 890
      });
    }
  };


  if (!user) return null;


  const statCards = [
    {
      label: 'Total Revenue',
      value: 'LKR 842.5k',
      trend: '+12.5%',
      icon: <FaMoneyBillWave />,
      color: 'bg-emerald-500'
    },
    {
      label: 'Active Farmers',
      value: stats.totalFarmers || '482',
      trend: '+4%',
      icon: <FaLeaf />,
      color: 'bg-blue-500'
    },
    {
      label: 'Platform Users',
      value: stats.totalUsers || '1,294',
      trend: '+18%',
      icon: <FaUsers />,
      color: 'bg-violet-500'
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals || '14',
      trend: '-2',
      icon: <FaCheckCircle />,
      color: 'bg-amber-500'
    }
  ];

  const alerts = [
    { title: 'New Farmer Registration', time: '2m ago', type: 'info' },
    { title: 'Payout Threshold Reached', time: '14m ago', type: 'warning' },
    { title: 'Server Load Peak', time: '1h ago', type: 'error' },
    { title: '5 New Disputes Opened', time: '3h ago', type: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f5] flex relative overflow-hidden font-sans">
      <div className="absolute top-[0%] left-[20%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#ccff00]/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      
      <AdminSidebar className="relative z-20" />

      <div className="flex-1 ml-72 p-8 xl:p-12 relative z-10 h-screen overflow-y-auto w-full">
        {/* Top Header Floating */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-[450px] group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137f13] transition-colors text-lg" />
            <input
              type="text"
              placeholder="Search users, orders, or analytics..."
              className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-2xl rounded-[30px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] focus:bg-white focus:ring-4 focus:ring-[#137f13]/10 transition-all font-bold text-gray-700 outline-none placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-14 h-14 bg-white/70 backdrop-blur-2xl border border-white rounded-[24px] text-gray-500 hover:text-[#137f13] hover:bg-white transition-all shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer group">
              <FaBell className="text-xl group-hover:scale-110 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            <div className="flex items-center gap-4 p-2 pr-6 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#137f13] to-emerald-400 rounded-[24px] flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest leading-tight">Master Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Panel (Premium Glass styling) */}
        <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group mb-10">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                        <FaLeaf className="text-sm" /> Farmigo App Engine
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">Master <br />Dashboard</h1>
                    <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                        Overview of platform metrics, active transactions, and total user demographics.
                    </p>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-3xl p-6 rounded-[32px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] group hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 ${stat.color} text-white rounded-[24px] flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                    stat.trend.startsWith('+')
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Main content cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Chart Area */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-3xl p-8 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Growth Analytics
                </h3>
                <p className="text-gray-400 text-xs font-bold mt-1">
                  User & Transaction activity overview
                </p>
              </div>
              <select className="bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold px-5 py-3 focus:ring-0 focus:outline-none text-gray-700">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>

            <div className="h-[300px] w-full bg-gradient-to-br from-gray-50 to-white/50 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center opacity-50">
                <FaChartLine className="text-5xl text-gray-300 mb-4 mx-auto" />
                <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">
                  Real-time Data Visualization
                </p>
              </div>
            </div>
          </div>

          {/* Critical Alerts - Premium Dark Card */}
          <div className="bg-gradient-to-br from-[#1c2a1c] to-[#137f13] p-10 rounded-[40px] text-white overflow-hidden shadow-[0_30px_60px_-15px_rgba(19,127,19,0.3)] border border-emerald-800 relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ccff00] rounded-full mix-blend-overlay filter blur-[50px] opacity-20 pointer-events-none"></div>
            
            <h3 className="text-2xl font-black mb-8 relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#ccff00]">
                 <FaBell className="text-lg" />
              </div>
              Critical Alerts
            </h3>

            <div className="space-y-4 relative z-10">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl hover:bg-white/20 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${alert.type === 'error' ? 'text-red-400' : 'text-[#ccff00]'}`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-white/50 font-bold">{alert.time}</span>
                  </div>
                  <p className="text-sm font-bold text-white group-hover:text-white transition-colors leading-snug">
                    {alert.title}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-5 bg-[#ccff00] text-[#1c2a1c] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-[#ccff00]/20 relative z-10 border-none outline-none">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;