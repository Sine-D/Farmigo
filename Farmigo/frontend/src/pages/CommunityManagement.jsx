import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaComments, FaFlag, FaTrashAlt, 
  FaSearch, FaFilter, FaChartBar, FaHeart,
  FaShareAlt, FaBell, FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';
import { API_BASE_URL } from '../utils/api';


const CommunityManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/forum`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    } catch (error) {
      // Dummy data for demo
      setPosts([
        { _id: '1', title: 'Best Organic Fertilizers?', user: { name: 'Sunil Silva' }, category: 'Organic Farming', likes: 24, comments: 8, createdAt: new Date() },
        { _id: '2', title: 'Monsoon Protection Tips', user: { name: 'Amara P' }, category: 'Crop Protection', likes: 45, comments: 12, createdAt: new Date() },
        { _id: '3', title: 'Selling Wholesale to Supermarkets', user: { name: 'Nishantha' }, category: 'Marketplace', likes: 89, comments: 34, createdAt: new Date() },
        { _id: '4', title: 'Tractor Repair in Gampaha', user: { name: 'Ravi J' }, category: 'Infrastructure', likes: 12, comments: 2, createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to remove this post?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/forum/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Post removed successfully");
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (p.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              placeholder="Search forum topics or authors..." 
              className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-2xl rounded-[30px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] focus:bg-white focus:ring-4 focus:ring-[#137f13]/10 transition-all font-bold text-gray-700 outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-14 h-14 bg-white/70 backdrop-blur-2xl border border-white rounded-[24px] text-gray-500 hover:text-[#137f13] hover:bg-white transition-all shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer group">
              <FaBell className="text-xl group-hover:scale-110 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#ccff00] rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="flex items-center gap-4 p-2 pr-6 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#137f13] to-emerald-400 rounded-[24px] flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                {user?.name?.substring(0, 2).toUpperCase() || 'CM'}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest leading-tight">Community Mod</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Panel (Premium Glass styling) */}
        <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group mb-10">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 text-indigo-700 border border-indigo-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                        <FaUsers className="text-sm" /> Community Portal
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">Community <br />Management</h1>
                    <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                        Oversee community interactions, moderate forum content, and track platform engagement.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/60 p-2 rounded-3xl shadow-sm border border-white/80 uppercase tracking-widest text-[9px] font-black">
                  {['All', 'Organic Farming', 'Infrastructure', 'Marketplace'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-4 rounded-2xl transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:bg-white'}`}
                      >
                          {cat}
                      </button>
                  ))}
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
                { label: 'Active Topics', value: posts.length, icon: <FaComments />, color: 'bg-gradient-to-br from-blue-400 to-indigo-600', trend: '+12' },
                { label: 'Forum Likes', value: '4.2k', icon: <FaHeart />, color: 'bg-gradient-to-br from-pink-400 to-rose-600', trend: '+140' },
                { label: 'Flags/Reports', value: '2', icon: <FaFlag />, color: 'bg-gradient-to-br from-red-400 to-red-600', trend: '-1' },
                { label: 'Global Rank', value: '#12', icon: <FaChartBar />, color: 'bg-gradient-to-br from-amber-400 to-orange-500', trend: 'Trending' }
            ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-3xl p-6 rounded-[32px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] group hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all cursor-default">
                    <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 ${stat.color} text-white rounded-[24px] flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                            {stat.icon}
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl uppercase">{stat.trend}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
                </div>
            ))}
        </div>

        {/* Forum List */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 lg:p-10 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                    <span className="w-12 h-12 bg-white text-indigo-600 rounded-[20px] flex items-center justify-center text-xl shadow-inner border border-indigo-50">
                        <FaShieldAlt />
                    </span>
                    Moderation Queue
                </h3>
            </div>

            <div className="space-y-4">
                {filteredPosts.map((post, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-white rounded-[32px] border border-gray-100 hover:border-indigo-200 hover:shadow-[0_15px_40px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all group duration-300">
                        <div className="flex items-center gap-6 flex-1 w-full">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-3xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform font-black text-indigo-600">
                                {post.user?.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{post.title}</h4>
                                    <span className="text-[9px] font-black px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 uppercase tracking-widest border border-indigo-100">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg"><FaUsers className="text-[10px]" /> By {post.user?.name}</span>
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg"><FaHeart className="text-[10px]" /> {post.likes} Likes</span>
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg"><FaComments className="text-[10px]" /> {post.comments} Comments</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                View Post
                            </button>
                            <button 
                                onClick={() => deletePost(post._id)}
                                className="flex-1 md:flex-none p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                title="Delete/Hide Post"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityManagement;
