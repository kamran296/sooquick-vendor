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
  FiSearch,
  FiUsers,
  FiArchive,
  FiX,
} from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import UserLayout from "../../layouts/user/UserLayout";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
import { useDispatch } from "react-redux";

// const Support = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [showTicketForm, setShowTicketForm] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const dispatch = useDispatch();
//   // Form state
//   const [formData, setFormData] = useState({
//     subject: "",
//     message: "",
//   });

//   useEffect(() => {
//     dispatch(setSidebarTab(4));
//   }, []);
//   // Fetch tickets from API
//   useEffect(() => {
//     const fetchTickets = async () => {
//       setLoading(true);
//       try {
//         const response = await request.getAllSupportTickets();
//         setTickets(response.data.tickets || []);
//       } catch (error) {
//         console.error("Failed to fetch tickets:", error);
//         // toast.error("Failed to load support tickets");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const handleSubmitTicket = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await request.createSupportTicket(formData);

//       if (!response.data.success) {
//         throw new Error(response.data.error || "Failed to create ticket");
//       }

//       // Add new ticket to list
//       const newTicket = response.data.ticket;
//       setTickets([newTicket, ...tickets]);
//       setFormData({ subject: "", message: "" });
//       setShowTicketForm(false);
//       setSelectedTicket(newTicket);
//       setActiveTab("all");

//       toast.success("Support ticket submitted successfully!");
//     } catch (error) {
//       console.error("Failed to submit ticket:", error);
//       toast.error(
//         error.response?.data?.error ||
//           "Failed to submit ticket. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedTicket) return;
//     setSendingMessage(true);
//     try {
//       // This would be a new API endpoint to add user message to existing ticket
//       const response = await request.addMessageToTicket(selectedTicket._id, {
//         message: newMessage.trim(),
//       });

//       if (response.data.success) {
//         // Update the selected ticket with new message
//         const updatedTicket = response.data.ticket;
//         setSelectedTicket(updatedTicket);

//         // Also update the ticket in the list
//         setTickets((prevTickets) =>
//           prevTickets.map((ticket) =>
//             ticket._id === updatedTicket._id ? updatedTicket : ticket,
//           ),
//         );

//         setNewMessage("");
//         toast.success("Message sent successfully!");
//       }
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       toast.error("Failed to send message. Please try again.");
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "open":
//         return <FiAlertCircle className="text-orange-500" />;
//       case "in-progress":
//         return <FiClock className="text-blue-500" />;
//       case "closed":
//         return <FiCheck className="text-green-500" />;
//       default:
//         return <FiMessageSquare className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "open":
//         return "bg-orange-100 text-orange-800";
//       case "in-progress":
//         return "bg-blue-100 text-blue-800";
//       case "closed":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getLastActivity = (ticket) => {
//     if (!ticket.messages || ticket.messages.length === 0) {
//       return ticket.createdAt;
//     }
//     return ticket.messages[ticket.messages.length - 1].createdAt;
//   };

//   const getAdminResponseCount = (ticket) => {
//     if (!ticket.messages) return 0;
//     return ticket.messages.filter((msg) => msg.senderModel === "Admin").length;
//   };

//   const filteredTickets = tickets.filter((ticket) => {
//     if (activeTab === "open") return ticket.status === "open";
//     if (activeTab === "in-progress") return ticket.status === "in-progress";
//     if (activeTab === "closed") return ticket.status === "closed";
//     return true; // "all" tab
//   });

