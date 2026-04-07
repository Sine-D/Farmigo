import React, { useState, useEffect } from 'react';
import { 
  FaLeaf, FaChartPie, FaRecycle, FaDonate, 
  FaArrowUp, FaArrowDown, FaCloud, FaTint,
  FaCheckCircle, FaExclamationCircle, FaPrint, FaDownload,
  FaSearch, FaBell
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';

const SustainabilityManagement = () => {
  const [metrics, setMetrics] = useState(null);
  const [surplusItems, setSurplusItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/sustainability/metrics');
      const metricsData = await response.json();
      setMetrics(metricsData);

      const surplusRes = await fetch('http://localhost:5001/api/sustainability/surplus');
      const surplusData = await surplusRes.json();
      setSurplusItems(surplusData);
    } catch (error) {
      setMetrics({
        carbonSaved: 12500,
        waterReduced: 48000,
        wasteRecycled: 85,
        ecoRating: 'A+',
        surplusManaged: 3450
      });
      setSurplusItems([
        { _id: '1', product: 'Tomatoes', quantity: 450, discountPrice: 120, expiryDate: '2026-04-15' },
        { _id: '2', product: 'Potatoes', quantity: 800, discountPrice: 85, expiryDate: '2026-04-20' },
        { _id: '3', product: 'Onions', quantity: 1200, discountPrice: 150, expiryDate: '2026-05-10' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-[#137f13] border-t-transparent rounded-full shadow-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 p-8 pt-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search sustainability reports..." 
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
                <p className="text-sm font-black text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest">Sustainability Auditor</p>
              </div>
              <div className="w-12 h-12 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] font-black shadow-lg">
                SA
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
                <FaLeaf className="text-2xl" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Eco-Impact Management</h1>
            </div>
            <p className="text-gray-500 font-medium max-w-lg">Monitoring our platform's environmental footprint and waste reduction initiatives.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 shadow-sm hover:shadow-md transition-all">
              <FaPrint /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#137f13] text-white rounded-2xl text-sm font-bold shadow-[0_10px_30px_rgba(19,127,19,0.3)] hover:scale-[1.02] transition-all active:scale-95">
              <FaDownload /> Monthly Report
            </button>
          </div>
        </div>

        {/* Hero Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'CO2 Emissions Saved', value: `${metrics.carbonSaved} kg`, trend: '+14%', trendUp: true, icon: <FaCloud />, color: 'from-sky-400 to-blue-500', shadow: 'rgba(14,165,233,0.1)' },
            { label: 'Water Conservation', value: `${metrics.waterReduced} L`, trend: '+22%', trendUp: true, icon: <FaTint />, color: 'from-emerald-400 to-teal-500', shadow: 'rgba(16,185,129,0.1)' },
            { label: 'Waste to Surplus', value: `${metrics.wasteRecycled}%`, trend: '+8.4%', trendUp: true, icon: <FaRecycle />, color: 'from-amber-400 to-orange-500', shadow: 'rgba(245,158,11,0.1)' },
            { label: 'Global Eco Rating', value: metrics.ecoRating, trend: 'Optimal', trendUp: true, icon: <FaCheckCircle />, color: 'from-violet-400 to-purple-500', shadow: 'rgba(167,139,250,0.1)' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-6 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 cursor-default"
              style={{ boxShadow: `0 10px 40px ${stat.shadow}` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`}></div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${stat.trendUp ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {stat.trendUp ? '↑' : '↓'} {stat.trend}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">this quarter</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900">
          {/* Surplus Inventory Manager */}
          <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight leading-none">Surplus Inventory</h3>
              </div>
              <button className="text-sm font-bold text-emerald-600 hover:underline">View All Active Surplus</button>
            </div>

            <div className="space-y-4">
              {surplusItems.length > 0 ? surplusItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl group border border-transparent hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                        {item.product === 'Tomatoes' ? '🍅' : item.product === 'Potatoes' ? '🥔' : '🧅'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 mb-0.5 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">{item.product}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Qty: <span className="text-gray-900">{item.quantity} kg</span> | Price: <span className="text-emerald-600 font-black">LKR {item.discountPrice}/kg</span></p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden md:block">
                      <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Time to Expiry</p>
                      <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-2/3 h-full bg-orange-400 rounded-full"></div>
                          </div>
                          <p className="text-[10px] font-extrabold text-gray-700">6 Days</p>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black shadow-sm hover:bg-emerald-600 hover:text-white transition-all shadow-emerald-600/5 uppercase tracking-widest">
                      Flash Sale
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 font-bold">No surplus items listed currently.</div>
              )}
            </div>
            
            <button className="w-full mt-8 py-5 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-[10px] font-black hover:border-emerald-300 hover:text-emerald-500 transition-all uppercase tracking-[0.2em]">
              + New Global Sustainability Campaign
            </button>
          </div>

          {/* Donation Hub & NGO Outreach */}
          <div className="bg-gradient-to-br from-[#1c2a1c] to-[#0d1a0d] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-1">Donation Hub</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">NGO Outreach Coordination</p>
              
              <div className="space-y-4 mb-10">
                  {[
                      { org: 'Food For All Lanka', type: 'NGO', impact: '240 meals' },
                      { org: 'Gampaha Community Aid', type: 'Non-profit', impact: '1.2 tons' },
                      { org: 'Healthy Schools Project', type: 'Government', impact: '850 students' }
                  ].map((ngo, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 cursor-pointer transition-all">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-sm">
                                  <FaDonate className="text-emerald-400" />
                              </div>
                              <div>
                                  <h5 className="text-sm font-black mb-0.5">{ngo.org}</h5>
                                  <p className="text-[9px] text-white/40 font-black tracking-widest uppercase">{ngo.type}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">
                                  {ngo.impact}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 mb-8 text-center backdrop-blur-sm">
                  <FaArrowUp className="text-[#ccff00] text-2xl mb-4 mx-auto" />
                  <h4 className="font-black text-[#ccff00] text-lg mb-1 tracking-tight">Impact Grew +18%</h4>
                  <p className="text-white/40 text-xs leading-relaxed font-medium">3,450 kg of food rescued this month through direct NGO donations.</p>
              </div>

              <button className="w-full py-4 bg-[#ccff00] text-[#1c2a1c] rounded-2xl font-black text-xs hover:scale-[1.02] shadow-xl shadow-[#ccff00]/10 transition-all active:scale-95 uppercase tracking-widest">
                  Initiate Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityManagement;
