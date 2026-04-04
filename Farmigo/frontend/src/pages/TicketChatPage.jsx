import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaTicketAlt, FaTrash } from "react-icons/fa";
import { apiDelete, apiGet, apiPost, apiPut } from "../utils/api";

const TicketChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatEndRef = useRef(null);

  const [user, setUser] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [statusValue, setStatusValue] = useState("Open");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      loadTicketAndMessages();
    }
  }, [user, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadTicketAndMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const ticketList = await apiGet(isStaff ? "/tickets/admin" : "/tickets");
      const foundTicket = (ticketList || []).find((item) => item._id === id);

      if (!foundTicket) {
        setError("Ticket not found or you are not authorized");
        setLoading(false);
        return;
      }

      setTicket(foundTicket);
      setStatusValue(foundTicket.status);

      const messageData = await apiGet(`/tickets/${id}/messages`);
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (err) {
      setError(err.message || "Failed to load ticket chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    try {
      setSending(true);
      await apiPost(`/tickets/${id}/messages`, {
        message: messageText,
      });
      setMessageText("");
      setSuccess("Message sent");
      loadTicketAndMessages();
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await apiPut(`/tickets/${id}`, { status: statusValue });
      setSuccess("Ticket status updated");
      loadTicketAndMessages();
    } catch (err) {
      setError(err.message || "Failed to update ticket status");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this ticket?");
    if (!ok) return;

    try {
      await apiDelete(`/tickets/${id}`);
      navigate("/support");
    } catch (err) {
      setError(err.message || "Failed to delete ticket");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/support"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#137f13] hover:border-[#137f13] transition no-underline"
            >
              <FaArrowLeft />
            </Link>
            <div className="w-11 h-11 rounded-2xl bg-[#137f13] text-white flex items-center justify-center">
              <FaTicketAlt />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Ticket Conversation</h1>
              <p className="text-sm text-gray-500">Chat with support and track ticket status</p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-100 transition inline-flex items-center gap-2"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 font-medium">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-gray-500 font-medium">Loading ticket...</div>
        ) : !ticket ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-6">
            Ticket not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5">
                <h2 className="text-lg font-black text-gray-900 mb-4">{ticket.subject}</h2>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-bold text-gray-800">Description:</span>{" "}
                    {ticket.description}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Priority:</span>{" "}
                    {ticket.priority}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Status:</span>{" "}
                    {ticket.status}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Created:</span>{" "}
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "-"}
                  </p>
                  {ticket.user && (
                    <p>
                      <span className="font-bold text-gray-800">Owner:</span>{" "}
                      {ticket.user.name} ({ticket.user.email})
                    </p>
                  )}
                </div>

                {isStaff && (
                  <div className="mt-5 space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                      Update Status
                    </label>
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13]"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Closed</option>
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      className="w-full rounded-2xl bg-[#137f13] text-white font-bold py-3 hover:bg-[#0f6a0f] transition"
                    >
                      Save Status
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 flex flex-col h-[70vh]">
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-gray-500">
                      No messages yet. Start the conversation.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const mine =
                        msg.sender?._id === user.userId ||
                        msg.sender?._id === user._id;

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-[20px] px-4 py-3 shadow-sm ${
                              mine
                                ? "bg-[#137f13] text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="text-xs font-bold mb-1 opacity-80">
                              {msg.sender?.name || "Unknown"} · {msg.senderRole}
                            </div>
                            <p className="text-sm leading-relaxed mb-2">{msg.message}</p>
                            <div className="text-[11px] opacity-70">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleString()
                                : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13]"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-2xl bg-[#137f13] text-white px-5 py-3 font-bold hover:bg-[#0f6a0f] transition inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <FaPaperPlane /> {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketChatPage;