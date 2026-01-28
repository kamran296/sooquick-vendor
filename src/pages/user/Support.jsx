import React, { useState, useEffect } from "react";
import {
  FiMessageSquare,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import UserLayout from "../../layouts/user/UserLayout";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
import { useDispatch } from "react-redux";

const Support = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const dispatch = useDispatch();
  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    dispatch(setSidebarTab(4));
  }, []);
  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await request.getAllSupportTickets();
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        // toast.error("Failed to load support tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await request.createSupportTicket(formData);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to create ticket");
      }

      // Add new ticket to list
      const newTicket = response.data.ticket;
      setTickets([newTicket, ...tickets]);
      setFormData({ subject: "", message: "" });
      setShowTicketForm(false);
      setSelectedTicket(newTicket);
      setActiveTab("all");

      toast.success("Support ticket submitted successfully!");
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to submit ticket. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    setSendingMessage(true);
    try {
      // This would be a new API endpoint to add user message to existing ticket
      const response = await request.addMessageToTicket(selectedTicket._id, {
        message: newMessage.trim(),
      });

      if (response.data.success) {
        // Update the selected ticket with new message
        const updatedTicket = response.data.ticket;
        setSelectedTicket(updatedTicket);

        // Also update the ticket in the list
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === updatedTicket._id ? updatedTicket : ticket,
          ),
        );

        setNewMessage("");
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <FiAlertCircle className="text-orange-500" />;
      case "in-progress":
        return <FiClock className="text-blue-500" />;
      case "closed":
        return <FiCheck className="text-green-500" />;
      default:
        return <FiMessageSquare className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-orange-100 text-orange-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastActivity = (ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) {
      return ticket.createdAt;
    }
    return ticket.messages[ticket.messages.length - 1].createdAt;
  };

  const getAdminResponseCount = (ticket) => {
    if (!ticket.messages) return 0;
    return ticket.messages.filter((msg) => msg.senderModel === "Admin").length;
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open") return ticket.status === "open";
    if (activeTab === "in-progress") return ticket.status === "in-progress";
    if (activeTab === "closed") return ticket.status === "closed";
    return true; // "all" tab
  });

  return (
    <UserLayout>
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <BiSupport className="mr-3 text-4xl text-[#0b8263]" />
              <h1 className="text-3xl font-bold text-slate-800">
                Support Center
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Get help with your questions and issues
            </p>
            <div className="mt-1 flex w-full items-center justify-center gap-3 text-xs font-bold text-slate-600">
              <div>
                {" "}
                Email:{" "}
                <a href="mailto:vendorsupport@sooquick.com">
                  vendorsupport@sooquick.com
                </a>
              </div>
              <p
                className="hover:cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText("+919650309376");
                  toast.success("Contact number copied to clipboard!");
                }}
              >
                Contact: +919650309376
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Sidebar - Ticket List */}
            <div className="space-y-6 lg:col-span-2">
              {/* Action Bar */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowTicketForm(!showTicketForm)}
                      className="flex items-center space-x-2 rounded-lg bg-[#0b8263] px-4 py-2 text-white transition-colors hover:bg-emerald-700"
                    >
                      <FiPlus className="text-lg" />
                      <span>New Ticket</span>
                    </button>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "All Tickets" },
                      { id: "open", label: "Open" },
                      { id: "in-progress", label: "In Progress" },
                      { id: "closed", label: "Closed" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-[#0b8263] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* New Ticket Form */}
              {showTicketForm && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-800">
                    Create New Support Ticket
                  </h3>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your issue"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Please describe your issue in detail..."
                        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowTicketForm(false)}
                        className="px-4 py-2 text-slate-600 transition-colors hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 rounded-lg bg-[#0b8263] px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <FiSend className="text-sm" />
                        <span>
                          {loading ? "Submitting..." : "Submit Ticket"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tickets List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
                    <p className="mt-2 text-slate-600">Loading tickets...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white py-8 text-center">
                    <FiMessageSquare className="mx-auto mb-3 text-4xl text-slate-400" />
                    <p className="text-slate-600">No tickets found</p>
                    {!showTicketForm && (
                      <button
                        onClick={() => setShowTicketForm(true)}
                        className="mt-2 text-[#0b8263] hover:text-emerald-700"
                      >
                        Create your first ticket
                      </button>
                    )}
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                        selectedTicket?._id === ticket._id
                          ? "ring-2 ring-[#0b8263]"
                          : ""
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(ticket.status)}
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                              >
                                {ticket.status.charAt(0).toUpperCase() +
                                  ticket.status.slice(1).replace("-", " ")}
                              </span>
                            </span>
                            {ticket.assignedTo && (
                              <span className="text-xs text-slate-500">
                                Assigned
                              </span>
                            )}
                          </div>
                          <h3 className="mb-1 font-semibold text-slate-800">
                            {ticket.subject}
                          </h3>
                          <p className="mb-2 line-clamp-2 text-sm text-slate-600">
                            {ticket.messages && ticket.messages.length > 0
                              ? ticket.messages[0].message
                              : "No messages"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Type: {ticket.type}</span>
                            <span>
                              Last activity:{" "}
                              {formatDate(getLastActivity(ticket))}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {selectedTicket?._id === ticket._id ? (
                            <FiChevronUp className="text-slate-400" />
                          ) : (
                            <FiChevronDown className="text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Messages count */}
                      {ticket.messages && ticket.messages.length > 0 && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <div className="flex items-center space-x-1">
                              <FiMessageSquare className="text-sm" />
                              <span>
                                {ticket.messages.length} message
                                {ticket.messages.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {getAdminResponseCount(ticket) > 0 && (
                              <span className="text-[#0b8263]">
                                {getAdminResponseCount(ticket)} admin response
                                {getAdminResponseCount(ticket) !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar - Ticket Details */}
            <div className="lg:col-span-1">
              {selectedTicket ? (
                <div className="sticky top-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">
                        Ticket Details
                      </h3>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedTicket.status)}`}
                      >
                        {selectedTicket.status.replace("-", " ")}
                      </span>
                      <span className="text-xs text-slate-500">
                        Created {formatDate(selectedTicket.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-96 space-y-4 overflow-y-auto p-4">
                    {/* Messages History */}
                    {selectedTicket.messages &&
                    selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-3 ${
                            message.senderModel === "User"
                              ? "bg-slate-50"
                              : "bg-[#0b8263]/10"
                          }`}
                        >
                          <div className="mb-2 flex items-center space-x-2">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                message.senderModel === "User"
                                  ? "bg-slate-300"
                                  : "bg-[#0b8263]"
                              }`}
                            >
                              {message.senderModel === "User" ? (
                                <FiUser className="text-xs text-slate-600" />
                              ) : (
                                <span className="text-xs font-medium text-white">
                                  S
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {message.senderModel === "User"
                                ? "You"
                                : "Support Team"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {message.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center">
                        <FiMessageSquare className="mx-auto mb-2 text-2xl text-slate-400" />
                        <p className="text-sm text-slate-500">
                          No messages yet
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedTicket.status !== "closed" && (
                    <div className="border-t border-slate-200 p-4">
                      <form onSubmit={handleSendMessage} className="space-y-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          rows="3"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sendingMessage}
                          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#0b8263] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <FiSend className="text-sm" />
                          {sendingMessage ? "Sending..." : "Send Message"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <FiMessageSquare className="mx-auto mb-3 text-3xl text-slate-400" />
                  <h3 className="mb-2 font-semibold text-slate-700">
                    No Ticket Selected
                  </h3>
                  <p className="text-sm text-slate-500">
                    Select a ticket from the list to view details and responses
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Support;
