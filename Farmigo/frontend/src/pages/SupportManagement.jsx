import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeadset, FaTicketAlt, FaExclamationCircle, 
  FaCheckCircle, FaClock, FaSearch,
  FaReply, FaTrashAlt, FaChevronRight,
  FaBell
} from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '../components/AdminSidebar';

const SupportManagement = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/tickets/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTickets(data);
      }
    } catch (error) {
      setTickets([
        { _id: '1', subject: 'Crop Irrigation Issue', user: { name: 'Sunil Perera' }, priority: 'High', status: 'Open', createdAt: new Date() },
        { _id: '2', subject: 'Marketplace Listing Error', user: { name: 'Kamal Silva' }, priority: 'Medium', status: 'Pending', createdAt: new Date() },
        { _id: '3', subject: 'Payment Delay', user: { name: 'Amara Weerasinghe' }, priority: 'Critical', status: 'Open', createdAt: new Date() },
        { _id: '4', subject: 'Account Verification', user: { name: 'Nimal Jay' }, priority: 'Low', status: 'Closed', createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success(`Ticket marked as ${status}`);
        fetchTickets();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-600 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <FaClock className="text-blue-500" />;
      case 'Pending': return <FaExclamationCircle className="text-amber-500" />;
      case 'Closed': return <FaCheckCircle className="text-emerald-500" />;
      default: return <FaTicketAlt />;
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f4f8f5] flex relative overflow-hidden font-sans">
      <div className="absolute top-[0%] left-[20%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#ccff00]/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      
      <AdminSidebar className="relative z-20" />
      
      <div className="flex-1 ml-72 p-8 xl:p-12 relative z-10 h-screen overflow-y-auto w-full">
        {/* Top Header Floating */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-[450px] group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#137f13] transition-colors text-lg" />
            <input 
              type="text" 
              placeholder="Search tickets by subject or farmer..." 
              className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-2xl rounded-[30px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] focus:bg-white focus:ring-4 focus:ring-[#137f13]/10 transition-all font-bold text-gray-700 outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-14 h-14 bg-white/70 backdrop-blur-2xl border border-white rounded-[24px] text-gray-500 hover:text-[#137f13] hover:bg-white transition-all shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer group">
              <FaBell className="text-xl group-hover:scale-110 transition-transform" />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="flex items-center gap-4 p-2 pr-6 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#137f13] to-emerald-400 rounded-[24px] flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                {user?.name?.substring(0, 2).toUpperCase() || 'SL'}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest leading-tight">Support Lead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Panel (Premium Glass styling) */}
        <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group mb-10">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                        <FaHeadset className="text-sm" /> Support Engine
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">Support <br />Management</h1>
                    <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                        Coordinate resolution for farmer technical issues and disputes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/60 p-2 rounded-3xl shadow-sm border border-white/80 uppercase tracking-widest text-[9px] font-black text-gray-500">
                  {['All', 'Open', 'Pending', 'Closed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-6 py-4 rounded-2xl transition-all ${
                        filter === f ? 'bg-[#137f13] text-white shadow-lg shadow-[#137f13]/30' : 'hover:bg-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
            </div>
        </div>

        {/* Tickets Grid */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 lg:p-10 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                    <span className="w-12 h-12 bg-white text-[#137f13] rounded-[20px] flex items-center justify-center text-xl shadow-inner border border-emerald-50">
                        <FaTicketAlt />
                    </span>
                    Active Tickets
                </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200">
                  <div className="animate-spin w-8 h-8 border-4 border-[#137f13] border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket._id}
                    className="flex flex-col md:flex-row items-center justify-between p-5 bg-white rounded-[32px] border border-gray-100 hover:border-[#137f13]/30 hover:shadow-[0_15px_40px_-15px_rgba(19,127,19,0.15)] hover:-translate-y-1 transition-all group duration-300 gap-6"
                  >
                    <div className="flex items-center gap-6 flex-1 w-full">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform ${getPriorityColor(ticket.priority)}`}>
                        {getStatusIcon(ticket.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#137f13] transition-colors uppercase">{ticket.subject}</h3>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-xl border ${getPriorityColor(ticket.priority)} uppercase tracking-widest`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400">
                          <span className="flex items-center gap-1.5 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg"><FaTicketAlt className="text-[10px]" /> ID: #{ticket._id.slice(-6)}</span>
                          <span className="flex items-center gap-1.5 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">User: {ticket.user?.name}</span>
                          <span className="flex items-center gap-1.5 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">Date: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto">
                      <button 
                        onClick={() => navigate(`/support/tickets/${ticket._id}`)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#137f13]/10 text-[#137f13] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#137f13] hover:text-white transition-all shadow-sm"
                      >
                        <FaReply /> Reply
                      </button>
                      
                      {ticket.status !== 'Closed' && (
                        <button 
                          onClick={() => updateStatus(ticket._id, 'Closed')}
                          className="flex-1 md:flex-none p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                          title="Mark as Resolved"
                        >
                          <FaCheckCircle />
                        </button>
                      )}

                      <button className="flex-1 md:flex-none p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center">
                        <FaTrashAlt />
                      </button>
                      
                      <div className="hidden lg:flex w-12 h-12 rounded-[20px] items-center justify-center text-gray-300 group-hover:text-[#137f13] group-hover:bg-emerald-50 transition-all cursor-pointer">
                        <FaChevronRight className="text-lg" />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTickets.length === 0 && (
                  <div className="text-center py-20 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200">
                    <FaTicketAlt className="text-5xl text-gray-200 mb-4 mx-auto" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No tickets match your current filters.</p>
                  </div>
                )}
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SupportManagement;
