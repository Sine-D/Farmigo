import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUsers, FaLeaf, FaShoppingBasket, FaMoneyBillWave,
  FaChartLine, FaCheckCircle, FaExclamationTriangle,
  FaSignOutAlt, FaCog, FaHeadset, FaGraduationCap,
  FaShieldAlt, FaComments
} from 'react-icons/fa';
import { toast } from "sonner";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const navItems = [
        { icon: <FaChartLine />, label: 'Overview', path: '/admin' },
        { icon: <FaUsers />, label: 'User Directory', path: '/admin/users' },
        { icon: <FaCheckCircle />, label: 'Farmer Approvals', path: '/admin/approvals' },
        { icon: <FaGraduationCap />, label: 'LMS Learning', path: '/admin/lms' },
        { icon: <FaComments />, label: 'Community', path: '/admin/community' },
        { icon: <FaLeaf />, label: 'Sustainability', path: '/admin/sustainability' },
        { icon: <FaShoppingBasket />, label: 'Marketplace', path: '/admin/market' },
        { icon: <FaMoneyBillWave />, label: 'Transactions', path: '/admin/transactions' },
        { icon: <FaShieldAlt />, label: 'Disputes', path: '/admin/disputes' },
        { icon: <FaHeadset />, label: 'Support center', path: '/admin/support' },
    ];

    return (
        <div className="w-80 bg-[#1c2a1c] text-white flex flex-col fixed h-full shadow-[20px_0_80px_rgba(0,0,0,0.2)] z-30 transition-all duration-500 overflow-hidden border-r border-white/10">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none"></div>
            
            {/* Animated Branding Section */}
            <div className="relative z-10 p-8 mb-4">
                <div 
                    className="flex items-center gap-4 cursor-pointer group" 
                    onClick={() => navigate('/')}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#ccff00] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-14 h-14 bg-gradient-to-br from-[#ccff00] to-[#137f13] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500 relative z-10">
                            <FaLeaf className="text-2xl text-[#1c2a1c]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter leading-none group-hover:tracking-normal transition-all duration-500">
                            FARMIGO
                        </span>
                        <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mt-1.5 opacity-80">
                            Command Center
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar relative z-10 space-y-1.5 pb-10 mt-4">
                {navItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={i}
                            onClick={() => navigate(item.path)}
                            className={`w-full relative group flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm overflow-hidden ${
                                isActive
                                    ? 'text-[#1c2a1c]' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {/* Active Background Pill */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00] to-[#e6ff80] shadow-[0_10px_30px_rgba(204,255,0,0.3)]"></div>
                            )}
                            
                            {/* Hover Indicator */}
                            {!isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0 bg-[#ccff00]/20 group-hover:w-1 transition-all"></div>
                            )}

                            <span className={`text-lg relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="relative z-10 tracking-tight">
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 bg-[#1c2a1c] rounded-full animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout/Footer Section */}
            <div className="p-4 relative z-10 mt-auto border-t border-white/5 bg-black/10">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-[0_15px_40px_-10px_rgba(239,68,68,0.4)] transition-all duration-500 font-black text-[9px] uppercase tracking-widest group"
                >
                    <span className="flex items-center gap-2.5">
                        <FaSignOutAlt className="text-xs transform group-hover:-translate-x-1 transition-transform" />
                        Logout Session
                    </span>
                    <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-red-500 transition-colors">
                        <FaCog className="text-[10px] animate-spin-slow" />
                    </div>
                </button>
            </div>

            {/* Background Glow Decorations */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ccff00]/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#137f13]/20 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    );
};

export default AdminSidebar;

