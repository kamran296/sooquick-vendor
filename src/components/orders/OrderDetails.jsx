import React from "react";
import { LuX } from "react-icons/lu";
import { formatDate, formatCurrency } from "../../utils/helpers";

const OrderDetails = ({
  selectedOrder,
  setSelectedOrder,
  getStatusIcon,
  getStatusColor,
  openOtpModal, // Added this prop since it's used in the component
  completingOrder,
}) => {
  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-300/30 p-2 sm:p-4"
      onClick={() => setSelectedOrder(null)}
    >
      <div
        className="mx-2 my-4 w-full max-w-full rounded-lg bg-white p-4 sm:max-w-2xl sm:p-6 md:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Improved for mobile */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Order Details
          </h3>
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close"
          >
            <LuX className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content Grid - Stack on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Order Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base font-medium text-gray-900 sm:text-lg">
              Order Information
            </h4>
            <dl className="space-y-2 sm:space-y-3">
              <InfoItem
                label="Order ID"
                value={`#${selectedOrder._id?.slice(-8)}`}
              />
              <InfoItem
                label="Service"
                value={selectedOrder.serviceDetails?.serviceName || "N/A"}
              />
              <InfoItem
                label="Category"
                value={selectedOrder.serviceDetails?.category || "N/A"}
              />
              <InfoItem
                label="Booking Date"
                value={formatDate(
                  selectedOrder.bookingDate || selectedOrder.createdAt,
                )}
              />
              <InfoItem
                label="Scheduled Date"
                value={formatDate(selectedOrder.scheduledDate)}
              />
            </dl>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base font-medium text-gray-900 sm:text-lg">
              Payment Details
            </h4>
            <dl className="space-y-2 sm:space-y-3">
              <InfoItem
                label="Total Amount"
                value={formatCurrency(selectedOrder.payment?.amount || 0)}
              />
              <InfoItem
                label="Service Price"
                value={formatCurrency(selectedOrder.serviceDetails?.price || 0)}
              />
              <InfoItem
                label="Platform Fee"
                value={formatCurrency(selectedOrder.payment?.platformFee || 0)}
              />
              <InfoItem
                label="Your Earning"
                value={formatCurrency(
                  selectedOrder.payment?.vendorEarning || 0,
                )}
                isEarning
              />
              <div>
                <dt className="mb-1 text-xs text-gray-600 sm:text-sm">
                  Status
                </dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                      selectedOrder.status,
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">
                      {selectedOrder.status.replace("_", " ")}
                    </span>
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Service Address Section */}
        {selectedOrder.serviceAddress && (
          <div className="mt-4 sm:mt-6">
            <h4 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
              Service Address
            </h4>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <div className="space-y-1 text-sm text-gray-700">
                <div className="font-medium">
                  {selectedOrder.serviceAddress?.building || ""}
                  {selectedOrder.serviceAddress.street}
                </div>
                <div>
                  {selectedOrder.serviceAddress.city},{" "}
                  {selectedOrder.serviceAddress.state}{" "}
                  {selectedOrder.serviceAddress.postalCode}
                </div>
                <div className="text-gray-500">
                  {selectedOrder.serviceAddress.country}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Reason */}
        {selectedOrder.cancellationMessage && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:mt-6 sm:p-4">
            <h4 className="mb-2 text-base font-medium text-red-900 sm:text-lg">
              Cancellation Reason
            </h4>
            <p className="text-sm text-red-700">
              {selectedOrder.cancellationMessage}
            </p>
          </div>
        )}

        {/* Action Buttons - Stack on mobile */}
        <div className="mt-4 flex flex-col justify-end space-y-2 sm:mt-6 sm:flex-row sm:space-y-0 sm:space-x-3">
          {/* Show Complete button for orders that can be completed */}
          {(selectedOrder.status === "confirmed" ||
            selectedOrder.status === "in_progress" ||
            selectedOrder.status === "otp_requested") && (
            <button
              onClick={() => openOtpModal(selectedOrder)}
              disabled={completingOrder}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
            >
              {/* {selectedOrder.status === "otp_requested"
                ? "Enter OTP"
                : "Mark Complete"} */}
              {completingOrder ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processing...
                </span>
              ) : selectedOrder.status === "otp_requested" ? (
                "Enter OTP"
              ) : (
                "Mark Complete"
              )}
            </button>
          )}
          <button
            onClick={() => setSelectedOrder(null)}
            className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoItem component for better structure
const InfoItem = ({ label, value, isEarning = false }) => (
  <div>
    <dt className="mb-1 text-xs text-gray-600 sm:text-sm">{label}</dt>
    <dd
      className={`text-sm font-medium ${isEarning ? "text-green-600" : "text-gray-900"}`}
    >
      {value}
    </dd>
  </div>
);

export default OrderDetails;
