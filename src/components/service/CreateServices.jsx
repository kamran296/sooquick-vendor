import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import PincodeInput from "./Pincode";
import request from "../../axios/requests";
import {
  mainCategories,
  serviceTypeExamples,
  subCategories,
} from "../../utils/categories";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";
const FileUploadSection = ({ images, setImages, video, setVideo }) => {
  const imageInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const videoInputRef = useRef(null);

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
    }
  };

  const handleImageDivClick = (index) => {
    imageInputRefs[index].current?.click();
  };

  const handleVideoDivClick = () => {
    videoInputRef.current?.click();
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-700">
          Upload Photos
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Photo {index + 1}
              </label>

              {images[index] ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-all hover:border-teal-400 hover:bg-teal-50"
                  onClick={() => handleImageDivClick(index)}
                >
                  <input
                    type="file"
                    ref={imageInputRefs[index]}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <svg
                        className="h-6 w-6 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, JPEG
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-700">Upload Video</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Video
          </label>

          {video ? (
            <div className="relative">
              <div className="flex h-40 w-full items-center justify-center rounded-lg border bg-gray-200">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="truncate text-sm text-gray-700">{video.name}</p>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-sm font-medium text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-teal-400 hover:bg-teal-50"
              onClick={handleVideoDivClick}
            >
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <svg
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload video
                  </p>
                  <p className="mt-1 text-xs text-gray-500">MP4, MOV, AVI</p>
                </div>

                <button
                  type="button"
                  className="rounded-md bg-teal-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-teal-700"
                >
                  Browse Files
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateService = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    mainCategory: "",
    category: "",
    serviceType: "",
    servicePrice: "",
    // description: "",
    scopeOfWork: "",
    postalCodes: "",
    availability: "",
    workingStartTime: "",
    workingEndTime: "",
    workingDays: [],
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarTab(1));
  }, []);

  // State for file uploads - using the 4 individual images approach
  const [images, setImages] = useState([null, null, null, null]);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [serviceAreas, setServiceAreas] = useState([]);
  const user = useSelector((state) => state.user);

  const handlePincodesChange = (pincodes) => {
    setServiceAreas(pincodes);
    // If you need to keep the postalCodes field for backward compatibility
    setFormData({
      ...formData,
      postalCodes: pincodes.join(","),
    });
  };

  const handleServiceAreasChange = (areas) => {
    setServiceAreas(areas);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If mainCategory changes, reset category and serviceType
    if (name === "mainCategory") {
      setFormData({
        ...formData,
        mainCategory: value,
        category: "",
        serviceType: "",
      });
    }
    // If category changes, reset serviceType
    else if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        serviceType: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // UPDATED: Added new required fields
    if (!formData.serviceName.trim())
      newErrors.serviceName = "Service name is required";
    if (!formData.mainCategory)
      newErrors.mainCategory = "Main category is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.serviceType.trim())
      newErrors.serviceType = "Service type is required";
    if (!formData.servicePrice || parseFloat(formData.servicePrice) <= 0)
      newErrors.servicePrice = "Valid service price is required";
    // if (!formData.description.trim())
    //   newErrors.description = "Description is required";
    if (!formData.scopeOfWork.trim())
      newErrors.scopeOfWork = "Scope of work is required";
    if (serviceAreas.length === 0) {
      newErrors.serviceAreas = "At least one service area is required";
    }
    if (!formData.availability)
      newErrors.availability = "Availability is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append service areas as JSON
      formDataToSend.append("serviceAreas", JSON.stringify(serviceAreas));
      formDataToSend.append(
        "workingDays",
        JSON.stringify(formData.workingDays),
      );

      // Append images (filter out null values)
      images
        .filter((img) => img !== null)
        .forEach((image) => {
          formDataToSend.append("images", image); // Use same field name for all images
        });

      // Append video if exists
      if (video) {
        formDataToSend.append("video", video);
      }

      // Debug: Log all form data entries

      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await request.createService(formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Service created successfully! Waiting for admin approval.");

      // Reset form
      setFormData({
        serviceName: "",
        mainCategory: "",
        category: "",
        serviceType: "",
        servicePrice: "",
        // description: "",
        scopeOfWork: "",
        postalCodes: "",
        availability: "",
        workingStartTime: "",
        workingEndTime: "",
        workingDays: [],
      });

      // Reset service areas
      setServiceAreas([]);

      // Reset file uploads
      setImages([null, null, null, null]);
      setVideo(null);

      setErrors({});
    } catch (error) {
      console.error("Error creating service:", error);
      setMessage(
        "Error creating service: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  if (user.kycVerified === "pending") {
    return (
      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Complete KYC Verification
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                You need to complete KYC verification to start creating
                services.
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/kyc-verification")} // Update with your KYC route
            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:outline-none"
          >
            Complete KYC
          </button>
        </div>
      </div>
    );
  }

  if (user.kycVerified === "requested") {
    return (
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              KYC Under Verification
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Your KYC documents are under verification. Once verified, you'll
              be able to create services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-5 max-w-5xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Create New Service
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Other form fields remain the same as before */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.serviceName && (
            <p className="text-xs text-red-500">{errors.serviceName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Category *
          </label>
          <select
            name="mainCategory"
            value={formData.mainCategory}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select Main Category</option>
            {mainCategories.map((mainCat) => (
              <option key={mainCat} value={mainCat}>
                {mainCat}
              </option>
            ))}
          </select>
          {errors.mainCategory && (
            <p className="text-xs text-red-500">{errors.mainCategory}</p>
          )}
        </div>

        {/* UPDATED: Category (now sub-category) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={!formData.mainCategory}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500 disabled:bg-gray-100"
          >
            <option value="">Select Category</option>
            {formData.mainCategory &&
              subCategories[formData.mainCategory]?.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category}</p>
          )}
        </div>
        {/* NEW: Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Type *
          </label>
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
            placeholder="e.g., Fan installation/repair, Pipe leakage repair, 1BHK home cleaning"
            list="serviceTypeSuggestions"
          />
          {/* Suggestions for service types */}
          <datalist id="serviceTypeSuggestions">
            {formData.category &&
              serviceTypeExamples[formData.category]?.map((type, index) => (
                <option key={index} value={type} />
              ))}
          </datalist>
          {errors.serviceType && (
            <p className="text-xs text-red-500">{errors.serviceType}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Describe the specific service you offer
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Price (₹)
          </label>
          <input
            type="number"
            step="10"
            min={0}
            name="servicePrice"
            value={formData.servicePrice}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.servicePrice && (
            <p className="text-xs text-red-500">{errors.servicePrice}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scope of Work
          </label>
          <textarea
            name="scopeOfWork"
            value={formData.scopeOfWork}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.scopeOfWork && (
            <p className="text-xs text-red-500">{errors.scopeOfWork}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Codes (comma separated)
          </label>

          <PincodeInput onServiceAreasChange={handleServiceAreasChange} />

          {errors.postalCodes && (
            <p className="text-xs text-red-500">{errors.postalCodes}</p>
          )}
        </div>

        <div className="pt-6">
          <h3 className="mb-3 text-lg font-medium text-gray-900">
            Working Hours
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="">Select Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Anytime">Anytime</option>
              <option value="On Request">On Request</option>
            </select>
            {errors.availability && (
              <p className="text-xs text-red-500">{errors.availability}</p>
            )}
          </div>
          {/* Days Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Available Days
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    formData.workingDays.includes(day)
                      ? "border border-teal-300 bg-teal-100 text-teal-800"
                      : "border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="workingStartTime"
                value={formData.workingStartTime}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="workingEndTime"
                value={formData.workingEndTime}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Enhanced File Upload Section */}
        <div>
          {/* <h3 className="mb-4 text-lg font-medium text-gray-700">
            Upload Photos and Videos
          </h3> */}

          <FileUploadSection
            images={images}
            setImages={setImages}
            video={video}
            setVideo={setVideo}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#0b8263] px-4 py-2 text-white hover:bg-teal-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Creating Service..." : "Create Service"}
        </button>

        {message && (
          <div
            className={`rounded-md p-3 ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
export default CreateService;
