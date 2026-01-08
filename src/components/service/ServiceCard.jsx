import React, { useState } from "react";
import { FaRupeeSign, FaHeart, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditServiceForm from "./EditServiceForm"; // Import the edit form component

const ServiceCard = ({ service }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const navigate = useNavigate();

  const commisionPercentage = (finalPrice, servicePrice) => {
    const percentage = ((finalPrice - servicePrice) / servicePrice) * 100;
    return percentage;
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % service.documents.photos.length,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + service.documents.photos.length) %
        service.documents.photos.length,
    );
  };

  // Check if service has video
  const hasVideo =
    service.documents.video && service.documents.video.length > 0;

  // Handle successful service update
  const handleServiceUpdateSuccess = (updatedService) => {
    setShowEditModal(false);
    // You might want to refresh the service data here or trigger a parent component update
    console.log("Service updated successfully:", updatedService);
    // Optionally show a success message or refresh the data
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:min-w-[300px]">
        <div className="relative aspect-video overflow-hidden">
          {!showVideo ? (
            <>
              <img
                src={
                  `${import.meta.env.VITE_API_URL}${service.documents.photos[currentImageIndex]}` ||
                  "/placeholder.svg"
                }
                alt={service.serviceName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Image Navigation Dots */}
              {service.documents.photos.length > 1 && (
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {service.documents.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-black" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Video Play Button (only show if video exists) */}
              {hasVideo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVideo(true);
                  }}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}

              {/* Navigation Arrows for multiple images */}
              {service.documents.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-black/70"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-black/70"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center bg-black">
              <video
                controls
                autoPlay
                className="h-full w-full object-contain"
                poster={service.documents.photos[0]}
              >
                <source
                  src={`${import.meta.env.VITE_API_URL}${service.documents.video[0]}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(false);
                }}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div
          className="p-4"
          onClick={(e) => {
            navigate(`/service/${service._id}`);
          }}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-teal-600">
                {service.serviceName}
              </h3>
            </div>
            <div className="status">
              {service.isApproved === "requested" ? (
                <div className="rounded-full bg-blue-200 px-3 py-[2px] text-center text-sm text-blue-400">
                  {" "}
                  Requested
                </div>
              ) : service.isApproved === "approved" ? (
                <div className="rounded-full bg-green-200 px-3 py-[2px] text-center text-sm text-green-400">
                  Approved
                </div>
              ) : service.isApproved === "rejected" ? (
                <div className="rounded-full bg-red-200 px-3 py-[2px] text-center text-sm text-red-400">
                  Rejected
                </div>
              ) : (
                <div className="rounded-full bg-yellow-200 px-3 py-[2px] text-center text-sm text-yellow-400">
                  Pending
                </div>
              )}
            </div>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {service.description}
          </p>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {service.category}
              </span>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {service.subCategory}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-md flex items-center font-bold text-teal-700">
                Final Price: <FaRupeeSign />
                {service.finalPrice}
              </span>
              <span className="text-md flex items-center font-bold text-teal-700">
                Original Price: <FaRupeeSign />
                {service.servicePrice}
              </span>
              <span className="text-md">
                commision charges:
                {Math.floor(
                  commisionPercentage(service.finalPrice, service.servicePrice),
                )}
                %
              </span>

              {/* Add rejection message badge if service is rejected */}
              {service.isApproved === "rejected" &&
                service.rejectionMessage && (
                  <div className="mt-3">
                    <div className="flex items-start gap-2 rounded-md bg-red-50 p-3">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-red-700">
                          {service.rejectionMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex space-x-4 border-t border-gray-200 pt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
              className="rounded-lg bg-[#0b8263] px-6 py-2 text-white transition-colors hover:bg-teal-700"
            >
              Edit Service
            </button>
            {service.isApproved === "rejected" && (
              <button
                onClick={() => onDelete(service._id)}
                disabled={deleting}
                title="Delete Service"
                className={`rounded-lg border border-red-200 p-2 text-red-600 transition ${deleting ? "cursor-not-allowed opacity-50" : "hover:bg-red-50"}`}
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-xl font-bold">Edit Service</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <EditServiceForm
                serviceId={service._id}
                onSuccess={handleServiceUpdateSuccess}
                onCancel={handleCancelEdit}
                service={service}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;
