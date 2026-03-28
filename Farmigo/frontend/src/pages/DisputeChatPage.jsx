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
    if (user) {
      loadDisputeAndMessages();
    }
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
      await apiPost(`/disputes/${id}/messages`, {
        message: messageText,
      });
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
            <div className="w-11 h-11 rounded-2xl bg-red-500 text-white flex items-center justify-center">
              <FaExclamationTriangle />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Dispute Conversation</h1>
              <p className="text-sm text-gray-500">Discuss and resolve order-related issues</p>
            </div>
          </div>
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
          <div className="text-gray-500 font-medium">Loading dispute...</div>
        ) : !dispute ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-6">
            Dispute not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5">
                <h2 className="text-lg font-black text-gray-900 mb-4">{dispute.reason}</h2>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <span className="font-bold text-gray-800">Description:</span>{" "}
                    {dispute.description}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Order ID:</span>{" "}
                    {dispute.order?._id || dispute.order || "-"}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Status:</span>{" "}
                    {dispute.status}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Opened By:</span>{" "}
                    {dispute.openedBy?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Created:</span>{" "}
                    {dispute.createdAt ? new Date(dispute.createdAt).toLocaleString() : "-"}
                  </p>
                  {dispute.resolutionNote && (
                    <p>
                      <span className="font-bold text-gray-800">Resolution Note:</span>{" "}
                      {dispute.resolutionNote}
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
                      <option>Under Review</option>
                      <option>Resolved</option>
                      <option>Rejected</option>
                    </select>

                    <textarea
                      rows="4"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#137f13] resize-none"
                      placeholder="Add resolution note"
                    />

                    <button
                      onClick={handleUpdateStatus}
                      className="w-full rounded-2xl bg-[#137f13] text-white font-bold py-3 hover:bg-[#0f6a0f] transition"
                    >
                      Save Dispute Update
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
                      No messages yet. Start the dispute conversation.
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

export default DisputeChatPage;