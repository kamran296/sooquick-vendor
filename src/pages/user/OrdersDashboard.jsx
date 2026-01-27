import { useState, useEffect, useRef } from "react";
import {
  LuPackage,
  LuClock9,
  LuTruck,
  // LuCalendar,
  LuSearch,
  LuEye,
  LuX,
} from "react-icons/lu";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import request from "../../axios/requests";
import UserLayout from "../../layouts/user/UserLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  // CardDescription,
  CardContent,
} from "../../components/ui/OrderComponents";
import { FiPlusCircle, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import OrderDetails from "../../components/orders/OrderDetails";
import { setSidebarOpen, setSidebarTab } from "../../redux/slices/sidebarSlice";
import { useDispatch } from "react-redux";
import { formatDateWithoutTime } from "../../utils/helpers";
const OrdersDashboard = () => {
  const [ordersData, setOrdersData] = useState({
    allOrders: [],
    upcomingOrders: [],
    ongoingOrders: [],
    cancelledOrders: [],
    completedOrders: [],
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    cancelled: 0,
    completed: 0,
  });
  // Additional Services State
  const [showAdditionalServiceModal, setShowAdditionalServiceModal] =
    useState(false);
  const [selectedOrderForAdditional, setSelectedOrderForAdditional] =
    useState(null);
  const [addingService, setAddingService] = useState(false);
  const [additionalServiceForm, setAdditionalServiceForm] = useState({
    serviceName: "",
    description: "",
    price: "",
  });

  // OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpOrderId, setOtpOrderId] = useState(null);

  const otpTimerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSidebarTab(2));
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await request.getAllOrders();
      const data = response.data;
      setOrdersData(data);

      // Calculate stats
      setStats({
        total: data.allOrders?.length || 0,
        upcoming: data.upcomingOrders?.length || 0,
        ongoing: data.ongoingOrders?.length || 0,
        cancelled: data.cancelledOrders?.length || 0,
        completed: data.completedOrders?.length || 0,
      });
    } catch (error) {
      console.log("Error fetching all the orders", error);
    } finally {
      setLoading(false);
    }
  };

  const initiateOrderCompletion = async (orderId) => {
    try {
      setCompletingOrder(true);
      const response = await request.initiateOrderCompletion(orderId);

      if (response.status === 200) {
        setOtpOrderId(orderId);
        startOtpTimer();
        // UPDATE ORDER STATUS LOCALLY
        setOrdersData((prev) => ({
          ...prev,
          allOrders: prev.allOrders.map((o) =>
            o._id === orderId ? { ...o, status: "otp_requested" } : o,
          ),
          ongoingOrders: prev.ongoingOrders.map((o) =>
            o._id === orderId ? { ...o, status: "otp_requested" } : o,
          ),
        }));

        toast.success("OTP sent to customer successfully!");
        return true;
      }
    } catch (error) {
      console.error("Error initiating order completion:", error);
      toast.error("Failed to send OTP to customer");
      return false;
    } finally {
      setCompletingOrder(false);
    }
  };

  const verifyOtpAndCompleteOrder = async (orderId, otpCode) => {
    try {
      setOtpLoading(true);
      const response = await request.verifyOrderOtp(orderId, { otp: otpCode });

      if (response.status === 200) {
        setShowOtpModal(false);
        setOtp(["", "", "", ""]);
        setOtpOrderId(null);
        clearOtpTimer();

        // Update order status locally
        setOrdersData((prev) => ({
          ...prev,
          allOrders: prev.allOrders.map((order) =>
            order._id === orderId ? { ...order, status: "completed" } : order,
          ),
          ongoingOrders: prev.ongoingOrders.filter(
            (order) => order._id !== orderId,
          ),
          completedOrders: [
            ...prev.completedOrders,
            prev.allOrders.find((order) => order._id === orderId),
          ],
        }));

        toast.success("Order completed successfully!");
        return true;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response.error.message || "Invalid OTP or verification failed",
      );
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const startOtpTimer = () => {
    clearOtpTimer(); // Clear any existing timer
    setOtpTimer(60); // 5 minutes in seconds

    otpTimerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(otpTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearOtpTimer = () => {
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
      otpTimerRef.current = null;
    }
  };

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!otpOrderId) return;

    try {
      const success = await request.resendOtp(otpOrderId);
      if (success) {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4 && otpOrderId) {
      await verifyOtpAndCompleteOrder(otpOrderId, otpCode);
    } else {
      toast.error("Please enter a valid 4-digit OTP");
    }
  };

  // const openOtpModal = async (order) => {
  //   setSelectedOrder(order);
  //   setOtpOrderId(order._id);

  //   if (order.status === "otp_requested") {
  //     // If OTP was already requested, just open the modal
  //     setShowOtpModal(true);
  //     // Start timer if not already running
  //     if (otpTimer === 0) {
  //       startOtpTimer();
  //     }
  //   } else {
  //     // For other statuses, initiate OTP process
  //     const success = await initiateOrderCompletion(order._id);
  //     if (success) {
  //       setShowOtpModal(true);
  //     }
  //   }
  // };

  const openOtpModal = async (order) => {
    // 🔐 HARD GUARD
    if (completingOrder) return;

    setSelectedOrder(order);
    setOtpOrderId(order._id);

    // OTP already requested → just open modal
    if (order.status === "otp_requested") {
      setShowOtpModal(true);
      if (otpTimer === 0) startOtpTimer();
      return;
    }

    try {
      setCompletingOrder(true);

      const success = await initiateOrderCompletion(order._id);

      if (success) {
        setShowOtpModal(true);
      }
    } finally {
      setCompletingOrder(false);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelMessage("");
    setSelectedOrder(null);
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", ""]);
    setOtpOrderId(null);
    setSelectedOrder(null);
    clearOtpTimer();
    setOtpTimer(0);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-purple-100 text-purple-800",
      otp_requested: "bg-indigo-100 text-indigo-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: <LuClock9 className="h-4 w-4" />,
      paid: <FiCheckCircle className="h-4 w-4" />,
      confirmed: <FiCheckCircle className="h-4 w-4" />,
      in_progress: <LuTruck className="h-4 w-4" />,
      otp_requested: <LuPackage className="h-4 w-4" />,
      completed: <FiCheckCircle className="h-4 w-4" />,
      cancelled: <FiXCircle className="h-4 w-4" />,
      rejected: <FiXCircle className="h-4 w-4" />,
      refunded: <FiAlertCircle className="h-4 w-4" />,
    };
    return statusIcons[status] || <LuPackage className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const filteredOrders = () => {
    let orders = ordersData[`${activeTab}Orders`] || [];

    if (searchTerm) {
      orders = orders.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return orders;
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      clearOtpTimer();
    };
  }, []);

  const tabs = [
    { key: "all", label: "All Orders", count: stats.total, icon: LuPackage },
    {
      key: "upcoming",
      label: "Upcoming",
      count: stats.upcoming,
      icon: LuClock9,
    },
    { key: "ongoing", label: "Ongoing", count: stats.ongoing, icon: LuTruck },
    {
      key: "completed",
      label: "Completed",
      count: stats.completed,
      icon: FiCheckCircle,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: stats.cancelled,
      icon: FiXCircle,
    },
  ];

  const isOtpComplete = otp.every((digit) => digit !== "");

  // --------additional service functions -----------------
  const handleAddAdditionalService = async () => {
    if (!selectedOrderForAdditional) return;

    try {
      setAddingService(true);

      const response = await request.addAdditionalService(
        selectedOrderForAdditional._id,
        additionalServiceForm,
      );

      if (response.status === 200) {
        toast.success("Additional service added successfully!");

        // Refresh orders data
        await fetchAllOrders();

        // Reset and close modal
        setShowAdditionalServiceModal(false);
        setSelectedOrderForAdditional(null);
        setAdditionalServiceForm({
          serviceName: "",
          description: "",
          price: "",
        });
      }
    } catch (error) {
      console.error("Error adding additional service:", error);
      toast.error(
        error.response?.data?.message || "Failed to add additional service",
      );
    } finally {
      setAddingService(false);
    }
  };

  const openAdditionalServiceModal = (order) => {
    // Check if order is in a valid state for adding additional services
    const validStatuses = [
      "confirmed",
      "in_progress",
      "additional_payment_pending",
    ];
    if (!validStatuses.includes(order.status)) {
      toast.error(
        `Cannot add services. Current order status: ${order.status.replace("_", " ")}`,
      );
      return;
    }

    setSelectedOrderForAdditional(order);
    setAdditionalServiceForm({
      serviceName: "",
      description: "",
      price: "",
    });
    setShowAdditionalServiceModal(true);
  };
  return (
    <UserLayout>
      <div className="bg-gray-50 p-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600">Track and manage all your orders</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:mb-0"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <LuPackage className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {ordersData?.allOrders?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <LuClock9 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {ordersData?.upcomingOrders?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <LuTruck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {ordersData?.ongoingOrders?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FiCheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {ordersData?.completedOrders?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="overflow-x-auto">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center border-b-2 px-6 py-4 text-sm font-medium ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-900">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            ) : filteredOrders().length === 0 ? (
              <div className="py-12 text-center">
                <LuPackage className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No orders found
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : `You don't have any ${activeTab} orders yet`}
                </p>
              </div>
            ) : (
              <table className="mt-3 w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders().map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id?.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.serviceDetails?.serviceName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateWithoutTime(
                            order.bookingDate || order.createdAt,
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.serviceDetails?.price || 0)}
                          {order.additionalCosts?.total > 0 && (
                            <div className="text-xs text-purple-600">
                              + {formatCurrency(order.additionalCosts.total)}{" "}
                              additional
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status.replace("_", " ")}
                            </span>
                          </span>
                          {/* Show additional services indicator */}
                          {order.additionalServices &&
                            order.additionalServices.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-600">
                                <FiPlusCircle className="mr-1 h-3 w-3" />
                                {
                                  order.additionalServices.filter(
                                    (s) => s.status === "pending",
                                  ).length
                                }{" "}
                                pending
                                {order.additionalServices.filter(
                                  (s) => s.status === "accepted",
                                ).length > 0 &&
                                  ` • ${order.additionalServices.filter((s) => s.status === "accepted").length} accepted`}
                              </span>
                            )}

                          {/* Show additional payment pending */}
                          {order.status === "additional_payment_pending" &&
                            order.additionalCosts && (
                              <span className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-600">
                                Payment: ${order.additionalCosts.total}
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center text-gray-500 hover:text-gray-900"
                          >
                            <LuEye className="mr-1 h-4 w-4" />
                            View
                          </button>

                          {/* Additional Service Button - Show for valid statuses */}
                          {(order.status === "confirmed" ||
                            order.status === "in_progress" ||
                            order.status === "additional_payment_pending") && (
                            <button
                              disabled={order.status === "completed"}
                              onClick={() => openAdditionalServiceModal(order)}
                              className="flex items-center text-purple-600 hover:text-purple-900"
                              title="Add Additional Service"
                            >
                              <FiPlusCircle className="mr-1 h-4 w-4" />
                              Add Service
                            </button>
                          )}

                          {/* Complete Order Button - Only show for orders that can be completed */}
                          {(order.status === "confirmed" ||
                            order.status === "in_progress" ||
                            order.status === "otp_requested") && (
                            <button
                              onClick={() => openOtpModal(order)}
                              disabled={completingOrder}
                              className={`flex items-center ${
                                completingOrder
                                  ? "cursor-not-allowed text-gray-400"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              <FiCheckCircle className="mr-1 h-4 w-4" />
                              {order.status === "otp_requested"
                                ? "Enter OTP"
                                : "Complete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder &&
          !showCancelModal &&
          !showStatusModal &&
          !showOtpModal && (
            <OrderDetails
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              openOtpModal={openOtpModal}
              completingOrder={completingOrder}
            />
          )}

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-300/30 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Complete Order
                </h3>
                <button
                  onClick={closeOtpModal}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <LuX className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Verification Code
                </h2>
                <p className="mt-1 mb-6 text-sm text-gray-500">
                  OTP has been sent to the customer's email for verification.
                  Please ask the customer to provide the OTP to complete this
                  order.
                </p>

                <div className="mx-auto mb-4 flex w-fit justify-between gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    />
                  ))}
                </div>

                <p className="mb-4 text-center text-sm text-gray-500">
                  {otpTimer > 0 ? (
                    <>
                      Resend in {Math.floor(otpTimer / 60)}:
                      {(otpTimer % 60).toString().padStart(2, "0")}
                    </>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>

                <button
                  onClick={handleVerifyOtp}
                  disabled={!isOtpComplete || otpLoading}
                  className={`w-full rounded-lg py-3 font-semibold text-white transition ${
                    isOtpComplete && !otpLoading
                      ? "bg-green-600 hover:bg-green-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  {otpLoading ? "Verifying..." : "Verify & Complete Order"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Service Modal */}
        {showAdditionalServiceModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-black/30">
            <div className="relative top-20 mx-auto w-full max-w-md rounded-md border bg-white p-5 shadow-lg">
              <div className="mt-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add Additional Service
                  </h3>
                  <button
                    onClick={() => setShowAdditionalServiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Order Info */}
                {selectedOrderForAdditional && (
                  <div className="mt-4 rounded-md bg-blue-50 p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Order ID:</strong> #
                      {selectedOrderForAdditional._id?.slice(-8)}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Service:</strong>{" "}
                      {selectedOrderForAdditional.serviceDetails?.serviceName}
                    </p>
                  </div>
                )}

                {/* Form */}
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={additionalServiceForm.serviceName}
                      onChange={(e) =>
                        setAdditionalServiceForm((prev) => ({
                          ...prev,
                          serviceName: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., Extra Cleaning, Additional Parts, etc."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      value={additionalServiceForm.description}
                      onChange={(e) =>
                        setAdditionalServiceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows="3"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Describe the additional service in detail..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={additionalServiceForm.price}
                        onChange={(e) =>
                          setAdditionalServiceForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  {additionalServiceForm.price && (
                    <div className="rounded-md bg-gray-50 p-3">
                      <p className="text-sm font-medium text-gray-700">
                        Total: ₹{additionalServiceForm.price}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        This amount will be added to the customer's bill
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-3 border-t pt-3">
                  <button
                    onClick={() => setShowAdditionalServiceModal(false)}
                    disabled={addingService}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdditionalService}
                    disabled={
                      addingService ||
                      !additionalServiceForm.serviceName ||
                      !additionalServiceForm.description ||
                      !additionalServiceForm.price
                    }
                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingService ? (
                      <>
                        <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      "Add Service"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default OrdersDashboard;
