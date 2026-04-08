import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, FaBook, FaPlusCircle, FaSearch, 
  FaFilter, FaChartLine, FaUsers, FaArrowUp, FaBell,
  FaFileAlt, FaEdit, FaTrashAlt
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';
import AddCourseModal from '../components/AddCourseModal';

const LMSManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
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
      console.error("Error fetching courses:", error);
      // Fallback dummy data if desired, but ideally we show what's in DB
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setCourseToEdit(course);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setCourseToEdit(null);
    setIsModalOpen(true);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Advanced': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/lms/courses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            toast.success('Course deleted');
            fetchCourses();
        }
    } catch (error) {
        toast.error('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f5] flex relative overflow-hidden font-sans">
      {/* Background glowing orbs for that premium glassmorphism feel */}
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
              placeholder="Search courses or instructor names..." 
              className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-2xl rounded-[30px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] focus:bg-white focus:ring-4 focus:ring-[#137f13]/10 transition-all font-bold text-gray-700 outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-14 h-14 bg-white/70 backdrop-blur-2xl border border-white rounded-[24px] text-gray-500 hover:text-[#137f13] hover:bg-white transition-all shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer group">
              <FaBell className="text-xl group-hover:scale-110 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="flex items-center gap-4 p-2 pr-6 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#137f13] to-emerald-400 rounded-[24px] flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                {user?.name?.substring(0, 2).toUpperCase() || 'EM'}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest leading-tight">Education Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content wrapper */}
        <div className="flex flex-col xl:flex-row gap-10">
          
          {/* Main Left Column */}
          <div className="flex-1 space-y-10">
            
            {/* Hero Panel (Premium Glass styling) */}
            <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                            <FaGraduationCap className="text-sm" /> LMS Academy Central
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">Learning <br />Management</h1>
                        <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                            Create, organize, and monitor agricultural courses seamlessly in your digital academy.
                        </p>
                    </div>

                    <button 
                        onClick={handleCreateNew}
                        className="group/btn relative flex items-center justify-center gap-3 px-10 py-6 bg-gradient-to-r from-[#137f13] to-[#1a9f1a] text-white rounded-[32px] font-black text-sm shadow-[0_20px_40px_-10px_rgba(19,127,19,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(19,127,19,0.5)] hover:-translate-y-1 transition-all uppercase tracking-widest overflow-hidden border border-emerald-400/30"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        <FaPlusCircle className="text-2xl relative z-10 text-[#ccff00]" /> 
                        <span className="relative z-10">Create Course</span>
                    </button>
                </div>
            </div>

            {/* Courses List Window */}
            <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 lg:p-10 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <span className="w-12 h-12 bg-gray-100 text-gray-600 rounded-[20px] flex items-center justify-center text-xl shadow-inner border border-white">
                            <FaBook />
                        </span>
                        Active Curriculum
                    </h3>
                </div>

                <div className="space-y-4">
                    {courses.length > 0 ? courses.map((course, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-white rounded-[32px] border border-gray-100 hover:border-[#137f13]/30 hover:shadow-[0_15px_40px_-15px_rgba(19,127,19,0.15)] hover:-translate-y-1 transition-all group duration-300">
                            <div className="flex items-center gap-6 flex-1 w-full">
                                <div className="w-24 h-24 bg-[#1c2a1c] rounded-3xl overflow-hidden flex items-center justify-center text-3xl shadow-md text-emerald-50 group-hover:scale-105 transition-transform duration-500">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaBook className="opacity-50" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-[#137f13] transition-colors">{course.title}</h4>
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-xl border uppercase tracking-widest ${getLevelColor(course.level)}`}>
                                            {course.level || 'Beginner'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-400">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg"><FaUsers /> {course.studentCount || 0} Enrolled</span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg"><FaChartLine className="text-emerald-500" /> {course.rating || 'N/A'} Avg</span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg"># {course.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto">
                                <button 
                                    onClick={() => handleEdit(course)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#137f13] hover:text-white transition-colors duration-300"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    onClick={() => handleDelete(course._id)}
                                    className="flex-1 md:flex-none px-6 py-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-gray-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <FaGraduationCap className="text-5xl text-gray-300" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-2">No Courses Yet</h4>
                            <p className="text-gray-400 font-bold text-sm">Start building your academy by adding a new course.</p>
                        </div>
                    )}
                </div>
            </div>

          </div>

          {/* Right Column - Premium Stats Dashboard */}
          <div className="w-full xl:w-[420px] flex flex-col gap-6">
            
            {/* Primary Stat Card */}
            <div className="bg-gradient-to-br from-[#1c2a1c] to-[#137f13] p-10 rounded-[40px] text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(19,127,19,0.3)] border border-emerald-800">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ccff00] rounded-full mix-blend-overlay filter blur-[50px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <p className="text-emerald-100/80 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                            <span className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#ccff00]">
                                <FaUsers className="text-lg" />
                            </span>
                            Total Enrolled
                        </p>
                        <span className="w-2 h-2 bg-[#ccff00] rounded-full shadow-[0_0_10px_#ccff00] animate-pulse mt-4"></span>
                    </div>
                    
                    <h2 className="text-7xl font-black tracking-tighter mb-8 leading-none">1.2<span className="text-4xl text-emerald-300">k</span></h2>
                    
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-xs font-black uppercase flex items-center gap-2 border border-white/10">
                            <FaArrowUp className="text-[#ccff00]" /> 15%
                        </span>
                        <span className="text-xs font-black text-emerald-300/80 uppercase tracking-widest">Growth</span>
                    </div>
                </div>
            </div>

            {/* Smaller Glass Stat Cards */}
            {[
                { label: 'Active Courses', value: courses.length, icon: <FaBook />, color: 'from-emerald-400 to-teal-500', trend: '+2' },
                { label: 'Completion Rate', value: '82%', icon: <FaChartLine />, color: 'from-blue-400 to-indigo-500', trend: '+4.2%' },
                { label: 'Certifications', value: '340', icon: <FaFileAlt />, color: 'from-amber-400 to-orange-500', trend: '+18' }
            ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-3xl p-6 rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex items-center justify-between group hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all cursor-default">
                    <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
                        </div>
                    </div>
                    <div className="h-full flex items-start">
                       <span className="text-[10px] font-black text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl uppercase border border-gray-100 group-hover:bg-[#137f13] group-hover:text-white transition-colors">{stat.trend}</span>
                    </div>
                </div>
            ))}

          </div>

        </div>
      </div>

      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchCourses} 
        courseToEdit={courseToEdit}
      />
    </div>
  );
};

export default LMSManagement;
