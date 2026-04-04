import React, { useState, useEffect } from 'react';
import { FaInbox, FaReply, FaClock, FaCheckCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
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
        <div className="rounded-[32px] border-2 border-transparent bg-[#fcfcfc] p-8 h-full animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 mb-8"></div>
            <div className="h-6 w-32 bg-gray-100 rounded-full mb-4"></div>
            <div className="h-20 bg-gray-50 rounded-2xl"></div>
        </div>
    );

    return (
        <div className="rounded-[32px] border-2 border-transparent hover:border-[#ccff00] bg-[#fcfcfc] p-8 transition-all duration-500 h-full flex flex-col group/hub relative overflow-hidden hover:shadow-2xl hover:bg-white min-h-[500px]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#137f13]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            
            <div className={`w-14 h-14 rounded-2xl bg-[#137f13] text-white flex items-center justify-center text-2xl mb-8 group-hover/hub:scale-110 transition-transform shadow-lg relative z-10`}>
                <FaInbox />
            </div>

            <div className="relative z-10 flex-1">
                <h4 className="font-black text-gray-900 text-xl mb-3 tracking-tight">Support Hub</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium mb-6">Live inquiry tracking & resolutions.</p>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="py-8 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No active tickets</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className="bg-white border border-gray-50 rounded-2xl p-4 shadow-sm group/msg hover:border-[#ccff00]/30 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                        msg.status === 'Replied' ? 'bg-[#ccff00] text-[#1c2a1c]' : 'bg-[#eefaf0] text-[#137f13]'
                                    }`}>
                                        {msg.status}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 italic mb-2">"{msg.message}"</p>
                                {msg.reply && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-[10px] font-black text-[#137f13] uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <FaReply className="text-[8px]" /> Admin Response
                                        </p>
                                        <p className="text-xs text-gray-900 font-bold leading-tight">{msg.reply}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between relative z-10">
                <span className="text-[#137f13] font-black text-[11px] uppercase tracking-widest opacity-0 group-hover/hub:opacity-100 transition-opacity">View Full History</span>
                <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 group-hover/hub:border-[#ccff00] group-hover/hub:text-[#1c2a1c] group-hover/hub:bg-[#ccff00] transition-all transform group-hover/hub:rotate-45">
                    <FaArrowRight className="text-xs" />
                </div>
            </div>
        </div>
    );
};

export default ContactHistory;
