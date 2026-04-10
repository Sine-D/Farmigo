import React, { useState, useEffect } from 'react';
import { 
  FaLeaf, FaChartPie, FaRecycle, FaDonate, 
  FaArrowUp, FaArrowDown, FaCloud, FaTint,
  FaCheckCircle, FaExclamationCircle, FaPrint, FaDownload,
  FaSearch, FaBell
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';
import { API_BASE_URL } from '../utils/api';


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
      const response = await fetch(`${API_BASE_URL}/sustainability/metrics`);
      const metricsData = await response.json();
      setMetrics(metricsData);

      const surplusRes = await fetch(`${API_BASE_URL}/sustainability/surplus`);
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
              placeholder="Search sustainability reports..." 
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
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest leading-tight">Sustainability Auditor</p>
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
                        <FaLeaf className="text-sm" /> Eco-Track Network
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">Eco-Impact <br />Management</h1>
                    <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                        Monitoring our platform's environmental footprint and waste reduction initiatives.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-3 px-8 py-5 bg-white/60 backdrop-blur-md border border-white/80 rounded-[24px] text-xs font-black text-gray-700 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:bg-white hover:text-[#137f13] transition-all uppercase tracking-widest">
                    <FaPrint /> Export PDF
                  </button>
                  <button className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-[#137f13] to-emerald-500 text-white rounded-[24px] text-xs font-black shadow-[0_20px_40px_-10px_rgba(19,127,19,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(19,127,19,0.5)] hover:-translate-y-1 transition-all uppercase tracking-widest">
                    <FaDownload /> Monthly Report
                  </button>
                </div>
            </div>
        </div>

        {/* Hero Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'CO2 Saved', value: `${metrics.carbonSaved} kg`, trend: '+14%', trendUp: true, icon: <FaCloud />, color: 'from-sky-400 to-blue-500', shadow: 'rgba(14,165,233,0.1)' },
            { label: 'Water Conserved', value: `${metrics.waterReduced} L`, trend: '+22%', trendUp: true, icon: <FaTint />, color: 'from-emerald-400 to-teal-500', shadow: 'rgba(16,185,129,0.1)' },
            { label: 'Waste Surplus', value: `${metrics.wasteRecycled}%`, trend: '+8.4%', trendUp: true, icon: <FaRecycle />, color: 'from-amber-400 to-orange-500', shadow: 'rgba(245,158,11,0.1)' },
            { label: 'Eco Rating', value: metrics.ecoRating, trend: 'Optimal', trendUp: true, icon: <FaCheckCircle />, color: 'from-violet-400 to-purple-500', shadow: 'rgba(167,139,250,0.1)' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/80 backdrop-blur-3xl p-6 rounded-[32px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all cursor-default relative"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full pointer-events-none`}></div>
              <div className="flex items-start justify-between mb-6">
                 <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} text-white rounded-[24px] flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform relative z-10`}>
                   {stat.icon}
                 </div>
                 <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border relative z-10 ${stat.trendUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   {stat.trendUp ? '↑' : '↓'} {stat.trend}
                 </span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mb-2 leading-none relative z-10">{stat.value}</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest relative z-10">This Quarter</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900">
          {/* Surplus Inventory Manager */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 lg:p-10 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 bg-gray-100 text-[#137f13] rounded-[20px] flex items-center justify-center text-xl shadow-inner border border-white">
                    <FaRecycle />
                </span>
                <h3 className="text-xl font-black tracking-tight leading-none">Surplus Inventory</h3>
              </div>
              <button className="text-[10px] font-black text-[#137f13] bg-emerald-50 px-4 py-2 rounded-xl transition-colors hover:bg-[#137f13] hover:text-white uppercase tracking-widest">View All</button>
            </div>

            <div className="space-y-4">
              {surplusItems.length > 0 ? surplusItems.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-white rounded-[32px] border border-gray-100 hover:border-emerald-200 hover:shadow-[0_15px_40px_-15px_rgba(19,127,19,0.15)] hover:-translate-y-1 transition-all group duration-300">
                  <div className="flex items-center gap-6 flex-1 w-full">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-[24px] flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                        {item.product === 'Tomatoes' ? '🍅' : item.product === 'Potatoes' ? '🥔' : '🧅'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{item.product}</h4>
                        <span className="text-[9px] font-black px-3 py-1 rounded-xl bg-gray-50 border uppercase tracking-widest text-emerald-600 border-emerald-100">
                          {item.quantity} kg
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaDonate className="text-[10px] text-emerald-500" /> Price: <span className="text-gray-900">LKR {item.discountPrice}/kg</span></span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-1.5 uppercase tracking-widest text-orange-500">Exp: {new Date(item.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
                    <div className="hidden lg:block text-right pr-4 border-r border-gray-100">
                        <p className="text-[8px] font-black uppercase text-gray-400 mb-2 tracking-widest">Urgency</p>
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                            </div>
                            <p className="text-[10px] font-black text-gray-700">6 Days</p>
                        </div>
                    </div>
                    <button className="flex-1 md:flex-none px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black border border-emerald-100 hover:bg-[#137f13] hover:text-white transition-all shadow-sm uppercase tracking-widest">
                      Flash Sale
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200">
                  <FaRecycle className="text-4xl text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">No surplus items listed currently.</div>
                </div>
              )}
            </div>
            
            <button className="w-full mt-8 py-5 bg-white/50 border-2 border-dashed border-gray-200 rounded-[28px] text-gray-400 text-xs font-black hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all uppercase tracking-widest">
              <span className="flex items-center justify-center gap-2"><FaLeaf /> New Sustainability Campaign</span>
            </button>
          </div>

          {/* Donation Hub & NGO Outreach (Premium Dark Card) */}
          <div className="bg-gradient-to-br from-[#1c2a1c] to-[#137f13] rounded-[40px] p-10 text-white shadow-[0_30px_60px_-15px_rgba(19,127,19,0.3)] border border-emerald-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ccff00] rounded-full mix-blend-overlay filter blur-[50px] opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#ccff00]">
                    <FaDonate className="text-lg" />
                 </div>
                 Donation Hub
              </h3>
              <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em] mb-8 ml-13">NGO Outreach Coordination</p>
              
              <div className="space-y-4 mb-10">
                  {[
                      { org: 'Food For All Lanka', type: 'NGO', impact: '240 meals' },
                      { org: 'Gampaha Community Aid', type: 'Non-profit', impact: '1.2 tons' },
                      { org: 'Healthy Schools Project', type: 'Government', impact: '850 students' }
                  ].map((ngo, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center text-lg shadow-inner">
                                  <FaDonate className="text-emerald-400" />
                              </div>
                              <div>
                                  <h5 className="text-sm font-black mb-1">{ngo.org}</h5>
                                  <p className="text-[9px] text-emerald-100/60 font-black tracking-widest uppercase">{ngo.type}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-[#ccff00] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest">
                                  {ngo.impact}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-8 text-center backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
                  <FaArrowUp className="text-[#ccff00] text-3xl mb-4 mx-auto relative z-10 animate-bounce" />
                  <h4 className="font-black text-white text-xl mb-2 tracking-tight relative z-10">Impact Grew +18%</h4>
                  <p className="text-emerald-100/80 text-[11px] leading-relaxed font-bold tracking-wide relative z-10">3,450 kg of food rescued this month through direct NGO donations.</p>
              </div>

              <button className="w-full py-5 bg-[#ccff00] text-[#1c2a1c] border-none rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] shadow-xl shadow-[#ccff00]/20 transition-all active:scale-95">
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
