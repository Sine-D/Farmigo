import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaSave, FaTractor, FaTimes } from 'react-icons/fa';
import { apiGet, apiPut } from '../utils/api';

const ProfileModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        location: '',
        whatsappOptIn: false,
        farmDetails: { farmName: '', size: '', produceTypes: [] }
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

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
            setLoading(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Could not load profile details.' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('farm.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                farmDetails: { ...prev.farmDetails, [field]: value }
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
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage({ type: 'success', text: 'Profile synchronized successfully!' });
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-[#1c2a1c]/80 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative bg-white w-full max-w-[600px] rounded-[40px] shadow-2xl overflow-hidden animate-scaleIn border border-[#ccff00]/20">
                <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all z-20">
                    <FaTimes />
                </button>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#137f13] border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-[#137f13] p-8 text-white">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] text-2xl shadow-lg">
                                    <FaUser />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black mb-1">Account Sync</h2>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {message.text && (
                                <div className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                                    message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#137f13] transition-colors text-sm" placeholder="Full Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Terminal Contact</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#137f13] transition-colors text-sm" placeholder="+94 ..." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Geolocation</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#137f13] transition-colors text-sm" placeholder="Location Details" />
                                </div>
                            </div>

                            {user.role === 'Farmer' && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h4 className="text-[10px] font-black text-[#137f13] uppercase tracking-widest flex items-center gap-2">
                                        <FaTractor /> Infrastructure Specifications
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="farm.farmName" value={formData.farmDetails.farmName} onChange={handleChange} required className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#137f13] transition-colors text-sm" placeholder="Farm Handle" />
                                        <input type="text" name="farm.size" value={formData.farmDetails.size} onChange={handleChange} className="w-full bg-[#fcfcfc] border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-[#137f13] transition-colors text-sm" placeholder="Acreage" />
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#f0fdf4] p-5 rounded-[28px] border border-[#137f13]/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#137f13] shadow-sm">
                                        <FaWhatsapp />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">WhatsApp Alerts</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer scale-90">
                                    <input type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#137f13]"></div>
                                </label>
                            </div>

                            <button type="submit" disabled={saving} className="w-full bg-[#ccff00] text-[#1c2a1c] rounded-2xl py-5 font-black flex items-center justify-center gap-3 hover:bg-[#b8e600] transition-all shadow-xl hover:translate-y-[-2px] disabled:opacity-50">
                                {saving ? 'Syncing...' : 'Synchronize Changes'} <FaSave />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
