import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserLayout from "../../layouts/user/UserLayout";
import request from "../../axios/requests";
import Spinner from "../../components/Spinner";
// import {
//   FaArrowLeft,
//   FaChevronLeft,
//   FaChevronRight,
//   FaPlay,
//   FaHeart,
//   FaShare,
//   FaStar,
//   FaShoppingCart,
//   FaComment,
//   FaCheckCircle,
//   FaTrash,
// } from "react-icons/fa";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaHeart,
  FaShare,
  FaStar,
  FaShoppingCart,
  FaComment,
  FaCheckCircle,
  FaRupeeSign,
  FaClock,
  FaCalendar,
  FaMapMarkerAlt,
  FaBusinessTime,
  FaTools,
  FaCheck,
  FaCalendarCheck,
  FaRegClock,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import EditServiceForm from "../../components/service/EditServiceForm";
import { toast } from "react-toastify";
import { FaPen } from "react-icons/fa6";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
import { useDispatch } from "react-redux";
import { useCategories } from "../../hooks/useCategories";
import { useServiceImage } from "../../hooks/useServiceImage";
import { formatDateWithoutTime } from "../../../../frontend/src/utils/helpers";
const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = id;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSidebarTab(1));
  }, []);

  const { categories } = useCategories();
  const imageSrc = useServiceImage(service, categories, currentImageIndex);
  // Fetch service details
  const fetchServiceDetails = async (serviceId) => {
    try {
      setLoading(true);
      const response = await request.getServiceDetails(serviceId);
      const data = await response.data;

      if (data) {
        setService(data.service);
      }
    } catch (error) {
      setError("Failed to fetch service details");
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  const nextImage = () => {
    if (service && service.documents && service.documents.photos) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % service.documents.photos.length,
      );
    }
  };

  const prevImage = () => {
    if (service && service.documents && service.documents.photos) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + service.documents.photos.length) %
          service.documents.photos.length,
      );
    }
  };

  const calculateAverageRating = (ratingDistribution) => {
    if (!ratingDistribution) return 0;
    const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    const weightedSum = Object.entries(ratingDistribution).reduce(
      (sum, [rating, count]) => sum + parseInt(rating) * count,
      0,
    );
    return (weightedSum / total).toFixed(1);
  };
  const avgRating = calculateAverageRating(service?.ratingDistribution || 0);

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="font-mont flex items-center justify-center bg-gray-50">
          <Spinner />
        </div>
      </UserLayout>
    );
  }

  if (error || !service) {
    return (
      <UserLayout>
        <div className="font-mont flex h-full w-full items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              {error || "Service not found"}
            </h2>
            <button
              onClick={() => navigate("/services")}
              className="flex items-center justify-center rounded-md bg-[#0b8263] px-4 py-2 text-white hover:bg-teal-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Services
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const handleServiceUpdateSuccess = (updatedService) => {
    setShowEditModal(false);
    toast.success("Service edited!");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleDeleteService = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await request.deleteService(service._id);
      toast.success("Service deleted successfully");
      navigate("/services");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete service");
    }
  };

  return (
    <UserLayout>
      <div className="font-mont bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate("/services")}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Services
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Media Section */}
            <div className="space-y-4">
              {/* Main Image/Video */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200">
                {!showVideo ? (
                  <>
                    <img
                      src={
                        service.documents.photos.length > 0
                          ? ` ${import.meta.env.VITE_API_URL}${service.documents.photos[currentImageIndex]}`
                          : imageSrc
                      }
                      alt={service.serviceName}
                      className="h-full w-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {service.documents.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                        >
                          <FaChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                        >
                          <FaChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Video Play Button */}
                    {service.documents.video &&
                      service.documents.video.length > 0 && (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                        >
                          <FaPlay className="h-6 w-6" />
                        </button>
                      )}
                  </>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center bg-black">
                    <video
                      controls
                      className="h-full w-full object-contain"
                      src={`${import.meta.env.VITE_API_URL}${service.documents.video[0]}`}
                    />
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {service.documents.photos.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}${image}`}
                      alt={`${service.serviceName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
                {service.documents.video &&
                  service.documents.video.length > 0 && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`relative aspect-video w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        showVideo ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <FaPlay className="h-4 w-4 text-gray-600" />
                      </div>
                    </button>
                  )}
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {service.serviceName}
                  </h1>
                </div>

                {/* Rejection Banner */}
                {service.isApproved === "rejected" && (
                  <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-red-700">
                          ❌ Service Rejected
                        </h3>
                        <p className="mt-1 text-sm text-red-600">
                          <span className="font-medium">Reason:</span>{" "}
                          {service.rejectionMessage || "No reason provided"}
                        </p>
                        <p className="mt-2 text-xs text-gray-600">
                          You can edit this service to fix the issues or delete
                          it and create a new one.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-gray-500">
                      ({service.reviewCount || "0"} reviews)
                    </span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {service.categoryPathNames[0]}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                    {service.categoryPathNames[1]}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{service.finalPrice}{" "}
                    <span className="text-[15px]">{service.pricingType}</span>
                  </span>
                  {service.originalPrice &&
                    service.originalPrice > service.finalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{service.originalPrice}
                      </span>
                    )}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Availability:</span>
                    <span className="ml-2 font-medium">
                      {service.availability}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Working hours:</span>
                    <span className="ml-2 font-medium">
                      {service.workingStartTime}-{service.workingEndTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  {service.isApproved !== "requested" && (
                    <button
                      onClick={() => setShowEditModal(!showEditModal)}
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50"
                    >
                      <FaPen className="mr-2" />
                      Edit service
                    </button>
                  )}

                  {service.isApproved === "rejected" && (
                    <button
                      onClick={handleDeleteService}
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-3 hover:bg-red-500"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Provider Info */}
              {/* <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
                    {service.vendor.firstName?.[0]}
                    {service.vendor.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {service.vendor.firstName} {service.vendor.lastName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FaStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.vendor.rating}</span>
                      <span>
                        ({service.vendor.completedOrders || "0"} orders)
                      </span>
                    </div>
                  </div>
                </div>

                
              </div> */}
              {/* pricing info */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold text-gray-900">
                  Earnings Breakdown
                </h3>
                <div className="space-y-1 text-sm">
                  <p>Service Price: ₹{service.finalPrice}</p>
                  <p>Platform Fee: ₹{service.vendorPlatformFee}</p>
                  <p className="font-semibold text-green-600">
                    You Earn: ₹{service.finalPrice - service.vendorPlatformFee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("ratings")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "ratings"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Ratings & Reviews
                </button>
                <button
                  onClick={() => setActiveTab("service-info")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "service-info"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Service Information
                </button>

                <button
                  onClick={() => setActiveTab("serviceAreas")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "serviceAreas"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Service Areas
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === "overview" && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="space-y-8">
                    {/* Scope of Work Section */}
                    <div className="rounded-lg bg-gradient-to-r from-gray-50 to-white p-5 transition-all hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <MdOutlineDescription className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            Scope of Work
                          </h4>
                          <div className="rounded-lg border-l-4 border-blue-400 bg-white p-4 shadow-sm">
                            <p className="leading-relaxed text-gray-700">
                              {service.scopeOfWork ? (
                                service.scopeOfWork
                              ) : (
                                <span className="text-gray-400 italic">
                                  No description available.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warranty Section */}
                    <div className="rounded-lg bg-gradient-to-r from-gray-50 to-white p-5 transition-all hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                            service.warranty
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <FaCheckCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            Warranty Information
                            {service.warranty && (
                              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Included
                              </span>
                            )}
                          </h4>

                          {service.warranty ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaRegClock className="h-4 w-4 text-gray-400" />
                                    <span>Warranty Period</span>
                                  </div>
                                  <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {service.warrantyPeriod}
                                  </p>
                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaTools className="h-4 w-4 text-gray-400" />
                                    <span>Coverage</span>
                                  </div>
                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    {service.warrantyIncludes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 rounded-lg bg-gray-100/80 p-4 text-gray-600">
                              <div className="rounded-full bg-gray-200 p-2">
                                <FaTools className="h-4 w-4 text-gray-500" />
                              </div>
                              <p className="text-sm">
                                This service does not include any warranty
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Work/Material Section - NEW */}
                    <div className="rounded-lg bg-gradient-to-r from-gray-50 to-white p-5 transition-all hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                          <FaTools className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-md mb-2 flex items-center gap-2 font-semibold text-gray-900">
                            Note: Additional Work / Material
                          </h4>

                          <div className="flex items-center gap-3 rounded-sm bg-red-50 p-4 text-red-600">
                            <div className="rounded-full bg-gray-200 p-2">
                              <FaTools className="h-4 w-4 text-red-500" />
                            </div>
                            <p className="text-sm">
                              Any additional tasks, materials, modifications
                              that are required beyond the standard scope of
                              work should be communicated in advance with the
                              customers and will be charged seperately through
                              SooQuick platform only.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Optional: Timeline/Quick Info Section */}
                    {(service.estimatedDuration || service.serviceType) && (
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {service.estimatedDuration && (
                          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                              <FaRegClock className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Estimated Duration
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {service.estimatedDuration}
                              </p>
                            </div>
                          </div>
                        )}

                        {service.serviceType && (
                          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                              <FaTools className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Service Type
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {service.serviceType}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ratings" && (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      Ratings & Reviews
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          {avgRating}
                        </div>
                        <div className="flex justify-center">
                          {getRatingStars(Math.round(avgRating))}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {service.totalReviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {service.ratingDistribution && (
                    <div className="mb-8">
                      <h4 className="mb-4 font-medium text-gray-900">
                        Rating Distribution
                      </h4>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = service.ratingDistribution[rating] || 0;
                          const total = service.totalReviews || 1;
                          const percentage = (count / total) * 100;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-3"
                            >
                              <div className="flex w-20 items-center gap-1">
                                <span className="text-sm text-gray-600">
                                  {rating}
                                </span>
                                <FaStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </div>
                              <div className="flex-1">
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full bg-yellow-400"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="w-12 text-right text-sm text-gray-600">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {service.ratings && service.ratings.length > 0 ? (
                    <div className="space-y-6">
                      {service.ratings.map((review) => (
                        <div
                          key={review._id}
                          className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
                              {review.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  {review.user?.name || "Anonymous"}
                                </span>
                                <div className="flex items-center gap-1">
                                  {getRatingStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="leading-relaxed text-gray-700">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FaStar className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-4 text-gray-500">
                        No reviews yet. Be the first to review this service!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "service-info" && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  {/* Header with improved styling */}
                  <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Service Information
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      ID: {service.customServiceId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Information Card */}
                      <div className="rounded-lg bg-gray-50 p-4 transition-all hover:shadow-sm">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          <MdOutlineDescription className="h-4 w-4 text-gray-500" />
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <InfoRow
                            label="Service Name"
                            value={service.serviceName}
                            highlighted
                          />
                          <InfoRow
                            label="Category"
                            value={service.categoryPathNames[1]}
                            badge
                          />
                          <InfoRow
                            label="Main Category"
                            value={service.categoryPathNames[0]}
                            badge
                          />
                          <InfoRow
                            label="Service Type"
                            value={service.categoryPathNames[2]}
                            badge
                          />
                        </div>
                      </div>

                      {/* Pricing & Availability Card */}
                      <div className="rounded-lg bg-gray-50 p-4 transition-all hover:shadow-sm">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          {/* <HiOutlineCurrencyDollar className="h-4 w-4 text-gray-500" /> */}
                          Pricing & Availability
                        </h4>
                        <div className="space-y-3">
                          <InfoRow
                            label="Pricing Type"
                            value={service.pricingType}
                            badge
                          />
                          <InfoRow
                            label="Final Price"
                            value={`₹${service.finalPrice}`}
                            valueClassName="text-lg font-bold text-gray-900"
                          />
                          <InfoRow
                            label="Availability"
                            value={service.availability}
                            badge={
                              service.availability === "24/7" ? "green" : "blue"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Working Schedule Card */}
                      <div className="rounded-lg bg-gray-50 p-4 transition-all hover:shadow-sm">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          <FaCalendarCheck className="h-4 w-4 text-gray-500" />
                          Working Schedule
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-sm text-gray-600">
                              Working Days:
                            </span>
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {service.workingDays.map((day, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200"
                                  title={day}
                                >
                                  {day.substring(0, 3)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <InfoRow
                            label="Start Time"
                            value={formatTime(service.workingStartTime)}
                            icon={<FaClock className="h-3 w-3 text-gray-400" />}
                          />
                          <InfoRow
                            label="End Time"
                            value={formatTime(service.workingEndTime)}
                            icon={<FaClock className="h-3 w-3 text-gray-400" />}
                          />
                        </div>
                      </div>

                      {/* Service Status Card */}
                      <div className="rounded-lg bg-gray-50 p-4 transition-all hover:shadow-sm">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          <FaCheckCircle className="h-4 w-4 text-gray-500" />
                          Service Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Status:
                            </span>
                            <StatusBadge status={service.isApproved} />
                          </div>
                          <InfoRow
                            label="Active From"
                            value={formatDateWithoutTime(service.createdAt)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "serviceAreas" && (
                <div>
                  {/* Service Areas */}
                  {service.serviceAreas && service.serviceAreas.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <FaMapMarkerAlt className="h-5 w-5 text-red-500" />
                        Service Areas
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {service.serviceAreas.map((area) => (
                          <div
                            key={area._id}
                            className="rounded-lg border border-gray-200 p-3 hover:border-blue-200 hover:bg-blue-50"
                          >
                            <div className="font-medium text-gray-900">
                              {area.areaName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {area.city}, {area.state}
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              Pincode: {area.pincode}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ServiceDetail;

// Helper Components
const InfoRow = ({
  label,
  value,
  badge,
  highlighted,
  valueClassName = "",
  icon,
}) => {
  const getBadgeColor = (badgeType) => {
    if (badgeType === true) return "bg-blue-100 text-blue-800";
    if (badgeType === "green") return "bg-green-100 text-green-800";
    if (badgeType === "blue") return "bg-blue-100 text-blue-800";
    if (badgeType === "yellow") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1 text-sm text-gray-600">
        {icon && <span className="inline-flex">{icon}</span>}
        {label}:
      </span>
      {badge ? (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeColor(badge)}`}
        >
          {value}
        </span>
      ) : (
        <span
          className={`text-sm font-medium text-gray-900 ${highlighted ? "font-semibold" : ""} ${valueClassName}`}
        >
          {value}
        </span>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 ring-1 ring-green-600/20";
      case "pending":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20";
      case "rejected":
        return "bg-red-100 text-red-800 ring-1 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20";
    }
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};