//   return (
//     <UserLayout>
//       <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-5xl">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <div className="mb-4 flex items-center justify-center">
//               <BiSupport className="mr-3 text-4xl text-[#0b8263]" />
//               <h1 className="text-3xl font-bold text-slate-800">
//                 Support Center
//               </h1>
//             </div>
//             <p className="text-lg text-slate-600">
//               Get help with your questions and issues
//             </p>
//             <div className="mt-1 flex w-full items-center justify-center gap-3 text-xs font-bold text-slate-600">
//               <div>
//                 {" "}
//                 Email:{" "}
//                 <a href="mailto:vendorsupport@sooquick.com">
//                   vendorsupport@sooquick.com
//                 </a>
//               </div>
//               <p
//                 className="hover:cursor-pointer"
//                 onClick={() => {
//                   navigator.clipboard.writeText("+919650309376");
//                   toast.success("Contact number copied to clipboard!");
//                 }}
//               >
//                 Contact: +919650309376
//               </p>
//             </div>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//             {/* Left Sidebar - Ticket List */}
//             <div className="space-y-6 lg:col-span-2">
//               {/* Action Bar */}
//               <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
//                 <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setShowTicketForm(!showTicketForm)}
//                       className="flex items-center space-x-2 rounded-lg bg-[#0b8263] px-4 py-2 text-white transition-colors hover:bg-emerald-700"
//                     >
//                       <FiPlus className="text-lg" />
//                       <span>New Ticket</span>
//                     </button>
//                   </div>

//                   {/* Filter Tabs */}
//                   <div className="flex flex-wrap gap-2">
//                     {[
//                       { id: "all", label: "All Tickets" },
//                       { id: "open", label: "Open" },
//                       { id: "in-progress", label: "In Progress" },
//                       { id: "closed", label: "Closed" },
//                     ].map((tab) => (
//                       <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
//                           activeTab === tab.id
//                             ? "bg-[#0b8263] text-white"
//                             : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                         }`}
//                       >
//                         {tab.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* New Ticket Form */}
//               {showTicketForm && (
//                 <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//                   <h3 className="mb-4 text-lg font-semibold text-slate-800">
//                     Create New Support Ticket
//                   </h3>
//                   <form onSubmit={handleSubmitTicket} className="space-y-4">
//                     <div>
//                       <label className="mb-2 block text-sm font-medium text-slate-700">
//                         Subject
//                       </label>
//                       <input
//                         type="text"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleInputChange}
//                         placeholder="Brief description of your issue"
//                         className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-medium text-slate-700">
//                         Message
//                       </label>
//                       <textarea
//                         name="message"
//                         value={formData.message}
//                         onChange={handleInputChange}
//                         rows="4"
//                         placeholder="Please describe your issue in detail..."
//                         className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
//                         required
//                       />
//                     </div>

//                     <div className="flex justify-end space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => setShowTicketForm(false)}
//                         className="px-4 py-2 text-slate-600 transition-colors hover:text-slate-800"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="flex items-center space-x-2 rounded-lg bg-[#0b8263] px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
//                       >
//                         <FiSend className="text-sm" />
//                         <span>
//                           {loading ? "Submitting..." : "Submit Ticket"}
//                         </span>
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {/* Tickets List */}
//               <div className="space-y-4">
//                 {loading ? (
//                   <div className="py-8 text-center">
//                     <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
//                     <p className="mt-2 text-slate-600">Loading tickets...</p>
//                   </div>
//                 ) : filteredTickets.length === 0 ? (
//                   <div className="rounded-lg border border-slate-200 bg-white py-8 text-center">
//                     <FiMessageSquare className="mx-auto mb-3 text-4xl text-slate-400" />
//                     <p className="text-slate-600">No tickets found</p>
//                     {!showTicketForm && (
//                       <button
//                         onClick={() => setShowTicketForm(true)}
//                         className="mt-2 text-[#0b8263] hover:text-emerald-700"
//                       >
//                         Create your first ticket
//                       </button>
//                     )}
//                   </div>
//                 ) : (
//                   filteredTickets.map((ticket) => (
//                     <div
//                       key={ticket._id}
//                       className={`cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
//                         selectedTicket?._id === ticket._id
//                           ? "ring-2 ring-[#0b8263]"
//                           : ""
//                       }`}
//                       onClick={() => setSelectedTicket(ticket)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="mb-2 flex items-center space-x-3">
//                             <span className="flex items-center space-x-1">
//                               {getStatusIcon(ticket.status)}
//                               <span
//                                 className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
//                               >
//                                 {ticket.status.charAt(0).toUpperCase() +
//                                   ticket.status.slice(1).replace("-", " ")}
//                               </span>
//                             </span>
//                             {ticket.assignedTo && (
//                               <span className="text-xs text-slate-500">
//                                 Assigned
//                               </span>
//                             )}
//                           </div>
//                           <h3 className="mb-1 font-semibold text-slate-800">
//                             {ticket.subject}
//                           </h3>
//                           <p className="mb-2 line-clamp-2 text-sm text-slate-600">
//                             {ticket.messages && ticket.messages.length > 0
//                               ? ticket.messages[0].message
//                               : "No messages"}
//                           </p>
//                           <div className="flex items-center justify-between text-xs text-slate-500">
//                             <span>Type: {ticket.type}</span>
//                             <span>
//                               Last activity:{" "}
//                               {formatDate(getLastActivity(ticket))}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           {selectedTicket?._id === ticket._id ? (
//                             <FiChevronUp className="text-slate-400" />
//                           ) : (
//                             <FiChevronDown className="text-slate-400" />
//                           )}
//                         </div>
//                       </div>

