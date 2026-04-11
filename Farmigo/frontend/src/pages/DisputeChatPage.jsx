import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import { apiGet, apiPost, apiPut } from "../utils/api";

const DisputeChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatEndRef = useRef(null);

  const [user, setUser] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [statusValue, setStatusValue] = useState("Open");
  const [resolutionNote, setResolutionNote] = useState("");
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
    if (user) loadDisputeAndMessages();
  }, [user, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDisputeAndMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const disputeList = await apiGet(isStaff ? "/disputes/admin" : "/disputes/my");
      const foundDispute = (disputeList || []).find((item) => item._id === id);

      if (!foundDispute) {
        setError("Dispute not found or you are not authorized");
        setLoading(false);
        return;
      }

      setDispute(foundDispute);
      setStatusValue(foundDispute.status);
      setResolutionNote(foundDispute.resolutionNote || "");

      const messageData = await apiGet(`/disputes/${id}/messages`);
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (err) {
      setError(err.message || "Failed to load dispute chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setSending(true);
      await apiPost(`/disputes/${id}/messages`, { message: messageText });
      setMessageText("");
      setSuccess("Message sent");
      loadDisputeAndMessages();
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await apiPut(`/disputes/${id}/status`, {
        status: statusValue,
        resolutionNote,
      });
      setSuccess("Dispute updated successfully");
      loadDisputeAndMessages();
    } catch (err) {
      setError(err.message || "Failed to update dispute");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f4f8f5] relative overflow-hidden">
      <div className="absolute top-[0%] left-[20%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#ccff00]/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-8 py-10 relative z-10">
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

        {loading ? (
          <div className="text-gray-500 font-medium">Loading dispute...</div>
        ) : !dispute ? (
          <div className="rounded-[32px] bg-white border border-gray-100 p-6 shadow-sm">
            Dispute not found.
          </div>
        ) : (
          <>
            <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden group mb-8">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-start gap-5">
                  <Link
                    to="/support?tab=disputes"
                    className="w-14 h-14 rounded-[20px] bg-white text-gray-700 border border-gray-200 shadow-sm flex items-center justify-center hover:text-[#137f13] hover:border-[#137f13] transition no-underline mt-1"
                  >
                    <FaArrowLeft />
                  </Link>

                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 border border-emerald-200/50 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-5">
                      <FaExclamationTriangle className="text-sm" /> Dispute Conversation
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
                      Dispute <br /> Chat
                    </h1>
                    <p className="text-gray-500 font-bold max-w-sm leading-relaxed text-sm">
                      Review order-related issues, discuss resolutions, and maintain clear communication.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-6 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <h2 className="text-xl font-black text-gray-900 mb-5">{dispute.reason}</h2>

                  <div className="space-y-3 text-sm text-gray-600 font-medium">
                    <p>
                      <span className="font-black text-gray-800">Description:</span>{" "}
                      {dispute.description}
                    </p>
                    <p>
                      <span className="font-black text-gray-800">Order ID:</span>{" "}
                      {dispute.order?._id || dispute.order || "-"}
                    </p>
                    <p>
                      <span className="font-black text-gray-800">Status:</span>{" "}
                      {dispute.status}
                    </p>
                    <p>
                      <span className="font-black text-gray-800">Opened By:</span>{" "}
                      {dispute.openedBy?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-black text-gray-800">Created:</span>{" "}
                      {dispute.createdAt ? new Date(dispute.createdAt).toLocaleString() : "-"}
                    </p>
                    {dispute.resolutionNote && (
                      <p>
                        <span className="font-black text-gray-800">Resolution Note:</span>{" "}
                        {dispute.resolutionNote}
                      </p>
                    )}
                  </div>

                  {isStaff && (
                    <div className="mt-6 space-y-3">
                      <label className="block text-sm font-black text-gray-700">
                        Update Status
                      </label>
                      <select
                        value={statusValue}
                        onChange={(e) => setStatusValue(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-[#f8faf8] px-4 py-3 outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10"
                      >
                        <option>Open</option>
                        <option>Under Review</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>

                      <textarea
                        rows="4"
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-[#f8faf8] px-4 py-3 outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10 resize-none"
                        placeholder="Add resolution note"
                      />

                      <button
                        onClick={handleUpdateStatus}
                        className="w-full rounded-2xl bg-[#ccff00] text-[#1c2a1c] font-black py-3 hover:scale-[1.01] transition shadow-lg"
                      >
                        Save Dispute Update
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="xl:col-span-2">
                <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-5 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col h-[72vh]">
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center text-gray-500 font-medium">
                        No messages yet. Start the dispute conversation.
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const mine =
                          msg.sender?._id === user.userId || msg.sender?._id === user._id;

                        return (
                          <div
                            key={msg._id}
                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-[24px] px-4 py-3 shadow-sm ${
                                mine
                                  ? "bg-[#1c2a1c] text-white"
                                  : "bg-[#f5f7f6] text-gray-800 border border-gray-200"
                              }`}
                            >
                              <div className="text-xs font-black mb-1 opacity-80">
                                {msg.sender?.name || "Unknown"} · {msg.senderRole}
                              </div>
                              <p className="text-sm leading-relaxed mb-2 font-medium">
                                {msg.message}
                              </p>
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
                      className="flex-1 rounded-2xl border border-gray-200 bg-[#f8faf8] px-4 py-3 outline-none focus:border-[#137f13] focus:ring-4 focus:ring-[#137f13]/10"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="rounded-2xl bg-[#1c2a1c] text-[#ccff00] px-5 py-3 font-black hover:opacity-95 transition inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      <FaPaperPlane /> {sending ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DisputeChatPage;