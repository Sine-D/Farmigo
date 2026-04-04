import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaArrowLeft,
  FaTicketAlt,
  FaExclamationTriangle,
  FaPlus,
  FaComments,
  FaTrash,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { apiDelete, apiGet, apiPost, apiPut } from "../utils/api";

const ticketStatusColors = {
  Open: "bg-blue-100 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Closed: "bg-green-100 text-green-700 border-green-200",
};

const disputeStatusColors = {
  Open: "bg-red-100 text-red-700 border-red-200",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
  Resolved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-gray-100 text-gray-700 border-gray-200",
};

const fieldClass =
  "w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13] bg-white text-gray-900 placeholder:text-gray-400";

const selectClass =
  "w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13] bg-white text-gray-900";

const SupportCenter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
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
    }
  }, [user]);

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

    if (!disputeForm.orderId.trim() || !disputeForm.description.trim()) {
      setError("Please fill order ID and description");
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
      loadDisputes();
      setActiveTab("disputes");
    } catch (err) {
      setError(err.message || "Failed to create dispute");
    }
  };

  const handleDisputeStatusUpdate = async (disputeId, status) => {
    try {
      await apiPut(`/disputes/${disputeId}/status`, {
        status,
      });
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="text-[#137f13] font-bold text-lg">
          Loading support center...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#137f13] hover:border-[#137f13] transition"
            >
              <FaArrowLeft />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-[#137f13] text-white flex items-center justify-center shadow-lg">
              <FaLeaf />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Communication, Support & Dispute Resolution
              </h1>
              <p className="text-sm text-gray-500">
                Tickets, disputes, status handling, and conversation threads
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#137f13] text-xs font-bold">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-8 py-8">
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 font-medium">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`px-5 py-3 rounded-2xl font-bold transition ${
                    activeTab === "tickets"
                      ? "bg-[#137f13] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaTicketAlt /> Tickets
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("disputes")}
                  className={`px-5 py-3 rounded-2xl font-bold transition ${
                    activeTab === "disputes"
                      ? "bg-[#137f13] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaExclamationTriangle /> Disputes
                  </span>
                </button>
              </div>

              {activeTab === "tickets" && (
                <>
                  <div className="flex flex-col md:flex-row gap-3 mb-5">
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
                      className="rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13] bg-white text-gray-900"
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
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <p className="font-bold text-gray-700">No tickets found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Create a new ticket using the form on the right.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className="rounded-[24px] border border-gray-100 bg-[#fcfffc] shadow-sm p-5"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <h3 className="text-lg font-black text-gray-900">
                                  {ticket.subject}
                                </h3>

                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                    ticketStatusColors[ticket.status] ||
                                    "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {ticket.status}
                                </span>

                                <span className="text-xs font-bold px-3 py-1 rounded-full border bg-purple-100 text-purple-700 border-purple-200">
                                  {ticket.priority}
                                </span>
                              </div>

                              <p className="text-gray-600 leading-relaxed mb-3">
                                {ticket.description}
                              </p>

                              <div className="text-sm text-gray-500 flex flex-wrap gap-4">
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
                                className="px-4 py-2 rounded-xl bg-[#137f13] text-white font-bold hover:bg-[#0f6a0f] transition no-underline inline-flex items-center gap-2"
                              >
                                <FaComments /> Open Chat
                              </Link>

                              {isStaff && (
                                <select
                                  value={ticket.status}
                                  onChange={(e) =>
                                    handleTicketStatusUpdate(ticket._id, e.target.value)
                                  }
                                  className="px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white text-gray-900"
                                >
                                  <option>Open</option>
                                  <option>In Progress</option>
                                  <option>Closed</option>
                                </select>
                              )}

                              <button
                                onClick={() => handleDeleteTicket(ticket._id)}
                                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-100 transition inline-flex items-center gap-2"
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
                  <div className="flex flex-col md:flex-row gap-3 mb-5">
                    <input
                      type="text"
                      placeholder="Search disputes by reason, description, or order id..."
                      value={disputeSearch}
                      onChange={(e) => setDisputeSearch(e.target.value)}
                      className={`${fieldClass} flex-1`}
                    />

                    <select
                      value={disputeStatusFilter}
                      onChange={(e) => setDisputeStatusFilter(e.target.value)}
                      className="rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13] bg-white text-gray-900"
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
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <p className="font-bold text-gray-700">No disputes found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Create a dispute using an order ID from your order history.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDisputes.map((dispute) => (
                        <div
                          key={dispute._id}
                          className="rounded-[24px] border border-gray-100 bg-[#fffdfc] shadow-sm p-5"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <h3 className="text-lg font-black text-gray-900">
                                  {dispute.reason}
                                </h3>

                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                    disputeStatusColors[dispute.status] ||
                                    "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {dispute.status}
                                </span>
                              </div>

                              <p className="text-gray-600 leading-relaxed mb-3">
                                {dispute.description}
                              </p>

                              <div className="text-sm text-gray-500 flex flex-col gap-1">
                                <span>
                                  Order ID: {dispute.order?._id || dispute.order || "-"}
                                </span>
                                <span>
                                  Opened By: {dispute.openedBy?.name || "Unknown"}
                                  {dispute.openedBy?.role
                                    ? ` (${dispute.openedBy.role})`
                                    : ""}
                                </span>
                                <span>
                                  Created:{" "}
                                  {dispute.createdAt
                                    ? new Date(dispute.createdAt).toLocaleString()
                                    : "-"}
                                </span>
                                {dispute.resolutionNote && (
                                  <span className="text-green-700 font-medium">
                                    Resolution: {dispute.resolutionNote}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Link
                                to={`/support/disputes/${dispute._id}`}
                                className="px-4 py-2 rounded-xl bg-[#137f13] text-white font-bold hover:bg-[#0f6a0f] transition no-underline inline-flex items-center gap-2"
                              >
                                <FaComments /> Open Chat
                              </Link>

                              {isStaff && (
                                <select
                                  value={dispute.status}
                                  onChange={(e) =>
                                    handleDisputeStatusUpdate(dispute._id, e.target.value)
                                  }
                                  className="px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white text-gray-900"
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
            <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-black text-gray-900 mb-4">
                {activeTab === "tickets" ? "Create New Ticket" : "Create New Dispute"}
              </h2>

              {activeTab === "tickets" ? (
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, subject: e.target.value })
                      }
                      className={fieldClass}
                      placeholder="Enter ticket subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="5"
                      value={ticketForm.description}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, description: e.target.value })
                      }
                      className={`${fieldClass} resize-none`}
                      placeholder="Describe your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, priority: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <button className="w-full rounded-2xl bg-[#137f13] text-white font-bold py-3 hover:bg-[#0f6a0f] transition inline-flex items-center justify-center gap-2">
                    <FaPlus /> Submit Ticket
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateDispute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={disputeForm.orderId}
                      onChange={(e) =>
                        setDisputeForm({ ...disputeForm, orderId: e.target.value })
                      }
                      className={fieldClass}
                      placeholder="Enter order id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Reason
                    </label>
                    <select
                      value={disputeForm.reason}
                      onChange={(e) =>
                        setDisputeForm({ ...disputeForm, reason: e.target.value })
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="5"
                      value={disputeForm.description}
                      onChange={(e) =>
                        setDisputeForm({ ...disputeForm, description: e.target.value })
                      }
                      className={`${fieldClass} resize-none`}
                      placeholder="Describe the dispute"
                    />
                  </div>

                  <button className="w-full rounded-2xl bg-[#137f13] text-white font-bold py-3 hover:bg-[#0f6a0f] transition inline-flex items-center justify-center gap-2">
                    <FaPlus /> Open Dispute
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-black text-gray-900 mb-4">
                Module Summary
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FaTicketAlt />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Support Tickets</p>
                    <p>
                      Create issues, track status, chat with support, and delete
                      when needed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Dispute Management</p>
                    <p>
                      Open order-related disputes and follow resolution through a
                      discussion thread.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Status Updates</p>
                    <p>
                      Admins and support staff can update statuses directly from
                      the panel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Conversation History</p>
                    <p>
                      Each ticket and dispute has its own message history page.
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