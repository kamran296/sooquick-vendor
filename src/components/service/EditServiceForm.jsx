import React, { useState, useEffect } from "react";
import axios from "axios";
import PincodeInput from "./Pincode";
import request from "../../axios/requests";

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
    // description: "",
    workingStartTime: "", // NEW
    workingEndTime: "", // NEW
    workingDays: [], // NEW
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Category structure matching your backend
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
    "Fitness & Grooming": [
      "Salon Services",
      "Massage Therapy",
      "Spa Services",
      "Mehendi Services",
      "Makeup Services",
      "Fitness Training",
      "Yoga",
      "Dietician Services",
    ],
  };

  const pricingTypes = [
    "Fixed",
    "Per Square Feet",
    "Per Hour",
    "Per Session",
    "Custom",
  ];

  // Set service data on component mount
  useEffect(() => {
    const initializeFormData = () => {
      try {
        setLoading(true);

        // Map the service data to the new form structure
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
          // description: service.description || "",
          workingStartTime: service.workingStartTime || "",
          workingEndTime: service.workingEndTime || "",
          workingDays: service.workingDays || [],
        });
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
  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

    // If mainCategory changes, reset category
    if (name === "mainCategory") {
      setFormData((prev) => ({
        ...prev,
        mainCategory: value,
        category: "", // Reset category when main category changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleServiceAreasChange = (areas) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: areas,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API - ensure serviceAreas is properly formatted
      const submitData = {
        ...formData,
        servicePrice: parseFloat(formData.servicePrice),
        workingDays: formData.workingDays,
        // serviceAreas will be handled by the API parsing logic
      };

      const response = await request.updateService(serviceId, submitData);
      console.log(response.data);
      setSuccess("Service updated successfully!");

      // Show warning if service needs re-approval
      if (response.data.service.isApproved === "pending") {
        setSuccess(
          "Service updated successfully! Your changes require admin approval.",
        );
      }

      if (onSuccess) onSuccess(response.data.service);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service");
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
      {/* <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Service</h2> */}

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

      {/* <div className="mb-4 rounded-md bg-yellow-50 p-3 text-yellow-700">
        <p className="text-sm">
          <strong>Note:</strong> Changing service name, category, or price will
          require admin approval.
        </p>
      </div> */}

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
              type="number"
              name="servicePrice"
              value={formData.servicePrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
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

          {/* Service Areas */}
          <div className="col-span-2">
            {/* <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Areas *
            </label> */}
            <PincodeInput
              onServiceAreasChange={handleServiceAreasChange}
              initialAreas={formData.serviceAreas}
            />
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

          {/* Description */}
          {/* <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              placeholder="Describe your service in detail..."
            />
          </div> */}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
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
      </form>
    </div>
  );
};

export default EditServiceForm;
