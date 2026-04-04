import React, { useState, useEffect } from 'react';
import { FaInbox, FaReply, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { apiGet } from '../utils/api';

const ContactHistory = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await apiGet('/contact/my');
                setMessages(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(`API Error: ${err.message}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    if (loading) return (
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] animate-pulse">
            <div className="h-6 w-32 bg-gray-100 rounded-full mb-8"></div>
            <div className="space-y-6">
                <div className="h-32 bg-gray-50/50 rounded-3xl"></div>
                <div className="h-32 bg-gray-50/50 rounded-3xl"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#137f13]/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#eefaf0] text-[#137f13] flex items-center justify-center text-xl shadow-sm">
                        <FaInbox />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#1c2a1c]">Live Inquiries</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Support History</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-3 border border-red-100 shadow-sm transition-all animate-shake">
                    <FaExclamationCircle className="text-sm" /> {error}
                </div>
            )}

            {messages.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                    <div className="text-gray-300 text-5xl mb-6 flex justify-center scale-110">
                        <FaInbox />
                    </div>
                    <p className="text-[#1c2a1c] font-black text-sm uppercase tracking-widest">System Clear</p>
                    <p className="text-gray-400 text-xs mt-2 font-medium">New requests will log here.</p>
                </div>
            ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
                    {messages.map((msg) => (
                        <div key={msg._id} className="group border border-gray-100 rounded-[32px] p-6 hover:border-[#ccff00] transition-all bg-[#fafafa]/80 hover:bg-white hover:shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                                        msg.status === 'Replied' ? 'bg-[#ccff00] text-[#1c2a1c]' : 'bg-[#eefaf0] text-[#137f13]'
                                    }`}>
                                        {msg.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                        <FaClock className="text-[9px]" /> {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                {msg.status === 'Replied' && (
                                    <div className="w-6 h-6 rounded-full bg-[#ccff00] text-[#1c2a1c] flex items-center justify-center text-[10px] shadow-sm">
                                        <FaCheckCircle />
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-[11px] font-black uppercase tracking-widest text-[#137f13] mb-2">Original Ticket</p>
                                <p className="text-xs text-gray-800 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-gray-50 shadow-inner">"{msg.message}"</p>
                            </div>

                            {msg.reply ? (
                                <div className="bg-gradient-to-br from-[#f0fdf4] to-[#fcfcfc] border border-[#137f13]/10 rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 mb-3 text-[#137f13]">
                                        <div className="p-1 bg-[#137f13] rounded-md">
                                            <FaReply className="text-[8px] text-white" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resolution</span>
                                    </div>
                                    <p className="text-[13px] text-gray-900 leading-relaxed font-black">
                                        {msg.reply}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 bg-white py-3 px-5 rounded-2xl border border-dashed border-gray-200">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </div>
                                    <span className="font-bold tracking-widest uppercase">Processing Logistics...</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactHistory;
