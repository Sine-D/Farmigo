import React, { useState, useEffect } from 'react';
import {
    FaGraduationCap, FaBook, FaSearch, FaStar,
    FaPlayCircle, FaCheckCircle, FaUsers, FaArrowRight,
    FaClock, FaChartLine, FaShieldAlt, FaFilter, FaBell, FaTimes
} from 'react-icons/fa';
import { toast } from 'sonner';

const LMSCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
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

    const getEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
    };

    const enrollInCourse = async (course) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to enroll in a course.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5001/api/lms/courses/${course._id}/enroll`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok || (data.message && data.message.toLowerCase().includes('already enrolled'))) {
                if (response.ok) toast.success("Enrolled successfully!");
                if (course.modules && course.modules.length > 0 && course.modules[0].contentUrl) {
                    setSelectedVideo(getEmbedUrl(course.modules[0].contentUrl));
                    setIsVideoModalOpen(true);
                } else {
                    toast.info("Course content is not available yet.");
                }
            } else {
                toast.error(data.message || "Enrollment failed.");
            }
        } catch (error) {
            toast.error("Error connecting to academy.");
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
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div key={course._id} className="group bg-gray-100 rounded-3xl p-4 border border-gray-100 hover:border-[#137f13]/30 hover:shadow-[0_20px_40px_-15px_rgba(19,127,19,0.15)] transition-all flex flex-col h-full relative cursor-pointer">
                                <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-[#f4f7f6] flex items-center justify-center">
                                            <FaBook className="text-5xl text-gray-300 group-hover:scale-110 group-hover:text-[#137f13] transition-all duration-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-[#ccff00] rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/10">
                                            {course.level || 'Beginner'}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" onClick={() => enrollInCourse(course)}>
                                        <div className="w-16 h-16 bg-[#ccff00] rounded-full flex items-center justify-center text-[#1c2a1c] shadow-xl hover:scale-110 transition-transform cursor-pointer pl-1">
                                            <FaPlayCircle className="text-3xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#137f13]">#{course.category}</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#137f13]/5 text-[#137f13] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <FaStar className="text-amber-400 text-sm" /> {course.rating || '5.0'}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-[#137f13] transition-colors leading-snug">
                                        {course.title}
                                    </h3>

                                    <div className="mt-auto space-y-5">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-5">
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="text-emerald-500 text-sm" /> {course.duration || '0h 00m'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaUsers className="text-blue-500 text-sm" /> {course.studentCount || course.students || 0}
                                                </div>
                                            </div>
                                            <span className="text-gray-900 font-extrabold text-sm">{course.price || 'FREE'}</span>
                                        </div>

                                        <button
                                            onClick={() => enrollInCourse(course)}
                                            className="w-full py-4 bg-[#137f13] text-white rounded-2xl font-black text-xs transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 shadow-[0_10px_20px_rgba(19,127,19,0.2)] hover:bg-[#1c2a1c] cursor-pointer"
                                        >
                                            <FaPlayCircle className="text-lg" /> Watch Course
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
                            onClick={() => { setActiveFilter('All'); setSearchTerm(''); }}
                            className="mt-6 px-10 py-4 bg-[#137f13] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
            {/* Video Modal */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d140d]/90 backdrop-blur-sm animate-in fade-in duration-300 p-4 sm:p-6" onClick={() => setIsVideoModalOpen(false)}>
                    <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
                        >
                            <FaTimes />
                        </button>
                        {selectedVideo ? (
                            <iframe
                                src={selectedVideo}
                                title="Course Video"
                                className="w-full h-full border-none"
                                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                                <FaPlayCircle className="text-6xl mb-4 opacity-50" />
                                <p className="font-bold tracking-widest uppercase text-sm">Video not available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LMSCourses;
