import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaLeaf, FaShoppingBasket, FaMoneyBillWave,
  FaChartLine, FaCheckCircle, FaExclamationTriangle,
  FaBell, FaSearch
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
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
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

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8 pt-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users, orders, or analytics..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{user.name}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest">Master Admin</p>
              </div>
              <div className="w-12 h-12 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] font-black shadow-lg">
                SA
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: 'LKR 842.5k', trend: '+12.5%', icon: <FaMoneyBillWave />, color: 'bg-emerald-500' },
            { label: 'Active Farmers', value: stats.totalFarmers || '482', trend: '+4%', icon: <FaLeaf />, color: 'bg-blue-500' },
            { label: 'Platform Users', value: stats.totalUsers || '1,294', trend: '+18%', icon: <FaUsers />, color: 'bg-violet-500' },
            { label: 'Pending Approvals', value: stats.pendingApprovals || '14', trend: '-2', icon: <FaCheckCircle />, color: 'bg-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Growth Analytics</h3>
                <p className="text-gray-400 text-xs font-medium">User & Transaction activity overview</p>
              </div>
              <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="text-4xl text-gray-200 mb-4 mx-auto" />
                <p className="text-gray-400 text-sm font-medium">Real-time Data Visualization Engine</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1c2a1c] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-black mb-6 relative z-10">Critical Alerts</h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { title: 'New Farmer Registration', time: '2m ago', type: 'info' },
                { title: 'Payout Threshold Reached', time: '14m ago', type: 'warning' },
                { title: 'Server Load Peak', time: '1h ago', type: 'error' },
                { title: '5 New Disputes Opened', time: '3h ago', type: 'warning' }
              ].map((alert, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">{alert.type}</span>
                    <span className="text-[10px] text-white/40">{alert.time}</span>
                  </div>
                  <p className="text-sm font-bold group-hover:text-[#ccff00] transition-colors">{alert.title}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 bg-[#ccff00] text-[#1c2a1c] rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-[#ccff00]/10">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
