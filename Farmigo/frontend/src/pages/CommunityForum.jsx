import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaComments, FaHeart, FaPlus, 
  FaSearch, FaFilter, FaArrowRight, FaClock,
  FaRegLightbulb, FaCheckCircle, FaBell
} from 'react-icons/fa';
import { toast } from 'sonner';

const CommunityForum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/community/forum');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    throw new Error('Fetch failed');
                }
            } catch (error) {
                console.error("Community Fetch Error:", error);
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

        fetchPosts();
    }, []);

    const categories = ['All', 'Farming Tips', 'Organic', 'Business', 'Q&A'];

    const filteredPosts = posts?.filter(p => {
        const matchesTab = activeTab === 'All' || p.category === activeTab;
        const titleMatch = p.title ? p.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesTab && titleMatch;
    }) || [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="animate-spin w-12 h-12 border-4 border-[#137f13] border-t-transparent rounded-full shadow-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-[#f4fcf4]">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-4 py-1 bg-[#137f13]/10 text-[#137f13] rounded-full text-[10px] font-black uppercase tracking-widest">Village Connect</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">
                            Explore the <br/><span className="text-[#137f13]">Community</span> Hub.
                        </h1>
                        <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-xl">
                            Knowledge sharing for the next generation of Sri Lankan farmers.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-1 group w-full max-w-xl">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search topics..." 
                                    className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border-none shadow-xl shadow-emerald-900/5 focus:ring-4 focus:ring-[#137f13]/10 font-bold transition-all placeholder-gray-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-12 flex-wrap">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === cat 
                                        ? 'bg-gray-900 text-white shadow-lg' 
                                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 hover:text-gray-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-8">
                            {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                                <div key={post._id} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#137f13]/20 hover:shadow-2xl transition-all shadow-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-[#f4fcf4] text-[#137f13] rounded-2xl flex items-center justify-center text-xl font-black shadow-inner uppercase">
                                                {post.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#137f13] transition-colors uppercase tracking-tight">{post.title}</h4>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">By <span className="text-gray-900">{post.user.name}</span> • {post.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-2 group/stat">
                                                <FaHeart className="text-pink-500 text-xs" />
                                                <span className="text-xs font-black text-gray-900">{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <FaComments className="text-blue-500 text-xs" />
                                                <span className="text-xs font-black text-gray-900">{post.comments}</span>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 text-xs font-black text-[#137f13] hover:translate-x-2 transition-transform uppercase tracking-widest">
                                            Enter Discussion <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 opacity-50 uppercase text-[10px] font-black tracking-widest">No Topics Found</div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-96 space-y-12">
                        <div className="bg-[#1c2a1c] p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                            <h3 className="text-xl font-black mb-6 relative z-10 tracking-tight uppercase">Expert Advice</h3>
                            <div className="space-y-4 relative z-10">
                                {[
                                    { title: 'Market Trends', time: 'Hot' },
                                    { title: 'Drought Resilience', time: 'New' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                        <span className="font-extrabold text-xs uppercase tracking-tight">{item.title}</span>
                                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">{item.time}</span>
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
