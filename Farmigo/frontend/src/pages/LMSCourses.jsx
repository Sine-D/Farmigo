import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, FaBook, FaSearch, FaStar, 
  FaPlayCircle, FaCheckCircle, FaUsers, FaArrowRight,
  FaClock, FaChartLine, FaShieldAlt, FaFilter, FaBell
} from 'react-icons/fa';
import { toast } from 'sonner';

const LMSCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Using a fallback for the URL if env is not defined
                const response = await fetch('http://localhost:5001/api/lms/courses');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (error) {
                console.error("LMS Fetch Error:", error);
                // Premium Dummy Data
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

        fetchCourses();
    }, []);

    const filters = ['All', 'Agriculture', 'Technology', 'Business', 'Organic'];

    const filteredCourses = courses?.filter(c => {
        const matchesFilter = activeFilter === 'All' || c.category === activeFilter;
        const matchesSearch = c.title ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesFilter && matchesSearch;
    }) || [];

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
                toast.success("Enrolled successfully!");
            }
        } catch (error) {
            toast.error("Enrollment failed.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-12 h-12 border-4 border-[#137f13] border-t-transparent rounded-full shadow-lg" />
                    <p className="text-[#137f13] font-black uppercase tracking-widest text-xs">Initializing Academy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero Section - Explicit Dark Background */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#1c2a1c]">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 rounded-bl-[400px] blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 text-white">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-5 py-2 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">Farmigo Academy</span>
                            <span className="w-2 h-2 bg-[#ccff00] rounded-full shadow-[0_0_15px_#ccff00]"></span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-10 leading-[1.1]">
                            Master Your Trade at <br/>
                            <span className="text-[#ccff00]">Farmigo</span> Academy.
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl leading-relaxed">
                            Professional guidance for modern agriculture. Learn sustainable practices and market strategies from industry experts.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-2xl">
                            <div className="relative flex-1 group w-full">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ccff00] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search courses..." 
                                    className="w-full pl-16 pr-8 py-5 bg-white/10 border border-white/10 rounded-3xl backdrop-blur-3xl focus:ring-4 focus:ring-emerald-500/20 font-bold transition-all text-white placeholder-white/40"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="px-12 py-5 bg-[#ccff00] text-[#1c2a1c] rounded-3xl font-black shadow-2xl hover:scale-[1.03] transition-all active:scale-95 text-sm uppercase tracking-widest">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Content */}
            <div className="container mx-auto px-6 py-20">
                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="flex flex-wrap gap-3">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeFilter === f 
                                    ? 'bg-[#137f13] text-white shadow-xl shadow-emerald-900/20' 
                                    : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 shadow-sm'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCourses.map((course) => (
                            <div key={course._id} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all flex flex-col h-full shadow-sm">
                                <div className="relative h-60 bg-[#0d1a0d] flex items-center justify-center overflow-hidden">
                                    <FaBook className="text-5xl text-[#ccff00] opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-1.5 bg-[#ccff00] text-[#1c2a1c] rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#137f13]">#{course.category}</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <FaStar className="text-amber-400" /> {course.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 group-hover:text-[#137f13] transition-colors leading-tight uppercase">
                                        {course.title}
                                    </h3>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between py-6 border-t border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="text-emerald-500" /> {course.duration}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaUsers className="text-blue-500" /> {course.students}
                                                </div>
                                            </div>
                                            <span className="text-gray-900 font-extrabold">{course.price}</span>
                                        </div>

                                        <button 
                                            onClick={() => enrollInCourse(course._id)}
                                            className="w-full py-5 bg-[#137f13] text-white rounded-3xl font-black text-[10px] hover:bg-[#1c2a1c] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10 active:scale-95"
                                        >
                                            Enroll Now <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[60px] bg-white">
                        <FaGraduationCap className="text-7xl text-gray-200 mb-8 mx-auto" />
                        <h4 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">No courses found</h4>
                        <button 
                            onClick={() => {setActiveFilter('All'); setSearchTerm('');}}
                            className="mt-6 px-10 py-4 bg-[#137f13] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Trusted Badges */}
            <div className="bg-[#1c2a1c] py-24 text-center">
                <div className="container mx-auto px-6">
                    <FaShieldAlt className="text-[#ccff00] text-4xl mb-6 mx-auto opacity-50" />
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Certified Standards</h2>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-12">Authorized by National Agricultural Institutes</p>
                    <div className="flex flex-wrap justify-center gap-12 sm:gap-24 opacity-60">
                        {[
                            { label: 'Courses Issued', value: '3.4k+' },
                            { label: 'National Rank', value: '#1' },
                            { label: 'Expert Tutors', value: '120+' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-3xl font-black text-[#ccff00] mb-1">{stat.value}</h3>
                                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LMSCourses;
