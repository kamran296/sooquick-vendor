import React, { useState } from "react";
import { FaRupeeSign, FaHeart, FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditServiceForm from "./EditServiceForm";
import request from "../../axios/requests";
import { setToggleStatus } from "../../redux/slices/serviceSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { MdCategory } from "react-icons/md";
import { useCategories } from "../../hooks/useCategories";
import { useServiceImage } from "../../hooks/useServiceImage";

const ServiceCard = ({ service, onDelete, deleting }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showRejectionTooltip, setShowRejectionTooltip] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories } = useCategories();
  const imageSrc = useServiceImage(service, categories, currentImageIndex);
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

  const handleToggleStatus = async (e) => {
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    try {
      const res = await request.toggleServiceStatus(service._id);
      if (res.data.success) {
        toast.success(
          res.data.message || "Service status updated successfully",
        );

        dispatch(
          setToggleStatus({
            serviceId: service._id,
            isActive: !service.isActive,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle service status:", error);
      toast.error("Error toggling service status.");
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <>
      <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:min-w-[300px]">
        <div className="relative aspect-video overflow-hidden">
          {!showVideo ? (
            <>
              <img
                src={
                  service.documents?.photos?.length > 0
                    ? `${import.meta.env.VITE_API_URL}${service.documents.photos[currentImageIndex]}`
                    : imageSrc
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
                      d="M10 18a8 8 0 100-16 0 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
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
                <>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowRejectionTooltip(true)}
                      onMouseLeave={() => setShowRejectionTooltip(false)}
                      className="cursor-pointer rounded-full bg-red-200 px-3 py-[2px] text-center text-sm text-red-400 transition-colors hover:bg-red-300"
                    >
                      Rejected
                    </button>

                    {/* Rejection Tooltip */}
                    {showRejectionTooltip && service.rejectionMessage && (
                      <div className="absolute top-full right-0 z-10 mt-2 max-w-64 rounded-lg border border-red-100 bg-red-200 p-3 shadow-2xl">
                        <p className="mb-1 text-xs font-medium text-red-500">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {service.rejectionMessage}
                        </p>
                        <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 border-t border-l border-gray-200 bg-white"></div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-full bg-yellow-200 px-3 py-[2px] text-center text-sm text-yellow-400">
                  Pending
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {service.categoryPathNames[0]} - {service.categoryPathNames[1]}
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
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex space-x-4">
              {service.isApproved !== "requested" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                  }}
                  className="rounded-lg bg-[#0b8263] px-6 py-2 text-white transition-colors hover:bg-teal-700"
                >
                  Edit Service
                </button>
              )}

              {service.isApproved === "rejected" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(service._id);
                  }}
                  disabled={deleting}
                  title="Delete Service"
                  className={`rounded-lg border border-red-200 p-2 text-red-600 transition ${deleting ? "cursor-not-allowed opacity-50" : "hover:bg-red-50"}`}
                >
                  <FaTrash />
                </button>
              )}
            </div>

            {/* Toggle Switch - Only show if approved */}
            {service.isApproved === "approved" && (
              <div className="flex items-center gap-3">
                {/* <span className="text-sm text-gray-600">Active</span> */}
                <button
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                    service.isActive ? "bg-teal-600" : "bg-gray-300"
                  } ${isToggling ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      service.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                <MdCategory className="text-[#0b8263]" />
                Edit Service
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
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
