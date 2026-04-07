import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, FaBook, FaSearch, FaStar, 
  FaPlayCircle, FaCheckCircle, FaUsers, FaArrowRight,
  FaClock, FaChartLine, FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'sonner';

const LMSCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/lms/courses');
            const data = await response.json();
            if (response.ok) {
                setCourses(data);
            }
        } catch (error) {
            setCourses([
                { _id: '1', title: 'Sustainable Rice Farming in SL', instructor: 'Dr. Wickramasinghe', category: 'Agriculture', level: 'Beginner', students: 1250, rating: 4.8, price: 'FREE', duration: '4h 30m' },
                { _id: '2', title: 'Modern Irrigation & Water Management', instructor: 'Prof. Amara', category: 'Technology', level: 'Intermediate', students: 840, rating: 4.5, price: 'FREE', duration: '6h 15m' },
                { _id: '3', title: 'Agri-Business: Export Compliance', instructor: 'Dr. Nilanthi', category: 'Business', level: 'Advanced', students: 450, rating: 4.9, price: 'PAID', duration: '12h 00m' },
                { _id: '4', title: 'Organic Pest Control Strategies', instructor: 'Anura J.', category: 'Organic', level: 'Intermediate', students: 1100, rating: 4.7, price: 'FREE', duration: '3h 45m' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filters = ['All', 'Agriculture', 'Technology', 'Business', 'Organic'];

    const filteredCourses = courses.filter(c => {
        const matchesFilter = activeFilter === 'All' || c.category === activeFilter;
        return matchesFilter && c.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const enrollInCourse = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to enroll in a course.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5001/api/lms/courses/${id}/enroll`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success("Enrolled successfully! Redirecting...");
                // Redirect to learning portal logic
            }
        } catch (error) {
            toast.error("Enrollment failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#137f13] to-[#0d1a0d]">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 rounded-bl-[400px] blur-[150px] -z-0"></div>
                <div className="container mx-auto px-6 relative z-10 text-white">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-5 py-2 bg-white/10 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest backdrop-blur-xl">Farmigo Academy</span>
                            <span className="w-2 h-2 bg-[#ccff00] rounded-full shadow-[0_0_15px_#ccff00]"></span>
                            <span className="text-white/60 font-bold">12 Active Disciplines</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tight mb-10 leading-[0.9]">Empowering Farmers with <span className="text-[#ccff00]">Real-World</span> Knowledge.</h1>
                        <p className="text-xl text-white/40 font-medium mb-12 max-w-2xl leading-relaxed">Master the latest agricultural technologies, business strategies, and sustainable practices through our expert-led vocational training.</p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative flex-1 group w-full">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ccff00] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="What do you want to learn today?" 
                                    className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl focus:ring-4 focus:ring-emerald-500/20 font-bold transition-all text-white placeholder-white/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="px-12 py-6 bg-[#ccff00] text-[#1c2a1c] rounded-3xl font-black shadow-2xl shadow-[#ccff00]/20 hover:scale-[1.03] transition-all active:scale-95 text-lg">
                                Browse All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto px-6 py-24">
                <div className="flex items-center justify-between mb-16">
                    <div className="flex flex-wrap gap-4">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeFilter === f 
                                    ? 'bg-[#137f13] text-white shadow-xl shadow-emerald-700/20' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-bold">
                        <FaFilter className="text-xs" />
                        <span className="text-sm">Sorting: Latest First</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="group bg-white rounded-[45px] overflow-hidden border border-gray-100 hover:border-emerald-500/20 hover:shadow-2xl transition-all relative flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden bg-[#0d1a0d] flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0d1a0d]/80 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[35px] flex items-center justify-center text-4xl text-[#ccff00] shadow-2xl group-hover:scale-110 transition-transform">
                                    <FaBook />
                                </div>
                                <div className="absolute bottom-6 left-8 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all">
                                    <span className="px-3 py-1 bg-[#ccff00] text-[#1c2a1c] rounded-lg text-[9px] font-black uppercase tracking-widest">
                                        {course.level}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#137f13]"># {course.category}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#137f13] rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        <FaStar className="text-amber-400" /> {course.rating}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3 group-hover:text-[#137f13] transition-colors line-clamp-2 uppercase text-sm leading-tight">{course.title}</h3>
                                <p className="text-xs text-gray-500 font-bold mb-8 uppercase tracking-widest">Instructor: <span className="text-gray-900">{course.instructor}</span></p>
                                
                                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between text-xs font-black text-gray-400">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1.5 group/icon">
                                            <FaClock className="group-hover/icon:text-[#137f13] transition-colors" /> {course.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5 group/icon">
                                            <FaUsers className="group-hover/icon:text-blue-500 transition-colors" /> {course.students}
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-black ${course.price === 'FREE' ? 'text-emerald-600' : 'text-gray-900'}`}>{course.price}</span>
                                </div>

                                <button 
                                    onClick={() => enrollInCourse(course._id)}
                                    className="w-full mt-8 py-5 bg-[#137f13] text-white rounded-3xl font-black text-xs hover:bg-[#1c2a1c] shadow-lg shadow-emerald-500/10 transition-all uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {course.price === 'FREE' ? 'Enroll For Free' : 'Secure Admission'} <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[60px] bg-gray-50/50">
                        <FaGraduationCap className="text-7xl text-gray-200 mb-8 mx-auto" />
                        <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">No courses found matching your search.</h4>
                        <p className="text-gray-500 font-bold mb-10 tracking-tight">Try adjusting your filters or search terms for better results.</p>
                        <button 
                            onClick={() => {setActiveFilter('All'); setSearchTerm('');}}
                            className="px-10 py-4 bg-white border border-gray-100 rounded-3xl font-black text-sm text-[#137f13] shadow-xl shadow-emerald-900/5 hover:scale-105 transition-all"
                        >
                            Reset Global Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Achievement / Trust section */}
            <div className="bg-[#1c2a1c] py-32 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="grid grid-cols-12 h-full">{[...Array(12)].map((_, i) => <div key={i} className="border-r border-white h-full"></div>)}</div>
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <FaShieldAlt className="text-[#ccff00] text-5xl mb-8 mx-auto" />
                    <h2 className="text-5xl font-black tracking-tight mb-8">Certified Vocational Standards</h2>
                    <p className="text-white/40 text-lg font-bold max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-widest text-sm">All courses are quality-assured by the National Institute of Agriculture in partnership with Farmigo.</p>
                    
                    <div className="flex flex-wrap justify-center gap-16">
                        {[
                            { label: 'Courses Issued', value: '3,450+' },
                            { label: 'National Rank', value: '#1' },
                            { label: 'Trusted Schools', value: '45' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-4xl font-black text-[#ccff00] mb-2">{stat.value}</h3>
                                <p className="text-xs text-white/40 font-black uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LMSCourses;