//                       {/* Messages count */}
//                       {ticket.messages && ticket.messages.length > 0 && (
//                         <div className="mt-3 border-t border-slate-100 pt-3">
//                           <div className="flex items-center justify-between text-sm text-slate-600">
//                             <div className="flex items-center space-x-1">
//                               <FiMessageSquare className="text-sm" />
//                               <span>
//                                 {ticket.messages.length} message
//                                 {ticket.messages.length !== 1 ? "s" : ""}
//                               </span>
//                             </div>
//                             {getAdminResponseCount(ticket) > 0 && (
//                               <span className="text-[#0b8263]">
//                                 {getAdminResponseCount(ticket)} admin response
//                                 {getAdminResponseCount(ticket) !== 1 ? "s" : ""}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Right Sidebar - Ticket Details */}
//             <div className="lg:col-span-1">
//               {selectedTicket ? (
//                 <div className="sticky top-4 rounded-lg border border-slate-200 bg-white shadow-sm">
//                   <div className="border-b border-slate-200 p-4">
//                     <div className="mb-2 flex items-center justify-between">
//                       <h3 className="font-semibold text-slate-800">
//                         Ticket Details
//                       </h3>
//                       <button
//                         onClick={() => setSelectedTicket(null)}
//                         className="text-slate-400 hover:text-slate-600"
//                       >
//                         ×
//                       </button>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedTicket.status)}`}
//                       >
//                         {selectedTicket.status.replace("-", " ")}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         Created {formatDate(selectedTicket.createdAt)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="max-h-96 space-y-4 overflow-y-auto p-4">
//                     {/* Messages History */}
//                     {selectedTicket.messages &&
//                     selectedTicket.messages.length > 0 ? (
//                       selectedTicket.messages.map((message, index) => (
//                         <div
//                           key={index}
//                           className={`rounded-lg p-3 ${
//                             message.senderModel === "User"
//                               ? "bg-slate-50"
//                               : "bg-[#0b8263]/10"
//                           }`}
//                         >
//                           <div className="mb-2 flex items-center space-x-2">
//                             <div
//                               className={`flex h-6 w-6 items-center justify-center rounded-full ${
//                                 message.senderModel === "User"
//                                   ? "bg-slate-300"
//                                   : "bg-[#0b8263]"
//                               }`}
//                             >
//                               {message.senderModel === "User" ? (
//                                 <FiUser className="text-xs text-slate-600" />
//                               ) : (
//                                 <span className="text-xs font-medium text-white">
//                                   S
//                                 </span>
//                               )}
//                             </div>
//                             <span className="text-sm font-medium text-slate-700">
//                               {message.senderModel === "User"
//                                 ? "You"
//                                 : "Support Team"}
//                             </span>
//                             <span className="text-xs text-slate-500">
//                               {formatDate(message.createdAt)}
//                             </span>
//                           </div>
//                           <p className="text-sm text-slate-700">
//                             {message.message}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="py-4 text-center">
//                         <FiMessageSquare className="mx-auto mb-2 text-2xl text-slate-400" />
//                         <p className="text-sm text-slate-500">
//                           No messages yet
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {selectedTicket.status !== "closed" && (
//                     <div className="border-t border-slate-200 p-4">
//                       <form onSubmit={handleSendMessage} className="space-y-3">
//                         <textarea
//                           value={newMessage}
//                           onChange={(e) => setNewMessage(e.target.value)}
//                           placeholder="Type your message..."
//                           rows="3"
//                           className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
//                         />
//                         <button
//                           type="submit"
//                           disabled={!newMessage.trim() || sendingMessage}
//                           className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#0b8263] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
//                         >
//                           <FiSend className="text-sm" />
//                           {sendingMessage ? "Sending..." : "Send Message"}
//                         </button>
//                       </form>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
//                   <FiMessageSquare className="mx-auto mb-3 text-3xl text-slate-400" />
//                   <h3 className="mb-2 font-semibold text-slate-700">
//                     No Ticket Selected
//                   </h3>
//                   <p className="text-sm text-slate-500">
//                     Select a ticket from the list to view details and responses
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </UserLayout>
//   );
// };

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketLoading, setSelectedTicketLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    dispatch(setSidebarTab(5));
  }, [dispatch]);

  // Build query params
  const buildQueryParams = (page = 1) => {
    const params = {
      page,
      limit: 20,
    };

    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;

    return params;
  };

  // Fetch tickets from API
  const fetchTickets = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = buildQueryParams(page);
        console.log(params, "params");
        const response = await request.getAllSupportTickets(params);

        if (response.data.success) {
          setTickets(response.data.tickets || []);
          setPagination(
            response.data.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalTickets: 0,
              hasNext: false,
              hasPrev: false,
            },
          );
        } else {
          toast.error(response.data.message || "Failed to fetch tickets");
          setTickets([]);
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        // toast.error(
        //   error.response?.data?.error || "Failed to load support tickets",
        // );
        setTickets([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.status, filters.type, debouncedSearch],
  );

  // Fetch individual ticket details
  const fetchTicketDetails = useCallback(async (ticketId) => {
    if (!ticketId) return;

    setSelectedTicketLoading(true);
    try {
      const response = await request.getTicketById(ticketId);

      if (response.data.success) {
        setSelectedTicket(response.data.ticket);

        // Update the ticket in the list
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === ticketId ? response.data.ticket : ticket,
          ),
        );
      } else {
        toast.error(response.data.message || "Failed to load ticket details");
      }
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      toast.error(
        error.response?.data?.error || "Failed to load ticket details",
      );
    } finally {
      setSelectedTicketLoading(false);
    }
  }, []);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchTickets(1);
  }, [filters.status, filters.type, fetchTickets]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 1000); // debounce delay

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (key === "search") {
      setSelectedTicket(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // fetchTickets(1);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setSendingMessage(true);
    try {
      const response = await request.addMessageToTicket(selectedTicket._id, {
        message: newMessage.trim(),
      });

      if (response.data.success) {
        await fetchTicketDetails(selectedTicket._id);
        setNewMessage("");
        toast.success("Message sent successfully!");

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    setClosingTicket(true);
    try {
      const response = await request.closeSupportTicket(selectedTicket._id);

      if (response.data.success) {
        await fetchTicketDetails(selectedTicket._id);
        toast.success("Ticket closed successfully!");
      } else {
        toast.error(response.data.message || "Failed to close ticket");
      }
    } catch (error) {
      console.error("Failed to close ticket:", error);
      toast.error(error.response?.data?.error || "Failed to close ticket");
    } finally {
      setClosingTicket(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedTicket) return;

    try {
      const response = await request.assignTicket(selectedTicket._id);

      if (response.data.success) {
        await fetchTicketDetails(selectedTicket._id);
        toast.success("Ticket assigned to you!");
      } else {
        toast.error(response.data.message || "Failed to assign ticket");
      }
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      toast.error(error.response?.data?.error || "Failed to assign ticket");
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    fetchTicketDetails(ticket._id);
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
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "User":
        return <FiUsers className="text-purple-500" />;
      case "Vendor":
        return <FiShoppingBag className="text-teal-500" />;
      default:
        return <FiUser className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "User":
        return "text-purple-600 bg-purple-50";
      case "Vendor":
        return "text-teal-600 bg-teal-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get user name (handles both string ID and object)
  const getUserName = (user) => {
    if (!user) return "Unknown User";
    if (typeof user === "string") return user; // Just return the ID if that's all we have
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "Unknown User"
    );
  };

  // Helper function to get user email
  const getUserEmail = (user) => {
    if (!user) return "";
    if (typeof user === "string") return "";
    return user.email || "";
  };

  // Get the last activity date (last message or ticket creation)
  const getLastActivity = (ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) {
      return ticket.createdAt;
    }
    return ticket.messages[ticket.messages.length - 1].createdAt;
  };

  // Get unread admin messages count (assuming admin messages have senderModel !== "User")
  const getUnreadAdminCount = (ticket) => {
    if (!ticket.messages) return 0;
    // This logic depends on your API - adjust based on how you track unread/admin messages
    return ticket.messages.filter(
      (msg) => msg.senderModel === "User" && !msg.isRead,
    ).length;
  };

  // Get the latest message content
  const getLatestMessage = (ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) {
      return "No messages";
    }
    const latest = ticket.messages[ticket.messages.length - 1];
    return latest.message || "No message content";
  };

  // Check if message is from admin
  const isAdminMessage = (message) => {
    return (
      message.senderModel !== "User" ||
      message.sender?._id !== ticket?.createdBy?._id
    );
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (selectedTicket?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages]);

  return (
    <RootLayout>
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BiSupport className="text-4xl text-[#0b8263]" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Support Management
                  </h1>
                  <p className="text-slate-600">
                    Manage and respond to user and vendor support tickets
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#0b8263]">
                  {pagination.totalTickets}
                </div>
                <div className="text-sm text-slate-500">Total Tickets</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left Sidebar - Ticket List */}
            <div className="space-y-6 lg:col-span-2">
              {/* Filters */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by subject or user..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                      />
                    </div>
                  </form>

                  {/* Status Filter */}
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="User">User</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
                    <p className="mt-2 text-slate-600">Loading tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white py-12 text-center">
                    <FiMessageSquare className="mx-auto mb-3 text-4xl text-slate-400" />
                    <p className="text-slate-600">No tickets found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {filters.status || filters.type || filters.search
                        ? "Try changing your filters"
                        : "No support tickets yet"}
                    </p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                        selectedTicket?._id === ticket._id
                          ? "border-[#0b8263] ring-2 ring-[#0b8263]"
                          : "border-slate-200"
                      }`}
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(ticket.status)}
                              <span
                                className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                              >
                                {ticket.status.replace("-", " ")}
                              </span>
                            </span>
                            <span
                              className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(ticket.createdByModel)}`}
                            >
                              {getTypeIcon(ticket.createdByModel)}
                              <span>{ticket.createdByModel}</span>
                            </span>
                            {getUnreadAdminCount(ticket) > 0 && (
                              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                {getUnreadAdminCount(ticket)} new
                              </span>
                            )}
                          </div>

                          <h3 className="mb-1 truncate font-semibold text-slate-800">
                            {ticket.subject}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {ticket.customSupportId}
                          </p>

                          <div className="mb-2 flex items-center space-x-2 text-sm text-slate-600">
                            <span className="flex items-center space-x-1">
                              <FiUser className="text-slate-400" />
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (ticket.createdByModel === "User") {
                                    navigate(`/user/${ticket.createdBy._id}`);
                                  } else {
                                    navigate(`/vendor/${ticket.createdBy._id}`);
                                  }
                                }}
                                className="hover:cursor-pointer hover:text-blue-500"
                              >
                                {getUserName(ticket.createdBy)}
                              </span>
                            </span>
                            <span>•</span>
                            <span>{getUserEmail(ticket.createdBy)}</span>
                          </div>

                          <p className="mb-2 line-clamp-2 text-sm text-slate-600">
                            {getLatestMessage(ticket)}
                          </p>

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{ticket.messages?.length || 0} messages</span>
                            <span>
                              Last: {formatDate(getLastActivity(ticket))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <button
                    onClick={() => fetchTickets(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-slate-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => fetchTickets(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar - Ticket Details */}
            <div className="lg:col-span-2">
              {selectedTicketLoading ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
                  <p className="mt-4 text-slate-600">
                    Loading ticket details...
                  </p>
                </div>
              ) : selectedTicket ? (
                <div className="sticky top-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                  {/* Header */}
                  <div className="border-b border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {selectedTicket.subject}
                          </h3>
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(selectedTicket.status)}`}
                          >
                            {selectedTicket.status.replace("-", " ")}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(selectedTicket.createdByModel)}
                            <span>{selectedTicket.createdByModel} Ticket</span>
                          </div>
                          <span>•</span>
                          <span>
                            Created: {formatDate(selectedTicket.createdAt)}
                          </span>
                          {selectedTicket.closedAt && (
                            <>
                              <span>•</span>
                              <span>
                                Closed: {formatDate(selectedTicket.closedAt)}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mt-2 flex items-center space-x-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <FiUser className="text-slate-400" />
                            <span className="font-medium text-slate-700 hover:cursor-pointer">
                              {getUserName(selectedTicket.createdBy)}
                            </span>
                            <span className="text-slate-500">
                              ({getUserEmail(selectedTicket.createdBy)})
                            </span>
                          </div>
                        </div>

                        {selectedTicket.assignedTo && (
                          <div className="mt-2 flex items-center space-x-2 text-sm">
                            <span className="text-slate-500">Assigned to:</span>
                            <span className="font-medium text-slate-700">
                              {selectedTicket.assignedTo?.firstName}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <FiX className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="max-h-[500px] space-y-4 overflow-y-auto p-4">
                    {/* Messages List */}
                    {selectedTicket.messages &&
                    selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages.map((message, index) => {
                        const isAdminMsg = message?.sender.role === "admin";
                        const senderName = isAdminMsg
                          ? "Admin"
                          : getUserName(
                              message.sender || selectedTicket.createdBy,
                            );

                        return (
                          <div
                            key={message._id || index}
                            className={`rounded-lg p-4 ${
                              isAdminMsg
                                ? "border border-[#0b8263]/20 bg-[#0b8263]/10"
                                : "bg-slate-50"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isAdminMsg ? "bg-[#0b8263]" : "bg-slate-300"
                                  }`}
                                >
                                  {isAdminMsg ? (
                                    <span className="text-sm font-medium text-white">
                                      A
                                    </span>
                                  ) : (
                                    <FiUser className="text-slate-600" />
                                  )}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-slate-700">
                                    {senderName}
                                  </span>
                                  <span className="ml-2 text-xs text-slate-500">
                                    {isAdminMsg
                                      ? "(Admin)"
                                      : `(${selectedTicket.createdByModel})`}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap text-slate-700">
                              {message.message}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center">
                        <FiMessageSquare className="mx-auto mb-2 text-3xl text-slate-400" />
                        <p className="text-slate-500">No messages yet</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  {selectedTicket.status !== "closed" && (
                    <div className="border-t border-slate-200 p-4">
                      <form onSubmit={handleSendMessage} className="space-y-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your response..."
                          rows="3"
                          disabled={sendingMessage}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none disabled:opacity-50"
                        />
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-500">
                            Replying as Admin
                          </span>
                          <button
                            type="submit"
                            disabled={!newMessage.trim() || sendingMessage}
                            className="flex items-center space-x-2 rounded-lg bg-[#0b8263] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <FiSend className="text-sm" />
                            <span>
                              {sendingMessage ? "Sending..." : "Send Response"}
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <FiMessageSquare className="mx-auto mb-3 text-4xl text-slate-400" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-700">
                    No Ticket Selected
                  </h3>
                  <p className="text-slate-500">
                    Select a ticket from the list to view details and respond
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};
export default Support;
