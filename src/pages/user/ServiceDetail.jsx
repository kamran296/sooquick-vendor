import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserLayout from "../../layouts/user/UserLayout";
import request from "../../axios/requests";
import Spinner from "../../components/Spinner";
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
  FaTrash,
} from "react-icons/fa";
import EditServiceForm from "../../components/service/EditServiceForm";
import { toast } from "react-toastify";
import { FaPen } from "react-icons/fa6";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
import { useDispatch } from "react-redux";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = id;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSidebarTab(1));
  }, []);

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

  const tabContent = useMemo(() => {
    if (!service) return null;
    switch (activeTab) {
      case "description":
        return (
          <div className="font-mont rounded-lg bg-white p-6 shadow-sm">
            <div className="prose max-w-none">
              <div className="leading-relaxed whitespace-pre-line text-gray-700">
                {service.fullDescription || service.description}
              </div>
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            <div>
              <h3 className="mb-3 font-semibold text-gray-900">
                Service Details
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">
                    {service.mainCategory}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">{service.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Availability:</span>
                  <span className="ml-2 font-medium">
                    {service.availability}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Working Time:</span>
                  <span className="ml-2 font-medium">
                    {service.workingStartTime} - {service.workingEndTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case "features":
        return (
          <div className="font-mont rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Scope Of Work</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p className="text-gray-500">{service.scopeOfWork}</p>
            </div>
          </div>
        );
        break;
      case "reviews":
        return (
          <div className="font-mont rounded-lg bg-white p-6 shadow-sm">
            {service.reviews && service.reviews.length > 0 ? (
              <div className="space-y-6">
                {service.reviews.map((review) => (
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
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
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
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        );
        break;
      default:
        return null;
    }
  }, [activeTab, service]);

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
                        ` ${import.meta.env.VITE_API_URL}${service.documents.photos[currentImageIndex]}` ||
                        "/placeholder-image.jpg"
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
                  <div className="rounded-lg border border-red-300 bg-red-50 p-4">
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
                    {service.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                    {service.subCategory}
                  </span>
                </div>

                <p className="leading-relaxed text-gray-600">
                  {service.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{service.finalPrice}
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
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowEditModal(!showEditModal)}
                    className="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50"
                  >
                    <FaPen className="mr-2" />
                    Edit service
                  </button>
                  {service.isApproved === "rejected" && (
                    <button
                      onClick={handleDeleteService}
                      className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Provider Info */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
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

                {/* <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Response Time:</span>
                    <span className="ml-2 font-medium">
                      {service.vendor.responseTime || "Within hours"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since:</span>
                    <span className="ml-2 font-medium">
                      {new Date(service.vendor.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div> */}
              </div>
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

              {/* Service Areas */}
              {service.serviceAreas && service.serviceAreas.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Service Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.serviceAreas.map((area) => (
                      <span
                        key={area._id}
                        className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                      >
                        {area.areaName}, {area.city} - {area.pincode}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "description"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "features"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  What's Included
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Reviews
                </button>
              </nav>
            </div>

            <div className="mt-6">{tabContent}</div>

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
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ServiceDetail;
