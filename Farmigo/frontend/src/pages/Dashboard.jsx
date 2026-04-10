import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLeaf,
  FaSignOutAlt,
  FaCog,
  FaHeadset,
  FaRocket
} from 'react-icons/fa';
import ProfileModal from '../components/ProfileModal';
import FarmerDashboard from '../components/FarmerDashboard';
import BuyerDashboard from '../components/BuyerDashboard';
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex items-center gap-3 text-[#137f13]">
          <FaLeaf className="animate-spin text-2xl" />
          <span className="font-bold text-lg text-gray-600">Syncing Ecosystem...</span>
        </div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Farmer':
        return <FarmerDashboard user={user} handleLogout={handleLogout} />;
      case 'Buyer':
        return <BuyerDashboard user={user} handleLogout={handleLogout} />;
      default:
        return <BuyerDashboard user={user} handleLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
      <div className="pt-[110px] pb-20 px-4 sm:px-8 max-w-[1400px] mx-auto">
        {renderDashboardContent()}

        {/* COMMON ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Support Centre Card */}
          <div
            className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[40px] p-8 md:p-10 text-gray-900 flex items-center justify-between shadow-xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
            onClick={() => navigate('/support')}
          >
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(19,127,19,0.10),_transparent_45%)]" />
            <div >
              <h3 className="text-2xl font-black mb-2">Support Centre</h3>
              <p className="text-gray-600 font-medium text-sm max-w-[220px]">
                Raise tickets, open disputes, and manage support conversations.
              </p>
            </div>
            <div className="w-14 h-14 bg-[#137f13] text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <FaHeadset className="text-xl" />
            </div>
          </div>

          {/* Account Settings */}
          <div
            className="bg-[#1c2a1c] rounded-[40px] p-8 md:p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div>
              <h3 className="text-2xl font-black mb-2">Account Settings</h3>
              <p className="text-white/60 font-medium text-sm">
                Security & multi-channel preferences.
              </p>
            </div>
            <div className="w-14 h-14 bg-[#ccff00] text-[#1c2a1c] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <FaCog className="text-xl" />
            </div>
          </div>

          {/* Scale your Farm */}
          <div className="bg-gradient-to-br from-[#137f13] to-[#1c2a1c] rounded-[40px] p-8 md:p-10 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-[#ccff00] flex items-center justify-center text-[#1c2a1c] text-2xl shadow-2xl">
                <FaRocket />
              </div>
              <div>
                <h4 className="text-xl font-black mb-1">Scale your Farm</h4>
                <p className="text-white/70 text-sm font-medium">
                  Read our new trade analytics guide.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-4 opacity-5">
              <FaLeaf className="text-9xl" />
            </div>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default Dashboard;