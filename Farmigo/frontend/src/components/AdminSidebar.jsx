import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUsers, FaLeaf, FaShoppingBasket, FaMoneyBillWave,
  FaChartLine, FaCheckCircle, FaExclamationTriangle,
  FaSignOutAlt, FaCog, FaHeadset
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
        { icon: <FaUsers />, label: 'Users', path: '/admin/users' },
        { icon: <FaCheckCircle />, label: 'Farmer Approvals', path: '/admin/approvals' },
        { icon: <FaHeadset />, label: 'Support Hub', path: '/admin/support' },
        { icon: <FaLeaf />, label: 'Sustainability', path: '/admin/sustainability' },
        { icon: <FaShoppingBasket />, label: 'Marketplace', path: '/admin/market' },
        { icon: <FaMoneyBillWave />, label: 'Transactions', path: '/admin/transactions' },
        { icon: <FaExclamationTriangle />, label: 'Disputes', path: '/admin/disputes' },
        { icon: <FaCog />, label: 'System Settings', path: '/admin/settings' }
    ];

    return (
        <div className="w-72 bg-[#1c2a1c] text-white p-6 flex flex-col fixed h-full shadow-2xl z-20">
            <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                <FaLeaf className="text-3xl text-[#ccff00]" />
                <span className="text-2xl font-black tracking-tighter uppercase">FARMIGO <span className="text-[#ccff00] text-[10px] block mt-[-5px]">Admin Command</span></span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {navItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                            location.pathname === item.path
                                ? 'bg-[#ccff00] text-[#1c2a1c] shadow-[0_8px_20px_rgba(204,255,0,0.2)] scale-[1.02]' 
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <button 
                onClick={handleLogout}
                className="mt-10 flex items-center gap-4 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all font-bold text-sm"
            >
                <FaSignOutAlt />
                Logout Session
            </button>
        </div>
    );
};

export default AdminSidebar;
