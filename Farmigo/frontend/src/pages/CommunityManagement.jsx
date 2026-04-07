import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaComments, FaFlag, FaTrashAlt, 
  FaSearch, FaFilter, FaChartBar, FaHeart,
  FaShareAlt, FaBell, FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';

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
      const response = await fetch('http://localhost:5001/api/community/forum');
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
      const response = await fetch(`http://localhost:5001/api/community/forum/${id}`, {
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
    <div className="min-h-screen bg-[#f4f7f6] flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 p-8 pt-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search forum topics or authors..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ccff00] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest">Community Mod</p>
              </div>
              <div className="w-12 h-12 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] font-black shadow-lg">
                CM
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                <FaUsers className="text-2xl" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Community Management</h1>
            </div>
            <p className="text-gray-500 font-medium max-w-lg">Oversee community interactions, moderate forum content, and track platform engagement.</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 uppercase tracking-widest text-[9px] font-black">
              {['All', 'Organic Farming', 'Infrastructure', 'Marketplace'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-xl transition-all ${filter === cat ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Active Topics', value: posts.length, icon: <FaComments />, color: 'bg-blue-500', trend: '+12' },
                { label: 'Forum Likes', value: '4.2k', icon: <FaHeart />, color: 'bg-pink-500', trend: '+140' },
                { label: 'Flags/Reports', value: '2', icon: <FaFlag />, color: 'bg-red-500', trend: '-1' },
                { label: 'Global Rank', value: '#12', icon: <FaChartBar />, color: 'bg-amber-500', trend: 'Trending' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                            {stat.icon}
                        </div>
                        <span className="text-[10px] font-black text-[#137f13] bg-emerald-50 px-2.5 py-1 rounded-full uppercase">{stat.trend}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                </div>
            ))}
        </div>

        {/* Forum List */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <FaShieldAlt className="text-indigo-500" /> Moderation Queue
                </h3>
            </div>

            <div className="space-y-4">
                {filteredPosts.map((post, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-[28px] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-6 flex-1 w-full">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform font-black text-indigo-600">
                                {post.user?.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-sm">{post.title}</h4>
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-tighter border border-indigo-100">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaUsers className="text-[10px]" /> By {post.user?.name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaHeart className="text-[10px] text-pink-400" /> {post.likes} Likes</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaComments className="text-[10px] text-blue-400" /> {post.comments} Comments</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                                View Post
                            </button>
                            <button 
                                onClick={() => deletePost(post._id)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
