/**
 * NotificationPanel.jsx
 * Premium, modern notification dropdown for the FARMIGO Dashboard.
 * Supports individual item dismissal and clear-all functionality.
 */
import React, { useEffect, useRef } from "react";
import { FaBell, FaExclamationTriangle, FaClock, FaTimes, FaCircle } from "react-icons/fa";

const NotificationPanel = ({ notifications, onClose, isOpen, onDismiss, onDismissAll }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-emerald-50 overflow-hidden z-[100] animate-in fade-in zoom-in duration-300"
    >
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-lg font-black flex items-center gap-2">
            <FaBell className="text-emerald-300" /> Alerts
          </h3>
          <p className="text-emerald-100/70 text-[10px] uppercase font-bold tracking-widest mt-1">Live Inventory Monitor</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <FaTimes size={12} />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-inner">
              <FaBell className="text-emerald-200 text-3xl" />
            </div>
            <p className="text-gray-900 font-black text-sm">Everything's Fresh!</p>
            <p className="text-gray-400 text-xs mt-1">No pending alerts for your inventory.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n, i) => (
              <div key={n.id || i} className="p-5 hover:bg-emerald-50/30 transition-all cursor-pointer group relative">
                {/* Individual Dismiss Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all z-10"
                  title="Dismiss alert"
                >
                  <FaTimes size={10} />
                </button>

                <div className="flex gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    n.type === 'expired' ? 'bg-red-50 text-red-600 border border-red-100' :
                    n.type === 'expiring' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-orange-50 text-orange-600 border border-orange-100'
                  }`}>
                    {n.type === 'low_stock' ? <FaExclamationTriangle size={16}/> : <FaClock size={16}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5 pr-6">
                      <p className="text-sm font-black text-gray-900 truncate group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{n.productName}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        n.type === 'expired' ? 'bg-red-600 text-white' :
                        n.type === 'expiring' ? 'bg-amber-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {n.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {n.message}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                       {n.quantity !== undefined && (
                         <span className="text-[10px] font-black text-gray-400 flex items-center gap-1.5">
                           <FaCircle size={5} className="text-orange-400" /> {n.quantity} {n.unit} Left
                         </span>
                       )}
                       {n.date && (
                         <span className="text-[10px] font-black text-gray-400 flex items-center gap-1.5">
                           <FaCircle size={5} className={n.type === 'expired' ? 'text-red-400' : 'text-amber-400'} /> {n.date}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
          <button 
            onClick={onDismissAll}
            className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] transition-all"
          >
            Acknowledge & Dismiss All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
