import React, { useState, useEffect } from "react";
import axios from "axios";
import PincodeInput from "./Pincode";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa6";

const EditServiceForm = ({ serviceId, onSuccess, onCancel, service }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    mainCategory: "",
    category: "",
    serviceType: "",
    pricingType: "Fixed",
    servicePrice: "",
    availability: "",
    serviceAreas: [],
    scopeOfWork: "",
    workingStartTime: "",
    workingEndTime: "",
    workingDays: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const MAX_IMAGES = 4;

  // Service areas management
  const [existingServiceAreas, setExistingServiceAreas] = useState([]);
  const [newServiceAreas, setNewServiceAreas] = useState([]);
  const [areasToRemove, setAreasToRemove] = useState([]);

  // Media management
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [videoToRemove, setVideoToRemove] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(false);
  // Categories
  const mainCategories = [
    "Repair & Maintenance",
    "Cleaning & Hygiene Services",
    "Fitness & Grooming",
  ];

  const subCategories = {
    "Repair & Maintenance": [
      "Electrician",
      "Plumber",
      "Carpenter",
      "AC Repair",
      "Appliance Repair",
      "Painting",
      "Pest Control",
      "RO Service",
      "Computer Repair",
      "Internet Services",
    ],
    "Cleaning & Hygiene Services": [
      "Home Cleaning",
      "Sofa Cleaning",
      "Carpet Cleaning",
      "Bathroom Cleaning",
      "Kitchen Cleaning",
      "Office Cleaning",
      "Water Tank Cleaning",
    ],
    "Fitness & Grooming": ["Salon Services", "Mehendi Services"],
  };

  const pricingTypes = [
    "Fixed",
    "Per Square Feet",
    "Per Hour",
    "Per Session",
    "Custom",
  ];
  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Initialize form data
  useEffect(() => {
    const initializeFormData = () => {
      try {
        setLoading(true);

        // Set form data
        setFormData({
          serviceName: service.serviceName || "",
          mainCategory: service.mainCategory || "",
          category: service.category || "",
          serviceType: service.serviceType || "",
          pricingType: service.pricingType || "Fixed",
          servicePrice: service.servicePrice || "",
          availability: service.availability || "",
          serviceAreas: service.serviceAreas || [],
          scopeOfWork: service.scopeOfWork || "",
          workingStartTime: service.workingStartTime || "",
          workingEndTime: service.workingEndTime || "",
          workingDays: service.workingDays || [],
        });

        // Set existing media
        setExistingImages(service?.documents?.photos || []);
        setExistingVideo(service?.documents?.video?.[0] || null);

        // Initialize service areas
        setExistingServiceAreas(service?.serviceAreas || []);
        setNewServiceAreas([]);
        setAreasToRemove([]);
      } catch (err) {
        setError("Failed to initialize service data");
        console.error("Error initializing service:", err);
      } finally {
        setLoading(false);
      }
    };

    if (service) {
      initializeFormData();
    }
  }, [service]);

  // Service Areas Management Functions
  const handleAddNewServiceArea = (newArea) => {
    // Check if area already exists
    const exists = [...existingServiceAreas, ...newServiceAreas].some(
      (area) => area.pincode === newArea.pincode,
    );

    if (!exists) {
      setNewServiceAreas((prev) => [...prev, newArea]);
    }
  };

  const handleRemoveExistingServiceArea = (areaId) => {
    const area = existingServiceAreas.find((a) => a._id === areaId);
    if (area) {
      setAreasToRemove((prev) => [...prev, areaId]);
      setExistingServiceAreas((prev) => prev.filter((a) => a._id !== areaId));
    }
  };

  const handleRemoveNewServiceArea = (index) => {
    setNewServiceAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRestoreServiceArea = (areaId) => {
    const area = service?.serviceAreas?.find((a) => a._id === areaId);
    if (area) {
      setAreasToRemove((prev) => prev.filter((id) => id !== areaId));
      setExistingServiceAreas((prev) => [...prev, area]);
    }
  };

  // Working Days
  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "mainCategory") {
      setFormData((prev) => ({
        ...prev,
        mainCategory: value,
        category: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Media Handling
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const remaining =
      MAX_IMAGES -
      (existingImages.length - imagesToRemove.length) -
      newImages.length;

    if (files.length > remaining) {
      toast.error(`You can upload only ${remaining} more images`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleDeleteImage = (imagePath) => {
  //   setImagesToRemove((prev) => [...prev, imagePath]);
  //   setExistingImages((prev) => prev.filter((img) => img !== imagePath));
  //   toast.success("Image marked for deletion");
  // };

  const handleRestoreImage = (imagePath) => {
    const originalImage = service?.documents?.photos?.find(
      (img) => img === imagePath,
    );
    if (originalImage) {
      setImagesToRemove((prev) => prev.filter((img) => img !== imagePath));
      setExistingImages((prev) => [...prev, originalImage]);
    }
  };

  //   const handleDeleteVideo = () => {
  //     setVideoToRemove(true);
  //     setExistingVideo(null);
  //     toast.success("Video marked for deletion");
  //   };
  //  const handleDeleteImage = async (imagePath) => {
  //     // Check if image is from existing service documents
  //     const isExistingImage = service?.documents?.photos?.includes(imagePath);

  //     if (isExistingImage) {
  //       // Call API to delete from server
  //       setDeletingImage(true);
  //       try {
  //         const response = await request.deleteServiceImage({
  //           serviceId,
  //           imagePath,
  //           type: "photo"
  //         });

  //         // Remove from state only after successful API call
  //         setExistingImages(prev => prev.filter(img => img !== imagePath));

  //         // Show success message
  //         if (response.data && response.data.message) {
  //           toast.success("Image deleted successfully");
  //         }
  //       } catch (error) {
  //         console.error("Failed to delete image", error);
  //         toast.error("Failed to delete image");
  //         setError("Failed to delete image");
  //         // Don't remove from state if API call fails
  //       } finally {
  //         setDeletingImage(false);
  //       }
  //     } else {
  //       // If it's a new image (not yet uploaded), just remove from state
  //       setNewImages(prev => prev.filter(img =>
  //         !(img instanceof File && URL.createObjectURL(img) === imagePath)
  //       ));
  //     }
  //   };

  const handleDeleteImage = async (imagePath) => {
    // Check if image is from existing service documents
    const isExistingImage = service?.documents?.photos?.includes(imagePath);

    if (isExistingImage) {
      // Call API to delete from server
      setDeletingImage(true);
      try {
        const response = await request.deleteServiceImage({
          serviceId,
          imagePath,
          type: "photo",
        });

        // Remove from state only after successful API call
        setExistingImages((prev) => prev.filter((img) => img !== imagePath));

        // Show success message
        if (response.data && response.data.message) {
          toast.success("Image deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete image", error);
        toast.error("Failed to delete image");
        setError("Failed to delete image");
        // Don't remove from state if API call fails
      } finally {
        setDeletingImage(false);
      }
    } else {
      // If it's a new image (not yet uploaded), just remove from state
      setNewImages((prev) =>
        prev.filter(
          (img) =>
            !(img instanceof File && URL.createObjectURL(img) === imagePath),
        ),
      );
    }
  };
  const handleDeleteVideo = async () => {
    // Check if video is from existing service documents
    const isExistingVideo = service?.documents?.video?.includes(existingVideo);

    if (isExistingVideo && existingVideo) {
      setDeletingVideo(true);
      try {
        const response = await request.deleteServiceImage({
          serviceId,
          imagePath: existingVideo,
          type: "video",
        });

        // Remove from state only after successful API call
        setExistingVideo(null);

        // Show success message
        if (response.data && response.data.message) {
          toast.success("Video deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete video", error);
        toast.error("Failed to delete video");
        setError("Failed to delete video");
        // Don't remove from state if API call fails
      } finally {
        setDeletingVideo(false);
      }
    } else if (newVideo) {
      // If it's a new video, just remove from state
      setNewVideo(null);
    }
  };

  const handleRestoreVideo = () => {
    setVideoToRemove(false);
    setExistingVideo(service?.documents?.video?.[0] || null);
  };

  const handleSetNewVideo = (e) => {
    if (e.target.files[0]) {
      setNewVideo(e.target.files[0]);
    }
  };

  const removeNewVideo = () => {
    setNewVideo(null);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare FormData
      const formPayload = new FormData();

      // Add form data
      const dataToSend = {
        ...formData,
        servicePrice: parseInt(formData.servicePrice),
        // Combine existing and new service areas, exclude removed ones
        serviceAreas: [...existingServiceAreas, ...newServiceAreas],
      };

      // Append all data fields
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formPayload.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formPayload.append(key, value.toString());
        }
      });

      // Append areas to remove
      if (areasToRemove.length > 0) {
        formPayload.append("areasToRemove", JSON.stringify(areasToRemove));
      }

      // Append images to remove
      if (imagesToRemove.length > 0) {
        formPayload.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }

      // Append video to remove flag
      if (videoToRemove) {
        formPayload.append("videoToRemove", "true");
      }

      newImages.forEach((img) => {
        formPayload.append("images", img);
      });

      if (newVideo) {
        formPayload.append("video", newVideo);
      }

      // Make API call
      const response = await request.updateService(serviceId, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", response.data);

      // Show success message
      if (response.data.service.isApproved === "pending") {
        toast.success(
          "Service updated successfully! Your changes require admin approval.",
        );
        setSuccess(
          "Service updated successfully! Your changes require admin approval.",
        );
      } else {
        toast.success("Service updated successfully!");
        setSuccess("Service updated successfully!");
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data.service);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update service";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating service:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading service data...</div>;
  }

  return (
    <div className="font-mont mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Service</h2>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">
          {success}
        </div>
      )}

      {/* Show rejection reason if editing a rejected service */}
      {service?.isApproved === "rejected" && service?.rejectionMessage && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
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
              <h3 className="font-semibold text-red-800">
                Service Was Rejected
              </h3>
              <p className="mt-1 text-red-700">{service.rejectionMessage}</p>
              <p className="mt-2 text-sm text-red-600">
                Please address the issues above before resubmitting for
                approval.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Service Name */}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Name *
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Main Category */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Main Category *
            </label>
            <select
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((mainCat) => (
                <option key={mainCat} value={mainCat}>
                  {mainCat}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={!formData.mainCategory}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100"
              required
            >
              <option value="">Select Category</option>
              {formData.mainCategory &&
                subCategories[formData.mainCategory]?.map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
            </select>
          </div>

          {/* Service Type */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Type *
            </label>
            <input
              type="text"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              placeholder="e.g., Fan installation/repair, Pipe leakage repair, 1BHK home cleaning"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe the specific service you offer
            </p>
          </div>

          {/* Pricing Type */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pricing Type
            </label>
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
            >
              {pricingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Service Price */}
          <div className="col-span-2 md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Price (₹) *
            </label>
            <input
              type="text"
              name="servicePrice"
              value={formData.servicePrice}
              onChange={handleInputChange}
              // min="0"
              // step="0.01"
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Availability */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Availability *
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            >
              <option value="">Select Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Anytime">Anytime</option>
              <option value="On Request">On Request</option>
            </select>
          </div>

          {/* Working Hours Section */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Working Hours
            </h3>

            {/* Working Days */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Working Days
              </label>
              <div className="flex flex-wrap gap-2">
                {workingDaysOptions.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWorkingDaysChange(day)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      formData.workingDays.includes(day)
                        ? "border border-blue-300 bg-blue-100 text-blue-800"
                        : "border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="workingStartTime"
                  value={formData.workingStartTime}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="workingEndTime"
                  value={formData.workingEndTime}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Service Areas Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Service Areas
            </h3>

            {/* Existing Service Areas */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Current Service Areas
              </h4>
              <div className="space-y-2">
                {existingServiceAreas.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No service areas added
                  </p>
                ) : (
                  existingServiceAreas.map((area) => (
                    <div
                      key={area._id}
                      className="flex items-center justify-between rounded-md border bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-medium">{area.areaName}</p>
                        <p className="text-sm text-gray-600">
                          {area.pincode} • {area.city}, {area.state}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {areasToRemove.includes(area._id) ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreServiceArea(area._id)}
                            className="flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200"
                          >
                            <FaPlus className="text-xs" /> Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveExistingServiceArea(area._id)
                            }
                            className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                          >
                            <FaMinus className="text-xs" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* New Service Areas */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                New Service Areas (To be added)
              </h4>
              <div className="space-y-2">
                {newServiceAreas.length === 0 ? (
                  <p className="text-sm text-gray-500">No new areas added</p>
                ) : (
                  newServiceAreas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border bg-green-50 p-3"
                    >
                      <div>
                        <p className="font-medium">{area.areaName}</p>
                        <p className="text-sm text-gray-600">
                          {area.pincode} • {area.city}, {area.state}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewServiceArea(index)}
                        className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                      >
                        <FaTrash className="text-xs" /> Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pincode Input for adding new areas */}
            <div className="mb-4">
              <PincodeInput
                onServiceAreasChange={handleAddNewServiceArea}
                label="Add New Service Area"
              />
            </div>

            {/* Summary */}
            <div className="rounded-md bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>Summary:</strong> {existingServiceAreas.length} existing
                area(s), {newServiceAreas.length} new area(s) to add,{" "}
                {areasToRemove.length} area(s) to remove
              </p>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Scope of Work
            </label>
            <textarea
              name="scopeOfWork"
              value={formData.scopeOfWork}
              onChange={handleInputChange}
              rows="3"
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              placeholder="What exactly will you do? Include deliverables, timeline, etc."
            />
          </div>

          {/* Images Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Service Images (Max 4)
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {/* Existing images */}
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${img}`}
                    className="h-32 w-full rounded-md object-cover"
                    alt="service"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    disabled={deletingImage}
                    className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  {deletingImage && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-black">
                      <div className="text-white">Deleting...</div>
                    </div>
                  )}
                </div>
              ))}

              {/* New image previews */}
              {newImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-32 w-full rounded-md object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-xs text-white"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
                    New
                  </div>
                </div>
              ))}

              {/* Upload slot */}
              {existingImages.length -
                imagesToRemove.length +
                newImages.length <
                MAX_IMAGES && (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-teal-500 hover:text-teal-500">
                  <FaPlus className="text-2xl" />
                  <span className="mt-1 text-xs">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAddImage}
                    multiple
                  />
                </label>
              )}
            </div>

            {/* Image Summary */}
            <div className="mt-3 text-sm text-gray-600">
              {existingImages.length - imagesToRemove.length} existing image(s),{" "}
              {newImages.length} new image(s), {imagesToRemove.length} image(s)
              to remove
            </div>
          </div>

          {/* Video Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Service Video (Max 1)
            </h3>

            {/* Existing video */}
            {/* {existingVideo && !videoToRemove && (
              <div className="mb-4">
                <div className="relative w-full max-w-md">
                  <video
                    src={existingVideo}
                    controls
                    className="w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteVideo}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            )} */}
            {/* Existing video */}
            {existingVideo && (
              <div className="relative w-full max-w-md">
                <video
                  src={existingVideo}
                  controls
                  className="w-full rounded-md"
                />
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  disabled={deletingVideo}
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white disabled:opacity-50"
                >
                  <FaTrash className="text-sm" />
                </button>
                {deletingVideo && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-md bg-black">
                    <div className="text-white">Deleting...</div>
                  </div>
                )}
              </div>
            )}

            {/* Video to remove indicator */}
            {videoToRemove && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaTrash className="text-red-600" />
                    <span className="text-sm text-red-800">
                      Video marked for deletion
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreVideo}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Undo
                  </button>
                </div>
              </div>
            )}

            {/* New video preview */}
            {newVideo && (
              <div className="mb-4">
                <div className="relative w-full max-w-md">
                  <video
                    src={URL.createObjectURL(newVideo)}
                    controls
                    className="w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeNewVideo}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload new video */}
            {!existingVideo && !newVideo && !videoToRemove && (
              <div className="mb-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-gray-400 hover:border-teal-500 hover:text-teal-500">
                  <FaPlus className="text-2xl" />
                  <span className="mt-2">Add Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleSetNewVideo}
                  />
                </label>
              </div>
            )}

            {/* Upload new video (when existing is marked for removal) */}
            {videoToRemove && !newVideo && (
              <div className="mb-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-gray-400 hover:border-teal-500 hover:text-teal-500">
                  <FaPlus className="text-2xl" />
                  <span className="mt-2">Add New Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleSetNewVideo}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#0b8263] px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Service"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;
