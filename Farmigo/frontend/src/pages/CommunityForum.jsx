import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaComments, FaHeart, FaPlus, 
  FaSearch, FaFilter, FaArrowRight, FaClock,
  FaRegLightbulb, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'sonner';

const CommunityForum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
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
            setPosts([
                { _id: '1', title: 'Sustainable Irrigation for Sri Lankan Paddy Fields', user: { name: 'Saman Jayasinghe' }, category: 'Farming Tips', likes: 124, comments: 18, date: '2 hours ago' },
                { _id: '2', title: 'Organic Fertilizer Secrets for Better Harvest', user: { name: 'Dulani Perera' }, category: 'Organic', likes: 89, comments: 24, date: '5 hours ago' },
                { _id: '3', title: 'Selling Direct to Consumers: My Experience', user: { name: 'Ruwan Fernando' }, category: 'Business', likes: 210, comments: 45, date: '1 day ago' },
                { _id: '4', title: 'Best Pest Control for Beetroot Plants?', user: { name: 'Nilmini' }, category: 'Q&A', likes: 45, comments: 56, date: '2 days ago' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Farming Tips', 'Organic', 'Business', 'Q&A'];

    const filteredPosts = posts.filter(p => {
        const matchesTab = activeTab === 'All' || p.category === activeTab;
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[#f4fcf4]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#137f13]/5 rounded-bl-[200px] -z-0"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-4 py-1.5 bg-[#137f13]/10 text-[#137f13] rounded-full text-sm font-black uppercase tracking-widest">Village Connect</span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-500 font-bold">1.2k Active Farmers</span>
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">Explore the <span className="text-[#137f13]">Community</span> Hub.</h1>
                        <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">Join thousands of farmers across Sri Lanka to share knowledge, solve problems, and grow together in a sustainable ecosystem.</p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-1 group w-full">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137f13] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search topics, questions or farmers..." 
                                    className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border-none shadow-xl shadow-emerald-900/5 focus:ring-2 focus:ring-[#137f13]/20 font-bold transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="px-10 py-5 bg-[#137f13] text-white rounded-3xl font-black shadow-xl shadow-[#137f13]/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-3">
                                <FaPlus /> Start Topic
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Forum Content */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left: Feed */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setActiveTab(cat)}
                                        className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
                                            activeTab === cat 
                                            ? 'bg-gray-900 text-white shadow-lg' 
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {filteredPosts.map((post) => (
                                <div key={post._id} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#137f13]/20 hover:shadow-2xl transition-all relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-[#f4fcf4] text-[#137f13] rounded-2xl flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {post.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#137f13] transition-colors">{post.title}</h4>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Started by <span className="text-gray-900">{post.user.name}</span> • {post.date}</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                            {post.category}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-6 border-l-2 border-transparent group-hover:border-[#137f13] transition-all pl-2">
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-2 group/stat">
                                                <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center transition-colors group-hover/stat:bg-pink-500 group-hover/stat:text-white">
                                                    <FaHeart className="text-sm" />
                                                </div>
                                                <span className="font-black text-gray-900">{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center transition-colors group-hover/stat:bg-blue-500 group-hover/stat:text-white">
                                                    <FaComments className="text-sm" />
                                                </div>
                                                <span className="font-black text-gray-900">{post.comments}</span>
                                            </div>
                                        </div>
                                        
                                        <button className="flex items-center gap-2 text-sm font-black text-[#137f13] hover:translate-x-2 transition-transform">
                                            Join Discussion <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar: Topics & Stats */}
                    <div className="w-full lg:w-96 space-y-12">
                        <div className="bg-[#1c2a1c] p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full blur-3xl"></div>
                            <h3 className="text-2xl font-black mb-8 relative z-10 tracking-tight">Expert Corner</h3>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { title: 'Market Price Forecast', icon: <FaRegLightbulb className="text-[#ccff00]" /> },
                                    { title: 'New Export Policies', icon: <FaCheckCircle className="text-emerald-400" /> },
                                    { title: 'Sustainable Fertilizer Subsidy', icon: <FaClock className="text-blue-400" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <span className="font-extrabold text-sm">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-[#ccff00] text-[#1c2a1c] rounded-3xl font-black text-sm hover:scale-[1.02] shadow-xl shadow-emerald-500/10 transition-all">
                                Ask an Expert
                            </button>
                        </div>

                        {/* Top Contributors */}
                        <div className="bg-gray-50 p-10 rounded-[50px] border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight uppercase tracking-[0.2em] text-sm font-black">Top Contributors</h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Saman J.', score: '4.8k', color: 'bg-emerald-500' },
                                    { name: 'Dulani P.', score: '3.2k', color: 'bg-indigo-500' },
                                    { name: 'Ruwan F.', score: '2.9k', color: 'bg-amber-500' }
                                ].map((author, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${author.color} text-white rounded-2xl flex items-center justify-center font-black shadow-lg`}>
                                                {author.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm tracking-tight">{author.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Expert Farmer</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-[#137f13] shadow-sm">
                                            {author.score} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityForum;
