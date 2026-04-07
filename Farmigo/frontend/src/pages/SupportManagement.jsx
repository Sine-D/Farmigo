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
    <div className="min-h-screen bg-[#f4f7f6] flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 p-8 pt-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tickets by subject or farmer..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#137f13]/20 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#137f13] uppercase tracking-widest">Support Lead</p>
              </div>
              <div className="w-12 h-12 bg-[#ccff00] rounded-2xl flex items-center justify-center text-[#1c2a1c] font-black shadow-lg">
                SL
              </div>
            </div>
          </div>
        </div>

        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#137f13] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#137f13]/20">
                <FaHeadset className="text-xl" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Support Management</h1>
            </div>
            <p className="text-gray-500 font-medium">Coordinate resolution for farmer technical issues and disputes.</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 text-gray-500">
            {['All', 'Open', 'Pending', 'Closed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === f ? 'bg-[#137f13] text-white shadow-md' : 'hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-[#137f13] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket._id}
                className="bg-white rounded-[28px] p-6 border border-gray-100 hover:shadow-xl hover:border-[#137f13]/20 transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 flex-1 w-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner flex-shrink-0 ${getPriorityColor(ticket.priority)}`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#137f13] transition-colors">{ticket.subject}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1.5"><FaTicketAlt className="text-[10px]" /> Ticket ID: #{ticket._id.slice(-6)}</span>
                      <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="hidden sm:block">Farmer: {ticket.user?.name}</span>
                      <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="hidden sm:block">Raised: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate(`/support/tickets/${ticket._id}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#137f13]/10 text-[#137f13] rounded-xl font-bold text-sm hover:bg-[#137f13] hover:text-white transition-all"
                  >
                    <FaReply /> Open Chat
                  </button>
                  
                  {ticket.status !== 'Closed' && (
                    <button 
                      onClick={() => updateStatus(ticket._id, 'Closed')}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      title="Mark as Resolved"
                    >
                      <FaCheckCircle />
                    </button>
                  )}

                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <FaTrashAlt />
                  </button>
                  
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#137f13] transition-colors">
                    <FaChevronRight className="text-sm" />
                  </div>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <FaTicketAlt className="text-5xl text-gray-200 mb-4 mx-auto" />
                <p className="text-gray-400 font-bold">No tickets match your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportManagement;
