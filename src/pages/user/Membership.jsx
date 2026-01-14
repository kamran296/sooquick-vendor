import React from "react";
import { useSelector } from "react-redux";
import UserLayout from "../../layouts/user/UserLayout";
import {
  FaCrown,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import { useState } from "react";

const Membership = () => {
  const { membership } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to capitalize first letter
  const capitalizeFirst = (str) => {
    return str?.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleCancelMembership = async () => {
    try {
      setLoading(true);
      const response = await request.cancelMembership();
      if (response.data.success) {
        toast.success("Membership cancelled successfully");
        await dispatch(getUser());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel membership",
      );
    } finally {
      setLoading(false);
    }
  };

  const canCancelMembership = () => {
    if (!membership || !membership.purchaseDate) {
      return false;
    }

    const purchaseDate = new Date(membership.purchaseDate);
    const currentDate = new Date();

    // Calculate days since purchase
    const timeDifference = currentDate - purchaseDate;
    const daysSincePurchase = Math.floor(
      timeDifference / (1000 * 60 * 60 * 24),
    );

    // Check if more than 7 days have passed
    return daysSincePurchase <= 7;
  };

  return (
    <UserLayout>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Your Membership
        </h1>
        <p className="mb-8 text-gray-600">
          Manage your subscription and view membership details
        </p>

        {membership ? (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            {/* Membership Header */}
            <div
              className={`p-6 text-white ${
                membership.type === "premium"
                  ? "bg-gradient-to-r from-teal-600 to-teal-800"
                  : membership.type === "gold"
                    ? "bg-gradient-to-r from-amber-600 to-amber-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaCrown className="mr-3 text-2xl" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {capitalizeFirst(membership.type)} Membership
                    </h2>
                    <p className="opacity-90">
                      Active since {formatDate(membership.purchaseDate)}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    membership.status === "active"
                      ? "bg-teal-500"
                      : "bg-gray-500"
                  }`}
                >
                  {capitalizeFirst(membership.status)}
                </span>
              </div>
            </div>

            {/* Membership Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Plan Details */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
                    <FaShieldAlt className="mr-2 text-teal-600" />
                    Plan Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Membership Type</span>
                      <span className="font-medium">
                        {capitalizeFirst(membership.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date</span>
                      <span className="font-medium">
                        {formatDate(membership.purchaseDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date</span>
                      <span className="font-medium">
                        {formatDate(membership.expiryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`font-medium ${
                          membership.status === "active"
                            ? "text-teal-600"
                            : "text-red-600"
                        }`}
                      >
                        {capitalizeFirst(membership.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
                    <FaCreditCard className="mr-2 text-blue-600" />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-medium">
                        ₹{membership.payment.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Mode</span>
                      <span className="font-medium">
                        {capitalizeFirst(membership.payment.mode)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="text-sm font-medium">
                        {membership.payment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span
                        className={`font-medium ${
                          membership.payment.status === "completed"
                            ? "text-teal-600"
                            : "text-red-600"
                        }`}
                      >
                        {capitalizeFirst(membership.payment.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mt-6">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
                  <FaCheckCircle className="mr-2 text-teal-600" />
                  Your Membership Benefits
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {membership.type === "premium" && (
                    <>
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-teal-500" />
                        <span>Priority Support</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-teal-500" />
                        <span>Unlimited Projects</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-teal-500" />
                        <span>Advanced Analytics</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-teal-500" />
                        <span>Team Collaboration</span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-teal-500" />
                        <span>API Access</span>
                      </div>
                    </>
                  )}
                  {/* Add benefits for other membership types as needed */}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/membership")}
                  className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
                >
                  Upgrade Plan
                </button>
                {canCancelMembership() && (
                  <button
                    disabled={loading}
                    onClick={handleCancelMembership}
                    className={`rounded-md border border-red-500 px-4 py-2 text-red-600 transition-colors hover:bg-red-50 ${loading ? "cursor-not-allowed opacity-50" : ""} `}
                  >
                    {loading ? "Canceling..." : "Cancel Membership"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <FaClock className="mx-auto mb-4 text-4xl text-gray-400" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              No Active Membership
            </h2>
            <p className="mb-6 text-gray-600">
              You don't have an active membership plan yet.
            </p>
            <button
              onClick={() => navigate("/membership")}
              className="rounded-md bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
            >
              Become a Member
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Membership;
