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

    const filters = ['All', 'Sustainable Farming', 'Digital Marketing', 'Financial Literacy', 'Agri-Tech', 'Agriculture', 'Technology', 'Business', 'Science'];

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
            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-28 flex items-center justify-center overflow-hidden bg-[#0d140d]">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] bg-[#137f13] rounded-full mix-blend-screen filter blur-[150px] opacity-40"></div>
                <div className="absolute top-[10%] -right-[10%] w-[40%] h-[50%] bg-[#ccff00] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-[#0f5c0f] rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-white/10 transition-all cursor-pointer group">
                            <span className="w-2.5 h-2.5 bg-[#ccff00] rounded-full shadow-[0_0_12px_#ccff00] animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">Farmigo Professional Academy</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl">
                            Master Your Trade <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#137f13] filter drop-shadow-lg">Empower</span> Your Future.
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-2xl text-white/60 font-medium mb-14 max-w-3xl mx-auto leading-relaxed">
                            Access world-class agricultural education. Learn sustainable practices, digital marketing, and advanced agri-tech from verified industry leaders.
                        </p>
                        

                        
                        {/* Trust indicators */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <FaUsers className="text-xl text-[#ccff00]" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-black text-xl leading-none mb-1">10k+</h4>
                                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Active Students</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <FaShieldAlt className="text-xl text-[#ccff00]" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-black text-xl leading-none mb-1">Certified</h4>
                                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Expert Instructors</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <FaCheckCircle className="text-xl text-[#ccff00]" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-black text-xl leading-none mb-1">Lifetime</h4>
                                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Course Access</p>
                                </div>
                            </div>
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
                                <div className="relative h-60 bg-[#0d1a0d] overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaBook className="text-5xl text-[#ccff00] opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-1.5 bg-[#ccff00] text-[#1c2a1c] rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest">
                                            {course.level || 'Beginner'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#137f13]">#{course.category}</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <FaStar className="text-amber-400" /> {course.rating || 0}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 group-hover:text-[#137f13] transition-colors leading-tight uppercase">
                                        {course.title}
                                    </h3>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between py-6 border-t border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="text-emerald-500" /> {course.duration || '0h 00m'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaUsers className="text-blue-500" /> {course.studentCount || 0}
                                                </div>
                                            </div>
                                            <span className="text-gray-900 font-extrabold">{course.price || 'FREE'}</span>
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

        </div>
    );
};

export default LMSCourses;
