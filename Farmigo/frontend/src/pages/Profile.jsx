import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaShieldAlt, FaSave, FaTractor, FaArrowLeft } from 'react-icons/fa';
import { apiGet, apiPut } from '../utils/api';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        location: '',
        whatsappOptIn: false,
        farmDetails: {
            farmName: '',
            size: '',
            produceTypes: []
        }
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiGet('/users/profile');
                setUser(data);
                setFormData({
                    name: data.name || '',
                    phoneNumber: data.phoneNumber || '',
                    location: data.location || '',
                    whatsappOptIn: data.whatsappOptIn || false,
                    farmDetails: data.farmDetails || { farmName: '', size: '', produceTypes: [] }
                });
            } catch (err) {
                console.error(err);
                setMessage({ type: 'error', text: 'Could not load profile details.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('farm.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                farmDetails: {
                    ...prev.farmDetails,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedUser = await apiPut('/users/profile', formData);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Sync storage
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Redirect after brief delay
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
            <div className="w-10 h-10 border-4 border-[#137f13] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[120px] pb-20 px-4 sm:px-8">
            <div className="max-w-[800px] mx-auto">
                
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-[#137f13] mb-8 font-bold transition-colors">
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1c2a1c] to-[#137f13] p-10 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-[#ccff00] rounded-3xl flex items-center justify-center text-[#1c2a1c] text-3xl shadow-xl">
                                <FaUser />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black mb-1">Account Profile</h1>
                                <p className="text-white/60 font-medium">{user.email} (Email cannot be changed)</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        
                        {message.text && (
                            <div className={`p-4 rounded-2xl font-black text-sm uppercase tracking-widest border ${
                                message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-[#ccff00] transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 rotate-90" />
                                    <input 
                                        type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                                        className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-[#ccff00] transition-colors"
                                        placeholder="+94 ..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Business Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input 
                                        type="text" name="location" value={formData.location} onChange={handleChange} required
                                        className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold focus:border-[#ccff00] transition-colors"
                                        placeholder="City, District"
                                    />
                                </div>
                            </div>
                        </div>

                        {user.role === 'Farmer' && (
                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-[#137f13]">
                                    <FaTractor />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Farm Infrastructure Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input 
                                        type="text" name="farm.farmName" value={formData.farmDetails.farmName} onChange={handleChange} required
                                        className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#ccff00] transition-colors"
                                        placeholder="Farm / Business Name"
                                    />
                                    <input 
                                        type="text" name="farm.size" value={formData.farmDetails.size} onChange={handleChange}
                                        className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#ccff00] transition-colors"
                                        placeholder="Total Acreage (optional)"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-[#f0fdf4] p-6 rounded-[28px] border border-[#137f13]/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#137f13] text-xl shadow-sm">
                                    <FaWhatsapp />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-sm">WhatsApp Notifications</h4>
                                    <p className="text-gray-400 text-[11px] font-bold">Receive live logistics and trade alerts.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="sr-only peer" />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#137f13]"></div>
                            </label>
                        </div>

                        <button 
                            type="submit" disabled={saving}
                            className="w-full bg-[#ccff00] text-[#1c2a1c] rounded-[24px] py-6 font-black flex items-center justify-center gap-3 hover:bg-[#b8e600] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Updating System...' : 'Synchronize Profile Changes'} <FaSave />
                        </button>
                    </form>
                </div>

                <div className="mt-10 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center gap-4">
                    <FaShieldAlt className="text-blue-500 text-2xl" />
                    <p className="text-xs text-blue-800 font-bold leading-relaxed">
                        Security Notice: Your email signature is locked to ensure account integrity. If you need to migrate your account, please submit a formal support request.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
