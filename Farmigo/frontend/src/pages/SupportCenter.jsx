import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaLeaf,
  FaArrowLeft,
  FaTicketAlt,
  FaExclamationTriangle,
  FaPlus,
  FaComments,
  FaTrash,
  FaHeadset,
} from "react-icons/fa";
import { apiDelete, apiGet, apiPost, apiPut } from "../utils/api";
import AdminSidebar from "../components/AdminSidebar";

const ticketStatusColors = {
  Open: "bg-blue-100 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Closed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const disputeStatusColors = {
  Open: "bg-red-100 text-red-700 border-red-200",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
  Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rejected: "bg-gray-100 text-gray-700 border-gray-200",
};

const fieldClass =
  "w-full rounded-2xl border border-gray-200 bg-[#f8faf8] px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition";

const selectClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 font-medium outline-none appearance-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition shadow-sm";

const SupportCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  });

  const [disputeForm, setDisputeForm] = useState({
    orderId: "",
    reason: "Other",
    description: "",
  });

  const [ticketSearch, setTicketSearch] = useState("");
  const [disputeSearch, setDisputeSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All");
  const [disputeStatusFilter, setDisputeStatusFilter] = useState("All");

  const isStaff = useMemo(() => {
    return user && ["Admin", "Support"].includes(user.role);
  }, [user]);

  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const orderIdParam = params.get("orderId");

    if (tab === "tickets" || tab === "disputes") {
      setActiveTab(tab);
    }

    if (orderIdParam) {
      setDisputeForm((prev) => ({ ...prev, orderId: orderIdParam }));
      setActiveTab("disputes");
    }
  }, [location.search]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadTickets();
      loadDisputes();
      if (!isStaff) {
        loadMyOrders();
      }
    }
  }, [user, isStaff]);

  useEffect(() => {
    if (disputeForm.orderId && myOrders.length > 0) {
      const foundOrder = myOrders.find((order) => order._id === disputeForm.orderId);
      if (foundOrder) {
        setSelectedOrder(foundOrder);
      }
    }
  }, [disputeForm.orderId, myOrders]);

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      const data = await apiGet(isStaff ? "/tickets/admin" : "/tickets");
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  const loadDisputes = async () => {
    try {
      setLoadingDisputes(true);
      const data = await apiGet(isStaff ? "/disputes/admin" : "/disputes/my");
      setDisputes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load disputes");
    } finally {
      setLoadingDisputes(false);
    }
  };

  const loadMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await apiGet("/orders/myorders");
      const orders = Array.isArray(data) ? data : [];
      setMyOrders(orders);
    } catch (err) {
      setError(err.message || "Failed to load your orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSelectOrderForDispute = (order) => {
    setSelectedOrder(order);
    setDisputeForm((prev) => ({
      ...prev,
      orderId: order._id,
    }));
  };

  const getOrderTitle = (order) => {
    if (!order?.orderItems || order.orderItems.length === 0) {
      return `Order #${order?._id?.slice(-6) || "Unknown"}`;
    }

    const firstItem =
      order.orderItems[0]?.name ||
      order.orderItems[0]?.product?.name ||
      "Order Item";

    const extraCount = order.orderItems.length - 1;

    return extraCount > 0 ? `${firstItem} + ${extraCount} more` : firstItem;
  };

  const getShortOrderCode = (order) => {
    return `ORD-${order?._id?.slice(-6)?.toUpperCase() || "000000"}`;
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      setError("Please fill subject and description");
      return;
    }

    try {
      await apiPost("/tickets", ticketForm);
      setSuccess("Ticket created successfully");
      setTicketForm({
        subject: "",
        description: "",
        priority: "Medium",
      });
      loadTickets();
      setActiveTab("tickets");
    } catch (err) {
      setError(err.message || "Failed to create ticket");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const ok = window.confirm("Are you sure you want to delete this ticket?");
    if (!ok) return;

    try {
      await apiDelete(`/tickets/${ticketId}`);
      setSuccess("Ticket deleted successfully");
      loadTickets();
    } catch (err) {
      setError(err.message || "Failed to delete ticket");
    }
  };

  const handleTicketStatusUpdate = async (ticketId, status) => {
    try {
      await apiPut(`/tickets/${ticketId}`, { status });
      setSuccess("Ticket status updated");
      loadTickets();
    } catch (err) {
      setError(err.message || "Failed to update ticket status");
    }
  };

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!disputeForm.orderId || !disputeForm.description.trim()) {
      setError("Please select an order and enter description");
      return;
    }

    try {
      await apiPost("/disputes", disputeForm);
      setSuccess("Dispute created successfully");
      setDisputeForm({
        orderId: "",
        reason: "Other",
        description: "",
      });
      setSelectedOrder(null);
      loadDisputes();
      setActiveTab("disputes");
    } catch (err) {
      setError(err.message || "Failed to create dispute");
    }
  };

  const handleDisputeStatusUpdate = async (disputeId, status) => {
    try {
      await apiPut(`/disputes/${disputeId}/status`, { status });
      setSuccess("Dispute status updated");
      loadDisputes();
    } catch (err) {
      setError(err.message || "Failed to update dispute status");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(ticketSearch.toLowerCase());

    const matchesStatus =
      ticketStatusFilter === "All" || ticket.status === ticketStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredDisputes = disputes.filter((dispute) => {
    const reasonText = dispute.reason || "";
    const descriptionText = dispute.description || "";
    const orderText = dispute.order?._id || dispute.order || "";

    const matchesSearch =
      reasonText.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      descriptionText.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      orderText.toString().toLowerCase().includes(disputeSearch.toLowerCase());

    const matchesStatus =
      disputeStatusFilter === "All" || dispute.status === disputeStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const backRoute = user?.role === "Admin" ? "/admin" : "/dashboard";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6]">
        <div className="text-[#137f13] font-bold text-lg">Loading support center...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8f5] relative overflow-hidden flex">
      {isAdmin && <AdminSidebar />}

      <div className="absolute top-[0%] left-[20%] w-[40%] h-[40%] bg-green-400/25 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <main
        className={`relative z-10 w-full px-4 sm:px-8 py-10 ${
          isAdmin ? "ml-80 max-w-none" : "max-w-[1400px] mx-auto"
        }`}
      >
        <div className={`${isAdmin ? "max-w-[1400px]" : ""} mx-auto`}>
          <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group mb-8">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#22c55e]/15 via-[#86efac]/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <button
                  onClick={() => navigate(backRoute)}
                  className="w-14 h-14 rounded-[20px] bg-white text-gray-700 border border-gray-200 shadow-sm flex items-center justify-center hover:text-[#137f13] hover:border-[#137f13] transition mt-1"
                >
                  <FaArrowLeft />
                </button>

                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                    <FaHeadset className="text-sm" /> Support & Resolution Desk
                  </div>
                  <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
                    Support Center
                  </h1>
                  <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                    Manage tickets, disputes, and communication threads from one professional resolution workspace.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-6 py-4 bg-white/70 backdrop-blur-2xl rounded-[28px] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                    Active Role
                  </p>
                  <p className="text-xl font-black text-gray-900">{user.role}</p>
                  <p className="text-[10px] text-[#137f13] font-black uppercase tracking-widest mt-1">
                    Support Access
                  </p>
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-[#137f13] to-emerald-400 rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30">
                  <FaLeaf />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 font-medium shadow-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 font-medium shadow-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-6 md:p-8 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setActiveTab("tickets")}
                    className={`px-5 py-3 rounded-2xl font-black transition ${
                      activeTab === "tickets"
                        ? "bg-[#1c2a1c] text-[#ccff00] shadow-lg"
                        : "bg-[#f5f7f6] text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaTicketAlt /> Tickets
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("disputes")}
                    className={`px-5 py-3 rounded-2xl font-black transition ${
                      activeTab === "disputes"
                        ? "bg-[#1c2a1c] text-[#ccff00] shadow-lg"
                        : "bg-[#f5f7f6] text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaExclamationTriangle /> Disputes
                    </span>
                  </button>
                </div>

                {activeTab === "tickets" && (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={ticketSearch}
                        onChange={(e) => setTicketSearch(e.target.value)}
                        className={`${fieldClass} flex-1`}
                      />

                      <select
                        value={ticketStatusFilter}
                        onChange={(e) => setTicketStatusFilter(e.target.value)}
                        className="min-w-[140px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 font-medium outline-none appearance-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition shadow-sm"
                      >
                        <option>All</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                      </select>
                    </div>

                    {loadingTickets ? (
                      <div className="text-gray-500 font-medium">Loading tickets...</div>
                    ) : filteredTickets.length === 0 ? (
                      <div className="rounded-[28px] border border-dashed border-gray-300 bg-[#f8faf8] p-10 text-center">
                        <p className="font-black text-gray-700 text-lg">No tickets found</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Create a new ticket using the panel on the right.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTickets.map((ticket) => (
                          <div
                            key={ticket._id}
                            className="rounded-[28px] border border-gray-100 bg-white shadow-sm hover:shadow-md transition p-5"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <h3 className="text-lg font-black text-gray-900">
                                    {ticket.subject}
                                  </h3>

                                  <span
                                    className={`text-xs font-black px-3 py-1 rounded-full border ${
                                      ticketStatusColors[ticket.status] ||
                                      "bg-gray-100 text-gray-700 border-gray-200"
                                    }`}
                                  >
                                    {ticket.status}
                                  </span>

                                  <span className="text-xs font-black px-3 py-1 rounded-full border bg-purple-100 text-purple-700 border-purple-200">
                                    {ticket.priority}
                                  </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                                  {ticket.description}
                                </p>

                                <div className="text-sm text-gray-500 flex flex-wrap gap-4 font-medium">
                                  <span>
                                    Created:{" "}
                                    {ticket.createdAt
                                      ? new Date(ticket.createdAt).toLocaleString()
                                      : "-"}
                                  </span>

                                  {isStaff && ticket.user && (
                                    <span>
                                      Owner: {ticket.user.name} ({ticket.user.email})
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link
                                  to={`/support/tickets/${ticket._id}`}
                                  className="px-4 py-3 rounded-2xl bg-[#1c2a1c] text-[#ccff00] font-black hover:opacity-95 transition no-underline inline-flex items-center gap-2 shadow-sm"
                                >
                                  <FaComments /> Open Chat
                                </Link>

                                {isStaff && (
                                  <select
                                    value={ticket.status}
                                    onChange={(e) =>
                                      handleTicketStatusUpdate(ticket._id, e.target.value)
                                    }
                                    className="min-w-[150px] px-4 py-3 rounded-2xl border border-gray-200 outline-none bg-white text-gray-900 font-medium appearance-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition shadow-sm"
                                  >
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Closed</option>
                                  </select>
                                )}

                                <button
                                  onClick={() => handleDeleteTicket(ticket._id)}
                                  className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-black hover:bg-red-100 transition inline-flex items-center gap-2"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "disputes" && (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                      <input
                        type="text"
                        placeholder="Search disputes..."
                        value={disputeSearch}
                        onChange={(e) => setDisputeSearch(e.target.value)}
                        className={`${fieldClass} flex-1`}
                      />

                      <select
                        value={disputeStatusFilter}
                        onChange={(e) => setDisputeStatusFilter(e.target.value)}
                        className="min-w-[140px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 font-medium outline-none appearance-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition shadow-sm"
                      >
                        <option>All</option>
                        <option>Open</option>
                        <option>Under Review</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                    </div>

                    {loadingDisputes ? (
                      <div className="text-gray-500 font-medium">Loading disputes...</div>
                    ) : filteredDisputes.length === 0 ? (
                      <div className="rounded-[28px] border border-dashed border-gray-300 bg-[#f8faf8] p-10 text-center">
                        <p className="font-black text-gray-700 text-lg">No disputes found</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Create a dispute using the panel on the right.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredDisputes.map((dispute) => (
                          <div
                            key={dispute._id}
                            className="rounded-[28px] border border-gray-100 bg-white shadow-sm hover:shadow-md transition p-5"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <h3 className="text-lg font-black text-gray-900">
                                    {dispute.reason}
                                  </h3>

                                  <span
                                    className={`text-xs font-black px-3 py-1 rounded-full border ${
                                      disputeStatusColors[dispute.status] ||
                                      "bg-gray-100 text-gray-700 border-gray-200"
                                    }`}
                                  >
                                    {dispute.status}
                                  </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                                  {dispute.description}
                                </p>

                                <div className="text-sm text-gray-500 flex flex-col gap-1 font-medium">
                                  <span>
                                    Order:{" "}
                                    {dispute.order?._id
                                      ? `ORD-${dispute.order._id.slice(-6).toUpperCase()}`
                                      : dispute.order
                                      ? `ORD-${String(dispute.order).slice(-6).toUpperCase()}`
                                      : "-"}
                                  </span>

                                  {dispute.order?.totalPrice && (
                                    <span>
                                      Total: Rs. {Number(dispute.order.totalPrice).toLocaleString()}
                                    </span>
                                  )}

                                  <span>
                                    Opened By: {dispute.openedBy?.name || "Unknown"}
                                    {dispute.openedBy?.role ? ` (${dispute.openedBy.role})` : ""}
                                  </span>

                                  <span>
                                    Created:{" "}
                                    {dispute.createdAt
                                      ? new Date(dispute.createdAt).toLocaleString()
                                      : "-"}
                                  </span>

                                  {dispute.resolutionNote && (
                                    <span className="text-emerald-700 font-black">
                                      Resolution: {dispute.resolutionNote}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Link
                                  to={`/support/disputes/${dispute._id}`}
                                  className="px-4 py-3 rounded-2xl bg-[#1c2a1c] text-[#ccff00] font-black hover:opacity-95 transition no-underline inline-flex items-center gap-2 shadow-sm"
                                >
                                  <FaComments /> Open Chat
                                </Link>

                                {isStaff && (
                                  <select
                                    value={dispute.status}
                                    onChange={(e) =>
                                      handleDisputeStatusUpdate(dispute._id, e.target.value)
                                    }
                                    className="min-w-[150px] px-4 py-3 rounded-2xl border border-gray-200 outline-none bg-white text-gray-900 font-medium appearance-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 transition shadow-sm"
                                  >
                                    <option>Open</option>
                                    <option>Under Review</option>
                                    <option>Resolved</option>
                                    <option>Rejected</option>
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-6 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <h2 className="text-xl font-black text-gray-900 mb-5 tracking-tight">
                  {activeTab === "tickets" ? "Create New Ticket" : "Create New Dispute"}
                </h2>

                {activeTab === "tickets" ? (
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) =>
                          setTicketForm({
                            ...ticketForm,
                            subject: e.target.value,
                          })
                        }
                        className={fieldClass}
                        placeholder="Enter ticket subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="5"
                        value={ticketForm.description}
                        onChange={(e) =>
                          setTicketForm({
                            ...ticketForm,
                            description: e.target.value,
                          })
                        }
                        className={`${fieldClass} resize-none`}
                        placeholder="Describe your issue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) =>
                          setTicketForm({
                            ...ticketForm,
                            priority: e.target.value,
                          })
                        }
                        className={selectClass}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    <button className="w-full rounded-2xl bg-[#ccff00] text-[#1c2a1c] font-black py-3 hover:scale-[1.01] transition inline-flex items-center justify-center gap-2 shadow-lg">
                      <FaPlus /> Submit Ticket
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateDispute} className="space-y-5">
                    {!isStaff && (
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">
                          Select Order
                        </label>

                        {loadingOrders ? (
                          <div className="rounded-2xl border border-gray-200 bg-[#f8faf8] px-4 py-3 text-sm text-gray-500">
                            Loading your orders...
                          </div>
                        ) : myOrders.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-gray-300 bg-[#f8faf8] px-4 py-4 text-sm text-gray-500">
                            No orders found. You need at least one order to raise a dispute.
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                            {myOrders.map((order) => {
                              const isSelected = selectedOrder?._id === order._id;

                              return (
                                <button
                                  key={order._id}
                                  type="button"
                                  onClick={() => handleSelectOrderForDispute(order)}
                                  className={`w-full text-left rounded-2xl border p-4 transition ${
                                    isSelected
                                      ? "border-[#137f13] bg-[#f0fdf4] shadow-sm"
                                      : "border-gray-200 bg-white hover:border-[#137f13]/40 hover:bg-[#fafdfb]"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-xs font-black uppercase tracking-widest text-[#137f13] mb-1">
                                        {getShortOrderCode(order)}
                                      </p>
                                      <h4 className="text-sm font-black text-gray-900">
                                        {getOrderTitle(order)}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {order.orderItems?.length || 0} item(s)
                                      </p>
                                    </div>

                                    <span
                                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                        order.status === "Delivered"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : order.status === "Pending"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>

                                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                      Total: Rs. {Number(order.totalPrice || order.total || 0).toLocaleString()}
                                    </span>
                                    <span>
                                      {order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString()
                                        : "-"}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOrder && (
                      <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-widest text-[#137f13] mb-1">
                          Selected Order
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          {getShortOrderCode(selectedOrder)} — {getOrderTitle(selectedOrder)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Hidden order ID will be submitted automatically.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Reason
                      </label>
                      <select
                        value={disputeForm.reason}
                        onChange={(e) =>
                          setDisputeForm({
                            ...disputeForm,
                            reason: e.target.value,
                          })
                        }
                        className={selectClass}
                      >
                        <option>Late Delivery</option>
                        <option>Wrong Item</option>
                        <option>Poor Quality</option>
                        <option>Payment Issue</option>
                        <option>Damaged Item</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="5"
                        value={disputeForm.description}
                        onChange={(e) =>
                          setDisputeForm({
                            ...disputeForm,
                            description: e.target.value,
                          })
                        }
                        className={`${fieldClass} resize-none`}
                        placeholder="Describe the dispute clearly"
                      />
                    </div>

                    <button
                      disabled={!disputeForm.orderId || !disputeForm.description.trim()}
                      className="w-full rounded-2xl bg-[#ccff00] text-[#1c2a1c] font-black py-3 hover:scale-[1.01] transition inline-flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <FaPlus /> Open Dispute
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-[#1c2a1c] rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#ccff00]/10 rounded-full blur-3xl" />
                <h3 className="text-lg font-black mb-5 relative z-10">Module Highlights</h3>

                <div className="space-y-4 relative z-10">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="font-black text-[#ccff00] text-sm mb-1">Support Tickets</p>
                    <p className="text-white/70 text-sm">
                      Raise, track, reply and manage support communication.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="font-black text-[#ccff00] text-sm mb-1">Dispute Resolution</p>
                    <p className="text-white/70 text-sm">
                      Select an order visually and open a dispute without typing long order IDs.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="font-black text-[#ccff00] text-sm mb-1">Conversation Threads</p>
                    <p className="text-white/70 text-sm">
                      Once created, messages work with dispute ID, not order ID.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportCenter;
