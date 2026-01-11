import React, { useEffect, useState } from "react";
import UserLayout from "../../layouts/user/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import request from "../../axios/requests";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
import { LuClock, LuWalletCards } from "react-icons/lu";
import { FaRegCheckCircle, FaRupeeSign } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await request.getVendorDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    dispatch(setSidebarTab(0));
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 rounded-lg bg-[#0b8263] px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { statistics, recentServices, recentOrders } = dashboardData;

  const getKycStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "requested":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getKycStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "requested":
        return "Under Verification";
      case "pending":
        return "Pending";
      default:
        return "Not Started";
    }
  };

  console.log(user, "user");
  return (
    <UserLayout>
      <div className="font-mont min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || "user"}!</p>
        </div>

        {/* Training Banner */}
        <div className="mb-6 rounded-lg bg-[#0b8263] p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Vendor Training Available
              </h3>
              <p className="text-green-100">
                Learn how to maximize your business on our platform
              </p>
            </div>
            <button
              // onClick={() => navigate("/vendor/training")}
              className="rounded-lg bg-white px-4 py-2 font-medium text-[#0b8263] hover:bg-green-50"
            >
              Start Training
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Vendor Info & Stats */}
          <div className="space-y-6 lg:col-span-2">
            {/* Vendor Info Card */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Vendor Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">KYC Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKycStatusColor(user?.kycVerified)}`}
                  >
                    {getKycStatusText(user?.kycVerified)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <LuWalletCards className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium text-gray-600 lg:text-sm">
                      Total Services
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {statistics.totalServices}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <LuClock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium text-gray-600 lg:text-sm">
                      Pending Orders
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {statistics.pendingOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-3">
                    <FaRegCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium text-gray-600 lg:text-sm">
                      Completed Orders
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {statistics.completedOrders}
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <FaRupeeSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium text-gray-600 lg:text-sm">
                      Total Earnings
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{statistics.totalEarnings}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Recent Services */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recently Created Services
                </h2>
                <button
                  onClick={() => navigate("/services")}
                  className="font-medium text-[#0b8263] hover:text-green-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentServices.length > 0 ? (
                  recentServices.map((service) => (
                    <div
                      key={service._id}
                      onClick={() => navigate(`/service/${service._id}`)}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {service.serviceName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₹{service.servicePrice}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            service.isApproved === "approved"
                              ? "bg-green-100 text-green-800"
                              : service.isApproved === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.isApproved}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-gray-500">
                    No services yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Orders */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate("/orders")}
                  className="font-medium text-[#0b8263] hover:text-green-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/orders`)}
                      className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.serviceName}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{order.totalPaidAmount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-gray-500">
                    No orders yet
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/services?tab=create")}
                  className="w-full rounded-lg bg-[#0b8263] px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
                >
                  Add New Service
                </button>
                <button
                  onClick={() => navigate("/setting?tab=profile")}
                  className="w-full rounded-lg border border-[#0b8263] px-4 py-2 font-medium text-[#0b8263] transition-colors hover:bg-green-50"
                >
                  Update Profile
                </button>
                {user?.kycVerified === "pending" && (
                  <button
                    onClick={() => navigate("/setting?tab=kyc")}
                    className="w-full rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-700"
                  >
                    Complete KYC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
