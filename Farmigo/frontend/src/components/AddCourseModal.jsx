import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash, FaGraduationCap, FaImage, FaLayerGroup, FaTags, FaAlignLeft } from 'react-icons/fa';
import { toast } from 'sonner';

const AddCourseModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sustainable Farming',
    level: 'Beginner',
    thumbnail: '',
    price: 'FREE',
    duration: '4h 30m',
    modules: [{ title: '', contentUrl: '', contentType: 'Video' }]
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Sustainable Farming', 'Digital Marketing', 'Financial Literacy', 'Agri-Tech', 'Agriculture', 'Technology', 'Business', 'Science'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  if (!isOpen) return null;

  const handleAddModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', contentUrl: '', contentType: 'Video' }]
    });
  };

  const handleRemoveModule = (index) => {
    const newModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: newModules });
  };

  const handleModuleChange = (index, field, value) => {
    const newModules = [...formData.modules];
    newModules[index][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/lms/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Course created successfully!');
        onRefresh();
        onClose();
        setFormData({
          title: '',
          description: '',
          category: 'Sustainable Farming',
          level: 'Beginner',
          thumbnail: '',
          price: 'FREE',
          duration: '4h 30m',
          modules: [{ title: '', contentUrl: '', contentType: 'Video' }]
        });
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to create course');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c2a1c]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col border border-white/20">
        {/* Header */}
        <div className="relative p-10 bg-gradient-to-br from-[#1c2a1c] to-[#0d140d] text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] text-2xl shadow-lg">
                        <FaGraduationCap />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">Assemble New Course</h2>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Design a premium learning experience</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                >
                    <FaTimes className="text-white/40 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <form id="courseForm" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <FaLayerGroup /> Course Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sustainable Organic Farming in 2024"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Price and Duration */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Price Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. FREE or Rs. 1500"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5h 20m"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <FaTags /> Category
                </label>
                <select
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <FaChartLine /> Course Level
                </label>
                <select
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm appearance-none"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Thumbnail */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <FaImage /> Thumbnail URL
                </label>
                <input
                  type="url"
                  placeholder="Paste image address (Unsplash recommended)..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#137f13]">
                    <FaAlignLeft /> Full Description
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe what students will learn in this course..."
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            {/* Modules Section */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ccff00] rounded-full"></span> Curriculum Modules
                    </h3>
                    <button
                        type="button"
                        onClick={handleAddModule}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-[#137f13] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#137f13] hover:text-white transition-all shadow-sm"
                    >
                        <FaPlus /> Add Module
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.modules.map((module, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-[32px] border border-transparent hover:border-emerald-100 transition-all space-y-4 relative group">
                            {formData.modules.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveModule(index)}
                                    className="absolute -top-2 -right-2 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="Module title (e.g. Introduction to Soil)"
                                    className="w-full px-5 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-bold text-gray-900 text-xs shadow-sm"
                                    value={module.title}
                                    onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Video/Article URL"
                                        className="flex-1 px-5 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-bold text-gray-900 text-xs shadow-sm"
                                        value={module.contentUrl}
                                        onChange={(e) => handleModuleChange(index, 'contentUrl', e.target.value)}
                                    />
                                    <select
                                        className="px-4 py-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all font-black text-gray-900 text-[10px] uppercase shadow-sm"
                                        value={module.contentType}
                                        onChange={(e) => handleModuleChange(index, 'contentType', e.target.value)}
                                    >
                                        <option value="Video">Video</option>
                                        <option value="Article">Article</option>
                                        <option value="PDF">PDF</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors"
            >
                Discard Changes
            </button>
            <button
                form="courseForm"
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-[#137f13] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_30px_rgba(19,127,19,0.3)] hover:scale-[1.05] transition-all disabled:opacity-50 flex items-center gap-3"
            >
                {loading ? 'Processing...' : 'Deploy Course'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
