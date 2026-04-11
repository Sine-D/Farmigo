import React, { useState, useEffect } from 'react';
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaWhatsapp,
  FaSave, FaTractor, FaTimes, FaEnvelope, FaLeaf, FaCheckCircle
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import api from '../services/api';
import { toast } from 'sonner';

/* ── Floating-label input ────────────────────────────────── */
const FloatingInput = ({ icon: Icon, label, type = 'text', name, value, onChange, required, disabled }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137f13] transition-colors duration-300 z-10">
      <Icon size={13} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder=" "
      className="peer w-full bg-[#f9fafb] border-2 border-gray-100 rounded-2xl pt-6 pb-2 pl-10 pr-4
        font-semibold text-gray-800 text-sm
        focus:outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 focus:bg-white
        hover:border-gray-200 transition-all duration-300
        disabled:opacity-60 disabled:cursor-not-allowed"
    />
    <label className="absolute left-10 top-2 text-[9px] font-black text-[#137f13] uppercase tracking-widest
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
      peer-placeholder-shown:text-sm peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case
      peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-gray-400
      peer-focus:top-2 peer-focus:text-[9px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#137f13] peer-focus:translate-y-0
      transition-all duration-300 pointer-events-none">
      {label}
    </label>
  </div>
);

const ProfileModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
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
      setLoading(true);
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data?.data || response.data;

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
      toast.error('Could not load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('farm.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, farmDetails: { ...prev.farmDetails, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/users/profile', formData);
      const updatedUser = response.data?.data || response.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile synchronized!');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isFarmer = user?.role === 'Farmer';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '..';

  const tabs = [
    { id: 'personal', label: 'Personal', icon: FaUser },
    ...(isFarmer ? [{ id: 'farm', label: 'Farm', icon: FaTractor }] : []),
    { id: 'alerts', label: 'Alerts', icon: FaWhatsapp },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-6">
      <div
        className="absolute inset-0 bg-[#0d1a0d]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative w-full sm:max-w-[580px] bg-white rounded-t-[40px] sm:rounded-[36px] shadow-[0_-20px_80px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ animation: 'slideUp .35s cubic-bezier(.2,.8,.2,1)' }}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c2a1c] via-[#0f3d0f] to-[#1c2a1c]" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ccff00]/20 rounded-full -mr-12 -mt-12 blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#71f66a]/15 rounded-full -ml-8 -mb-8 blur-[40px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 p-7 flex items-center gap-5">
            {loading ? (
              <div className="w-16 h-16 rounded-2xl bg-white/10 animate-pulse" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#ccff00] flex items-center justify-center text-[#1c2a1c] text-xl font-black shadow-[0_4px_20px_rgba(204,255,0,0.3)] flex-shrink-0">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {loading ? (
                <>
                  <div className="h-3 w-20 bg-white/10 rounded-full mb-3 animate-pulse" />
                  <div className="h-5 w-36 bg-white/20 rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[#ccff00]/60 text-[9px] font-black uppercase tracking-[0.3em]">
                      {user?.role}
                    </span>
                    <span className="flex items-center gap-1 bg-[#ccff00]/15 border border-[#ccff00]/20 text-[#ccff00] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      <HiSparkles className="text-[7px]" /> Verified
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white truncate">{user?.name}</h2>
                  <p className="text-white/40 text-xs font-medium mt-0.5 truncate">{user?.email}</p>
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 flex items-center justify-center text-white/60 hover:text-red-400 transition-all"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <div className="relative z-10 flex gap-1 px-7 pb-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${active ? 'bg-[#ccff00] text-[#1c2a1c]' : 'text-white/40 hover:text-white/70 hover:bg-white/10'}`}
                >
                  <Icon className="text-[9px]" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-[#137f13]/20 border-t-[#137f13] animate-spin" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Loading Profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-7 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar" style={{ animation: 'fadeIn .2s ease' }}>
              {activeTab === 'personal' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingInput icon={FaUser} label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <FloatingInput icon={FaPhone} label="Phone" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    <div className="sm:col-span-2">
                      <FloatingInput icon={FaMapMarkerAlt} label="Location" name="location" value={formData.location} onChange={handleChange} required />
                    </div>
                    <div className="sm:col-span-2">
                      <FloatingInput icon={FaEnvelope} label="Email (Locked)" name="email" value={user?.email || ''} disabled />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'farm' && isFarmer && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput icon={FaTractor} label="Farm Name" name="farm.farmName" value={formData.farmDetails.farmName} onChange={handleChange} required />
                    <FloatingInput icon={FaLeaf} label="Acreage" name="farm.size" value={formData.farmDetails.size} onChange={handleChange} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Produce Types</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Herbs', 'Other'].map(type => {
                        const active = formData.farmDetails.produceTypes?.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              const existing = formData.farmDetails.produceTypes || [];
                              setFormData(prev => ({
                                ...prev,
                                farmDetails: {
                                  ...prev.farmDetails,
                                  produceTypes: active
                                    ? existing.filter(t => t !== type)
                                    : [...existing, type]
                                }
                              }));
                            }}
                            className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                              ${active ? 'bg-[#1c2a1c] text-[#ccff00] border border-[#ccff00]/20' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:border-[#137f13]/30'}`}
                          >
                            {active && <FaCheckCircle className="inline mr-1 text-[9px]" />}
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div
                  className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-500 flex items-center justify-between
                    ${formData.whatsappOptIn ? 'bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border-[#86efac]' : 'bg-gray-50 border-gray-100'}`}
                  onClick={() => setFormData(prev => ({ ...prev, whatsappOptIn: !prev.whatsappOptIn }))}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all
                      ${formData.whatsappOptIn ? 'bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)]' : 'bg-white text-gray-400 border border-gray-100'}`}>
                      <FaWhatsapp />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">WhatsApp Alerts</p>
                      <p className="text-gray-400 text-xs mt-0.5">Trade & logistics notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="sr-only peer" />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer
                      peer-checked:after:translate-x-5 peer-checked:after:border-white
                      after:content-[''] after:absolute after:top-[3px] after:start-[3px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[22px] after:w-[22px] after:transition-all
                      peer-checked:bg-[#25D366]" />
                  </label>
                </div>
              )}
            </div>

            <div className="px-7 pb-7 pt-3 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#1c2a1c] text-[#ccff00] rounded-2xl py-4 font-black text-sm
                  flex items-center justify-center gap-3 transition-all duration-300
                  hover:bg-[#2a3d2a] active:scale-[0.98] disabled:opacity-50
                  shadow-[0_6px_24px_rgba(28,42,28,0.3)]"
              >
                {saving ? (
                  <><div className="w-5 h-5 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin" /> Syncing...</>
                ) : (
                  <><FaSave className="text-sm" /> Synchronize Changes</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default ProfileModal;