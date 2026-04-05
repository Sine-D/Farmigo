import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaShieldAlt,
  FaSave, FaTractor, FaArrowLeft, FaLeaf, FaCheckCircle,
  FaEdit, FaEnvelope
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { apiGet, apiPut } from '../utils/api';
import { toast } from 'sonner';

/* ── Floating-label input ────────────────────────────────── */
const FloatingInput = ({ icon: Icon, label, type = 'text', name, value, onChange, required, placeholder, disabled }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137f13] transition-colors duration-300 z-10">
      <Icon size={15} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder=" "
      className="peer w-full bg-white border-2 border-gray-100 rounded-2xl pt-6 pb-2 pl-11 pr-4
        font-semibold text-gray-800 text-sm
        focus:outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10
        hover:border-gray-200 transition-all duration-300
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
    />
    <label className="absolute left-11 top-2 text-[10px] font-black text-gray-400 uppercase tracking-widest
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
      peer-placeholder-shown:text-sm peer-placeholder-shown:font-semibold peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-gray-400
      peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#137f13] peer-focus:normal-case peer-focus:translate-y-0
      transition-all duration-300 pointer-events-none">
      {label}
    </label>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    whatsappOptIn: false,
    farmDetails: { farmName: '', size: '', produceTypes: [] }
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
        toast.error('Could not load profile details.');
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
      setFormData(prev => ({ ...prev, farmDetails: { ...prev.farmDetails, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await apiPut('/users/profile', formData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile synchronized successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading skeleton ─────────────────────────── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1a0d] via-[#1c2a1c] to-[#0d1a0d]">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full border-4 border-[#ccff00]/30 border-t-[#ccff00] animate-spin" />
        <p className="text-[#ccff00]/60 text-[11px] font-black uppercase tracking-[0.3em]">Syncing Profile</p>
      </div>
    </div>
  );

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const isFarmer = user?.role === 'Farmer';

  const tabs = [
    { id: 'personal', label: 'Personal', icon: FaUser },
    ...(isFarmer ? [{ id: 'farm', label: 'Farm', icon: FaTractor }] : []),
    { id: 'notifications', label: 'Alerts', icon: FaWhatsapp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f8fffe] to-[#f0f4ff] pt-[100px] pb-20 px-4 sm:px-8">

      {/* ── Ambient blobs ───────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#137f13]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#ccff00]/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[900px] mx-auto">

        {/* ── Back button ─────────────────────────── */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#137f13] mb-10 font-bold text-sm transition-all group"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:bg-[#137f13] group-hover:border-[#137f13] transition-all">
            <FaArrowLeft className="text-gray-400 group-hover:text-white text-xs transition-colors" />
          </span>
          Back to Dashboard
        </button>

        {/* ── Hero card ───────────────────────────── */}
        <div className="relative rounded-[36px] overflow-hidden shadow-[0_30px_80px_rgba(19,127,19,0.15)] mb-6">
          {/* gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c2a1c] via-[#0f3d0f] to-[#1c2a1c]" />
          {/* mesh */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #ccff00 0%, transparent 50%), radial-gradient(circle at 75% 20%, #71f66a 0%, transparent 50%)' }} />
          {/* grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-[#ccff00] flex items-center justify-center text-[#1c2a1c] text-3xl font-black shadow-[0_8px_32px_rgba(204,255,0,0.4)]">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#137f13] border-4 border-[#1c2a1c] rounded-full flex items-center justify-center">
                <FaEdit className="text-[#ccff00] text-[9px]" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#ccff00]/70 text-[10px] font-black uppercase tracking-[0.3em]">
                  {user.role} · Farmigo Member
                </span>
                <span className="flex items-center gap-1 bg-[#ccff00]/15 border border-[#ccff00]/20 text-[#ccff00] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  <HiSparkles className="text-[8px]" /> Verified
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{user.name}</h1>
              <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                <FaEnvelope className="text-[#ccff00]/60 text-xs" />
                {user.email}
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex flex-col gap-4">
              {[
                { label: 'Role', value: user.role },
                { label: 'Status', value: 'Active' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-right">
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">{s.label}</p>
                  <p className="text-white font-black text-sm">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab nav ─────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-1.5 shadow-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300
                  ${active ? 'bg-[#1c2a1c] text-[#ccff00] shadow-lg' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <Icon className="text-xs" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Form card ───────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/70 backdrop-blur-md rounded-[32px] border border-gray-100/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">

            {/* Personal section */}
            {activeSection === 'personal' && (
              <div className="p-8 sm:p-10 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#137f13]/10 rounded-2xl flex items-center justify-center">
                    <FaUser className="text-[#137f13] text-sm" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Personal Information</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Your public profile data</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatingInput icon={FaUser} label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                  <FloatingInput icon={FaPhone} label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                  <div className="md:col-span-2">
                    <FloatingInput icon={FaMapMarkerAlt} label="Business Location" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <FloatingInput icon={FaEnvelope} label="Email Address (Locked)" name="email" value={user.email} onChange={() => {}} disabled />
                  </div>
                </div>
              </div>
            )}

            {/* Farm section */}
            {activeSection === 'farm' && isFarmer && (
              <div className="p-8 sm:p-10 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <FaTractor className="text-amber-500 text-sm" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Farm Infrastructure</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Your agricultural operation details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatingInput icon={FaTractor} label="Farm / Business Name" name="farm.farmName" value={formData.farmDetails.farmName} onChange={handleChange} required />
                  <FloatingInput icon={FaLeaf} label="Total Acreage (optional)" name="farm.size" value={formData.farmDetails.size} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Herbs', 'Other'].map(type => {
                    const active = formData.farmDetails.produceTypes?.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const existing = formData.farmDetails.produceTypes || [];
                          const next = active ? existing.filter(t => t !== type) : [...existing, type];
                          setFormData(prev => ({ ...prev, farmDetails: { ...prev.farmDetails, produceTypes: next } }));
                        }}
                        className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-[#1c2a1c] text-[#ccff00] shadow-lg scale-[1.03]' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:border-[#137f13]/30 hover:bg-[#f0fdf4]'}`}
                      >
                        {active && <FaCheckCircle className="inline mr-1 text-[10px]" />}
                        {type}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select produce types you grow/sell</p>
              </div>
            )}

            {/* Notifications section */}
            {activeSection === 'notifications' && (
              <div className="p-8 sm:p-10 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                    <FaWhatsapp className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Notification Preferences</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Choose how Farmigo reaches you</p>
                  </div>
                </div>

                {/* WhatsApp toggle card */}
                <div className={`p-6 rounded-[28px] border-2 transition-all duration-500 flex items-center justify-between cursor-pointer
                  ${formData.whatsappOptIn
                    ? 'bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border-[#86efac]'
                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}
                  onClick={() => setFormData(prev => ({ ...prev, whatsappOptIn: !prev.whatsappOptIn }))}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all
                      ${formData.whatsappOptIn ? 'bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.3)]' : 'bg-white text-gray-400'}`}>
                      <FaWhatsapp />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">WhatsApp Alerts</h4>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">Receive live trade, logistics & market alerts</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="sr-only peer" />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer
                      peer-checked:after:translate-x-6 peer-checked:after:border-white
                      after:content-[''] after:absolute after:top-1 after:start-1
                      after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all
                      peer-checked:bg-[#25D366] shadow-inner" />
                  </label>
                </div>

                <div className="p-5 bg-blue-50/50 rounded-[24px] border border-blue-100/80 flex items-start gap-4">
                  <FaShieldAlt className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-semibold leading-relaxed">
                    Your email address is permanently locked to maintain account security. To transfer ownership, file a support request through the Support Hub.
                  </p>
                </div>
              </div>
            )}

            {/* ── Divider & Save ─────────────────────── */}
            <div className="px-8 sm:px-10 pb-8 sm:pb-10">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />
              <button
                type="submit"
                disabled={saving}
                className="w-full relative overflow-hidden bg-[#1c2a1c] text-[#ccff00] rounded-[20px] py-5
                  font-black text-sm tracking-wide flex items-center justify-center gap-3
                  hover:bg-[#2a3d2a] active:scale-[0.99] disabled:opacity-50 transition-all duration-300
                  shadow-[0_8px_30px_rgba(28,42,28,0.4)] hover:shadow-[0_12px_40px_rgba(28,42,28,0.5)]"
              >
                {/* shimmer */}
                {!saving && <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-[#ccff00]/10 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />}
                {saving ? (
                  <><div className="w-5 h-5 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin" /> Synchronizing...</>
                ) : (
                  <><FaSave className="text-sm" /> Synchronize Changes</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Profile;
