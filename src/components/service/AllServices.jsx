import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServiceCard from "./ServiceCard";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";

const AllServices = ({ filter = "all" }) => {
  const { services } = useSelector((state) => state.service);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarTab(1));
  }, []);

  // Filter services based on the filter prop and your existing isApproved field
  const filteredServices = useMemo(() => {
    if (!services || services.length === 0) return [];

    switch (filter) {
      case "all":
        return services;
      case "requested":
        return services.filter((service) => service.isApproved === "requested");
      case "rejected":
        return services.filter((service) => service.isApproved === "rejected");
      case "active":
        // Assuming approved services are considered active
        return services.filter((service) => service.isApproved === "approved");
      default:
        return services;
    }
  }, [services, filter]);

  if (!services || services.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No services found. Create your first service to get started.
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No {filter !== "all" ? filter : ""} services found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {filter === "all"
          ? "Your Services"
          : filter === "requested"
            ? "Pending Approvals"
            : filter === "rejected"
              ? "Rejected Services"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Services`}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard key={service._id || service.id} service={service} />
        ))}
      </div>

      {/* Service Modal */}
      {isModalOpen && selectedService && (
        <ServiceModal
          service={selectedService}
          selectedImageIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
            setSelectedImageIndex(0);
          }}
        />
      )}
    </div>
  );
};

// Your existing ServiceModal component remains the same...
const ServiceModal = ({
  service,
  selectedImageIndex,
  onImageSelect,
  onClose,
}) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {service.title}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Media Section */}
          <div className="mb-6">
            <div className="mb-4 h-64 rounded-lg bg-gray-200">
              {service.videos?.length > 0 ? (
                <video
                  className="h-full w-full rounded-lg object-cover"
                  src={service.videos[0]}
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={service.images?.[selectedImageIndex]}
                  alt={service.title}
                  className="h-full w-full rounded-lg object-cover"
                />
              )}
            </div>

            {/* Image Thumbnails */}
            {service.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onImageSelect(index)}
                    className={`h-16 w-16 rounded border-2 ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full rounded object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-700">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-semibold">${service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      service.isApproved === "approved"
                        ? "bg-green-100 text-green-800"
                        : service.isApproved === "requested"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.isApproved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex space-x-4 border-t border-gray-200 pt-6">
            <button className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600">
              Edit Service
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllServices;
