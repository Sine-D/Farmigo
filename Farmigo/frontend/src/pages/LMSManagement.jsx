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
    <div className="min-h-screen bg-[#f4f7f6] flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 p-8 pt-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses or instructor names..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest">Education Manager</p>
              </div>
              <div className="w-12 h-12 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] font-black shadow-lg">
                {user?.name?.substring(0, 2).toUpperCase() || 'EM'}
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
                <FaGraduationCap className="text-2xl" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Learning Management</h1>
            </div>
            <p className="text-gray-500 font-medium max-w-lg">Create, manage and track farmer education programs through our integrated LMS platform.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-[#137f13] text-white rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(19,127,19,0.3)] hover:scale-[1.02] transition-all uppercase tracking-widest"
          >
            <FaPlusCircle /> Create New Course
          </button>
        </div>

        {/* LMS Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Total Enrolled', value: '1.2k', icon: <FaUsers />, color: 'bg-emerald-500', trend: '+15%' },
                { label: 'Courses Active', value: courses.length, icon: <FaBook />, color: 'bg-blue-500', trend: '+2' },
                { label: 'Completion Rate', value: '82%', icon: <FaChartLine />, color: 'bg-indigo-500', trend: '+4.2%' },
                { label: 'Certification Issued', value: '340', icon: <FaFileAlt />, color: 'bg-amber-500', trend: '+18' }
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

        {/* Courses List */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase text-sm font-black">
                    <FaBook className="text-[#137f13]" /> Active Curriculum
                </h3>
            </div>

            <div className="space-y-4">
                {courses.length > 0 ? courses.map((course, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-[28px] border border-transparent hover:border-[#137f13]/20 hover:bg-emerald-50/10 transition-all group">
                        <div className="flex items-center gap-6 flex-1 w-full">
                            <div className="w-20 h-20 bg-[#1c2a1c] rounded-3xl overflow-hidden flex items-center justify-center text-3xl shadow-sm text-emerald-50 group-hover:scale-105 transition-transform">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <FaBook />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-black text-gray-900 tracking-tight group-hover:text-[#137f13] transition-colors uppercase text-sm">{course.title}</h4>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${getLevelColor(course.level)}`}>
                                        {course.level || 'Beginner'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaUsers className="text-[10px]" /> {course.studentCount || 0} Enrolled</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest"><FaChartLine className="text-[10px] text-emerald-400" /> {course.rating || 0} Avg Rating</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest text-[#137f13]"># {course.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all shadow-sm">
                                <FaEdit /> Edit Course
                            </button>
                            <button 
                                onClick={() => handleDelete(course._id)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                        <FaGraduationCap className="text-4xl text-gray-300 mb-4 mx-auto" />
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No courses available. Start by creating one.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchCourses} 
      />
    </div>
  );
};

export default LMSManagement;
