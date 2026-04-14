import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PincodeInput from "./Pincode";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import {
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  EditorProvider,
} from "react-simple-wysiwyg";
import {
  FiChevronRight,
  FiLoader,
  FiFolder,
  FiList,
  FiGrid,
  FiPackage,
  FiPlus,
} from "react-icons/fi";
import { MdCategory, MdWarning, MdInfo, MdCheckCircle } from "react-icons/md";
import { FaPlus, FaMinus, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const EditServiceForm = ({ onSuccess, onCancel }) => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: "",
    mainCategory: "",
    subCategory: "",
    groupCategory: "",
    category: "",
    pricingType: "Fixed",
    servicePrice: "",
    availability: "",
    serviceAreas: [],
    scopeOfWork: "",
    workingStartTime: "",
    workingEndTime: "",
    workingDays: [],
    warranty: false,
    warrantyPeriod: "",
    warrantyIncludes: "",
  });
  const [service, setService] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categoryPath, setCategoryPath] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
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

  useEffect(() => {
    if (serviceId) {
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
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  // Categories state
  const [categories, setCategories] = useState({
    main: [],
    sub: [],
    group: [],
    service: [],
  });

  const [categoryLoading, setCategoryLoading] = useState({
    main: false,
    sub: false,
    group: false,
    service: false,
  });

  const [selectedCategories, setSelectedCategories] = useState({
    main: null,
    sub: null,
    group: null,
    service: null,
  });

  // Pricing types
  const pricingTypes = [
    "Fixed",
    "Per Square Feet",
    "Per Hour",
    "Per Session",
    "Per Area",
    "Per Unit",
    "Per Meter",
    "Per Room/BHK",
    "Per Seat",
    "Per Point",
    "Starting Price (Inspection Required)",
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

  // Availability options
  const availabilityOptions = ["Weekdays", "Weekends", "Anytime", "On Request"];

  // Fetch main categories on mount
  useEffect(() => {
    fetchMainCategories();
  }, []);

  // Initialize form data when service is provided
  useEffect(() => {
    const initializeFormData = async () => {
      try {
        setLoading(true);

        if (!service?.category) return;

        const res = await request.getCategoryHierarchy(service.category);
        const hierarchy = res.data.data;

        const mainCat = hierarchy.ancestors?.find((c) => c.type === "main");
        const subCat = hierarchy.ancestors?.find((c) => c.type === "sub");
        const groupCat = hierarchy.ancestors?.find((c) => c.type === "group");
        const serviceCat = hierarchy._id;

        setSelectedCategories({
          main: mainCat,
          sub: subCat,
          group: groupCat,
          service: serviceCat,
        });

        setCategoryPath(
          [mainCat, subCat, groupCat, serviceCat].filter(Boolean),
        );

        const updatedData = {
          serviceName: service.serviceName || serviceCat?.name || "",
          mainCategory: mainCat?._id || "",
          subCategory: subCat?._id || "",
          groupCategory: groupCat?._id || "",
          category: serviceCat || "",
          pricingType: service.pricingType || "Fixed",
          servicePrice: service.servicePrice || "",
          availability: service.availability || "",
          serviceAreas: service.serviceAreas || [],
          scopeOfWork: service.scopeOfWork || "",
          workingStartTime: service.workingStartTime || "",
          workingEndTime: service.workingEndTime || "",
          workingDays: service.workingDays || [],
          warranty: service.warranty || false,
          warrantyPeriod: service.warrantyPeriod || "",
          warrantyIncludes: service.warrantyIncludes || "",
        };
        // setFormData((prev) => ({
        //   ...prev,
        //   serviceName: service.serviceName || serviceCat?.name || "",
        //   mainCategory: mainCat?._id || "",
        //   subCategory: subCat?._id || "",
        //   groupCategory: groupCat?._id || "",
        //   category: serviceCat || "",
        //   pricingType: service.pricingType || "Fixed",
        //   servicePrice: service.servicePrice || "",
        //   availability: service.availability || "",
        //   serviceAreas: service.serviceAreas || [],
        //   scopeOfWork: service.scopeOfWork || "",
        //   workingStartTime: service.workingStartTime || "",
        //   workingEndTime: service.workingEndTime || "",
        //   workingDays: service.workingDays || [],
        //   warranty: service.warranty || false,
        //   warrantyPeriod: service.warrantyPeriod || "",
        //   warrantyIncludes: service.warrantyIncludes || "",
        // }));
        setFormData(updatedData);
        setInitialFormData(updatedData);

        if (mainCat) {
          await fetchSubCategories(mainCat._id);
        }
        if (subCat) {
          await fetchGroupCategories(subCat._id);
        }
        if (groupCat) {
          await fetchServiceCategories(groupCat._id);
        }

        setExistingImages(service?.documents?.photos || []);
        setExistingVideo(service?.documents?.video?.[0] || null);
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

  // Fetch functions
  const fetchMainCategories = async () => {
    try {
      setCategoryLoading((prev) => ({ ...prev, main: true }));
      const res = await request.getCategories({ params: { type: "main" } });
      setCategories((prev) => ({
        ...prev,
        main: res.data?.data || [],
      }));
    } catch (error) {
      console.error("Error fetching main categories:", error);
    } finally {
      setCategoryLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const fetchSubCategories = async (parentId) => {
    if (!parentId) return;
    try {
      setCategoryLoading((prev) => ({ ...prev, sub: true }));
      const res = await request.getCategories({
        params: { type: "sub", parent: parentId },
      });
      setCategories((prev) => ({
        ...prev,
        sub: res.data?.data || [],
      }));
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    } finally {
      setCategoryLoading((prev) => ({ ...prev, sub: false }));
    }
  };

  const fetchGroupCategories = async (parentId) => {
    if (!parentId) return;
    try {
      setCategoryLoading((prev) => ({ ...prev, group: true }));
      const res = await request.getCategories({
        params: { type: "group", parent: parentId },
      });
      setCategories((prev) => ({
        ...prev,
        group: res.data?.data || [],
      }));
    } catch (error) {
      console.error("Error fetching group categories:", error);
    } finally {
      setCategoryLoading((prev) => ({ ...prev, group: false }));
    }
  };

  const fetchServiceCategories = async (parentId) => {
    if (!parentId) return;
    try {
      setCategoryLoading((prev) => ({ ...prev, service: true }));
      const res = await request.getCategories({
        params: { type: "service", parent: parentId },
      });
      setCategories((prev) => ({
        ...prev,
        service: res.data?.data || [],
      }));
      // set price range based on selected category
      const selectedCat = res.data?.data?.find(
        (c) => c._id === formData.category,
      );
      if (selectedCat) {
        setPriceRange({
          min: selectedCat.priceRange.min || 0,
          max: selectedCat.priceRange.max || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching service categories:", error);
    } finally {
      setCategoryLoading((prev) => ({ ...prev, service: false }));
    }
  };

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();
  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case "mainCategory":
        return !value ? "Main category is required" : "";

      case "subCategory":
        return formData.mainCategory && !value
          ? "Sub category is required"
          : "";

      case "groupCategory":
        return formData.subCategory && !value
          ? "Group category is required"
          : "";

      case "category":
        return formData.groupCategory && !value
          ? "Service category is required"
          : "";

      case "serviceName":
        return !value?.trim() ? "Service name is required" : "";

      case "servicePrice":
        if (!value) return "Service price is required";
        if (parseFloat(value) <= 0) return "Price must be greater than 0";
        return "";

      case "availability":
        return !value ? "Availability is required" : "";

      case "serviceAreas":
        return existingServiceAreas.length === 0 && newServiceAreas.length === 0
          ? "At least one service area is required"
          : "";

      case "scopeOfWork":
        return !stripHtml(value) ? "Scope of work is required" : "";

      case "workingStartTime":
        return formData.workingEndTime && !value
          ? "Start time is required"
          : "";

      case "workingEndTime":
        if (formData.workingStartTime && !value) return "End time is required";
        if (
          formData.workingStartTime &&
          value &&
          value <= formData.workingStartTime
        ) {
          return "End time must be after start time";
        }
        return "";

      case "warrantyPeriod":
        return formData.warranty && !value?.trim()
          ? "Warranty period is required when warranty is enabled"
          : "";

      case "warrantyIncludes":
        return formData.warranty && !value?.trim()
          ? "Warranty inclusions are required when warranty is enabled"
          : "";

      default:
        return "";
    }
  };

  // Handle blur event
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "mainCategory",
      "subCategory",
      "groupCategory",
      "category",
      "serviceName",
      "servicePrice",
      "availability",
      "scopeOfWork",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Service areas validation
    if (existingServiceAreas.length === 0 && newServiceAreas.length === 0) {
      newErrors.serviceAreas = "At least one service area is required";
    }

    // Working hours validation
    if (formData.workingStartTime && formData.workingEndTime) {
      if (formData.workingEndTime <= formData.workingStartTime) {
        newErrors.workingEndTime = "End time must be after start time";
      }
    }

    // price if in the range or not
    if (formData.servicePrice && selectedCategories.service?.priceRange) {
      const price = parseFloat(formData.servicePrice);
      const min = selectedCategories.service.priceRange.min || 0;
      const max = selectedCategories.service.priceRange.max || 0;
      if (price < min || price > max) {
        newErrors.servicePrice = `Price must be between ₹${min} and ₹${max}`;
      }
      if (price <= 0) {
        newErrors.servicePrice = "Price must be greater than 0";
      }
    }

    // Warranty validation
    if (formData.warranty) {
      if (!formData.warrantyPeriod?.trim()) {
        newErrors.warrantyPeriod = "Warranty period is required";
      }
      if (!formData.warrantyIncludes?.trim()) {
        newErrors.warrantyIncludes = "Warranty inclusions are required";
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(newErrors).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
    );

    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle main category change
  const handleMainCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.main.find((c) => c._id === categoryId);

    setSelectedCategories({
      main: selectedCategory,
      sub: null,
      group: null,
      service: null,
    });

    setFormData((prev) => ({
      ...prev,
      mainCategory: categoryId,
      subCategory: "",
      groupCategory: "",
      category: "",
      serviceName: "",
    }));

    setCategories((prev) => ({
      ...prev,
      sub: [],
      group: [],
      service: [],
    }));

    setCategoryPath(selectedCategory ? [selectedCategory] : []);

    if (categoryId) {
      await fetchSubCategories(categoryId);
    }

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      mainCategory: "",
      subCategory: "",
      groupCategory: "",
      category: "",
      serviceName: "",
    }));
  };

  // Handle sub category change
  const handleSubCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.sub.find((c) => c._id === categoryId);

    setSelectedCategories((prev) => ({
      ...prev,
      sub: selectedCategory,
      group: null,
      service: null,
    }));

    setFormData((prev) => ({
      ...prev,
      subCategory: categoryId,
      groupCategory: "",
      category: "",
      serviceName: "",
    }));

    setCategories((prev) => ({
      ...prev,
      group: [],
      service: [],
    }));

    setCategoryPath((prev) => {
      const main = prev.find((c) => c?.type === "main");
      if (selectedCategory) {
        return [main, selectedCategory].filter(Boolean);
      }
      return [main];
    });

    if (categoryId) {
      await fetchGroupCategories(categoryId);
    }

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      subCategory: "",
      groupCategory: "",
      category: "",
      serviceName: "",
    }));
  };

  // Handle group category change
  const handleGroupCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.group.find((c) => c._id === categoryId);

    setSelectedCategories((prev) => ({
      ...prev,
      group: selectedCategory,
      service: null,
    }));

    setFormData((prev) => ({
      ...prev,
      groupCategory: categoryId,
      category: "",
      serviceName: "",
    }));

    setCategories((prev) => ({
      ...prev,
      service: [],
    }));

    setCategoryPath((prev) => {
      const main = prev.find((c) => c?.type === "main");
      const sub = prev.find((c) => c?.type === "sub");
      if (selectedCategory) {
        return [main, sub, selectedCategory].filter(Boolean);
      }
      return [main, sub].filter(Boolean);
    });

    if (categoryId) {
      await fetchServiceCategories(categoryId);
    }

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      groupCategory: "",
      category: "",
      serviceName: "",
    }));
  };

  // Handle service category change
  const handleServiceCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.service.find(
      (c) => c._id === categoryId,
    );

    setSelectedCategories((prev) => ({
      ...prev,
      service: selectedCategory,
    }));

    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      serviceName: selectedCategory?.name || "",
    }));

    setCategoryPath((prev) => {
      const main = prev.find((c) => c?.type === "main");
      const sub = prev.find((c) => c?.type === "sub");
      const group = prev.find((c) => c?.type === "group");
      if (selectedCategory) {
        return [main, sub, group, selectedCategory].filter(Boolean);
      }
      return [main, sub, group].filter(Boolean);
    });

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      category: "",
      serviceName: "",
    }));
  };
  // console.log(errors, "error");

  // Working days handler
  // const handleWorkingDaysChange = (day) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     workingDays: prev.workingDays.includes(day)
  //       ? prev.workingDays.filter((d) => d !== day)
  //       : [...prev.workingDays, day],
  //   }));
  // };
  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => {
      const updated = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];

      return {
        ...prev,
        workingDays: workingDaysOptions.filter((d) => updated.includes(d)),
      };
    });
  };

  // Service Areas Management
  const handleAddNewServiceArea = (areas) => {
    if (!Array.isArray(areas)) return;
    setNewServiceAreas((prev) => {
      const combined = [...prev, ...areas];
      const unique = combined.filter(
        (area, index, self) =>
          index ===
          self.findIndex(
            (a) => a.pincode === area.pincode && a.areaName === area.areaName,
          ),
      );
      return unique;
    });

    // Clear service areas error
    if (errors.serviceAreas) {
      setErrors((prev) => ({ ...prev, serviceAreas: "" }));
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

  // Image Management
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - existingImages.length - newImages.length;

    if (files.length > remaining) {
      toast.error(`You can upload only ${remaining} more images`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (imagePath) => {
    const isExistingImage = service?.documents?.photos?.includes(imagePath);

    if (isExistingImage) {
      setDeletingImage(true);
      try {
        await request.deleteServiceImage({
          serviceId,
          imagePath,
          type: "photo",
        });
        setExistingImages((prev) => prev.filter((img) => img !== imagePath));
        toast.success("Image deleted successfully");
      } catch (error) {
        console.error("Failed to delete image", error);
        toast.error("Failed to delete image");
      } finally {
        setDeletingImage(false);
      }
    } else {
      setNewImages((prev) =>
        prev.filter(
          (img) =>
            !(img instanceof File && URL.createObjectURL(img) === imagePath),
        ),
      );
    }
  };

  // Video Management
  const handleDeleteVideo = async () => {
    const isExistingVideo = service?.documents?.video?.includes(existingVideo);

    if (isExistingVideo && existingVideo) {
      setDeletingVideo(true);
      try {
        await request.deleteServiceImage({
          serviceId,
          imagePath: existingVideo,
          type: "video",
        });
        setExistingVideo(null);
        toast.success("Video deleted successfully");
      } catch (error) {
        console.error("Failed to delete video", error);
        toast.error("Failed to delete video");
      } finally {
        setDeletingVideo(false);
      }
    } else if (newVideo) {
      setNewVideo(null);
    }
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
    if (!isFormChanged) {
      toast.info("No changes to update");
      return;
    }
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-border");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const cleanServiceAreas = [...existingServiceAreas, ...newServiceAreas]
      .flat()
      .filter(
        (a) =>
          a &&
          typeof a === "object" &&
          a.pincode &&
          a.areaName &&
          a.city &&
          a.state,
      );

    try {
      const formPayload = new FormData();

      const dataToSend = {
        ...formData,
        servicePrice: parseFloat(formData.servicePrice),
        serviceAreas: cleanServiceAreas,
      };

      Object.entries(dataToSend).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formPayload.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formPayload.append(key, value.toString());
        }
      });

      if (areasToRemove.length > 0) {
        formPayload.append("areasToRemove", JSON.stringify(areasToRemove));
      }

      newImages.forEach((img) => {
        formPayload.append("images", img);
      });

      if (newVideo) {
        formPayload.append("video", newVideo);
      }

      const response = await request.updateService(serviceId, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service updated successfully!");
      setSuccess("Service updated successfully!");
      setInitialFormData(formData);
      // if (onSuccess) {
      //   onSuccess(response.data.service);
      // }
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

  // Get icon for category type
  const getCategoryIcon = (type) => {
    switch (type) {
      case "main":
        return <FiFolder className="text-[#0b8263]" />;
      case "sub":
        return <FiList className="text-[#0b8263]" />;
      case "group":
        return <FiGrid className="text-[#0b8263]" />;
      case "service":
        return <FiPackage className="text-[#0b8263]" />;
      default:
        return <MdCategory className="text-[#0b8263]" />;
    }
  };

  // Error component
  const ErrorMessage = ({ field }) => {
    if (!errors[field] || !touched[field]) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
        <FaExclamationCircle className="text-xs" />
        {errors[field]}
      </p>
    );
  };

  const isFormChanged = useMemo(() => {
    if (!initialFormData) return false;

    const isFormDifferent =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);

    const isImagesChanged =
      newImages.length > 0 ||
      imagesToRemove.length > 0 ||
      existingImages.length !== service?.documents?.photos?.length;

    const isVideoChanged =
      newVideo !== null ||
      videoToRemove ||
      (existingVideo || null) !== (service?.documents?.video?.[0] || null);

    const isAreasChanged =
      newServiceAreas.length > 0 || areasToRemove.length > 0;
    console.log(
      newVideo,
      videoToRemove,
      existingVideo,
      service?.documents?.video?.[0],
      "isFormChanged",
    );
    return (
      isFormDifferent || isImagesChanged || isVideoChanged || isAreasChanged
    );
  }, [
    formData,
    initialFormData,
    newImages,
    imagesToRemove,
    existingImages,
    newVideo,
    videoToRemove,
    existingVideo,
    newServiceAreas,
    areasToRemove,
    service,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="animate-spin text-[#0b8263]" size={32} />
        <span className="ml-3 text-gray-600">Loading service data...</span>
      </div>
    );
  }
  console.log("service", selectedCategories);
  return (
    <div className="font-mont mx-auto rounded-lg bg-white p-6 shadow-md lg:max-w-5xl">
      <div className="mb-6">
        <div
          onClick={() => navigate(-1)}
          className="mb-2 cursor-pointer text-sm hover:underline"
        >
          ← Back to Services
        </div>
        <h1 className="text-2xl font-bold">Edit Service</h1>
      </div>

      {/* Category Path Display */}
      {categoryPath.length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm text-gray-600">Current Category Path:</p>
          <div className="flex flex-wrap items-center gap-2">
            {categoryPath.map(
              (cat, index) =>
                cat && (
                  <React.Fragment key={index}>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        cat.type === "main"
                          ? "bg-purple-100 text-purple-800"
                          : ""
                      } ${
                        cat.type === "sub" ? "bg-blue-100 text-blue-800" : ""
                      } ${
                        cat.type === "group"
                          ? "bg-orange-100 text-orange-800"
                          : ""
                      } ${
                        cat.type === "service"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }`}
                    >
                      {getCategoryIcon(cat.type)}
                      {cat.name}
                    </span>
                    {index < categoryPath.length - 1 && (
                      <FiChevronRight className="text-gray-400" />
                    )}
                  </React.Fragment>
                ),
            )}
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700">
          <MdWarning className="text-lg" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700">
          <MdCheckCircle className="text-lg" />
          <span>{success}</span>
        </div>
      )}

      {/* Rejection Reason */}
      {service?.isApproved === "rejected" && service?.rejectionMessage && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <MdWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
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

      <form onSubmit={handleSubmit} noValidate>
        {/* <div className="grid w-full grid-cols-1 md:grid-cols-2"> */}
        <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2">
          {/* Main Category */}
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              Main Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.mainCategory}
              onChange={handleMainCategoryChange}
              onBlur={() => handleBlur("mainCategory")}
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                errors.mainCategory && touched.mainCategory
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Main Category</option>
              {categories.main.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryLoading.main && (
              <FiLoader className="mt-1 animate-spin text-[#0b8263]" />
            )}
            <ErrorMessage field="mainCategory" />
          </div>
          {/* Sub Category */}
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subCategory}
              onChange={handleSubCategoryChange}
              onBlur={() => handleBlur("subCategory")}
              disabled={!formData.mainCategory || categories.sub.length === 0}
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] disabled:bg-gray-100 ${
                errors.subCategory && touched.subCategory
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Sub Category</option>
              {categories.sub.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryLoading.sub && (
              <FiLoader className="mt-1 animate-spin text-[#0b8263]" />
            )}
            <ErrorMessage field="subCategory" />
          </div>
          {/* Group Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.groupCategory}
              onChange={handleGroupCategoryChange}
              onBlur={() => handleBlur("groupCategory")}
              disabled={!formData.subCategory || categories.group.length === 0}
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] disabled:bg-gray-100 ${
                errors.groupCategory && touched.groupCategory
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Service Type</option>
              {categories.group.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryLoading.group && (
              <FiLoader className="mt-1 animate-spin text-[#0b8263]" />
            )}
            <ErrorMessage field="groupCategory" />
          </div>
          {/* Service Category (Final) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={handleServiceCategoryChange}
              onBlur={() => handleBlur("category")}
              disabled={
                !formData.groupCategory || categories.service.length === 0
              }
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] disabled:bg-gray-100 ${
                errors.category && touched.category
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Service</option>
              {categories.service.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryLoading.service && (
              <FiLoader className="mt-1 animate-spin text-[#0b8263]" />
            )}
            <ErrorMessage field="category" />
          </div>
          {/* Service Name */}
          {/* <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("serviceName")}
              placeholder="Enter service name"
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                errors.serviceName && touched.serviceName
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage field="serviceName" />
          </div> */}
          {/* Pricing Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pricing Type
            </label>
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263]"
            >
              {pricingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Service Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Service Price (₹) <span className="text-red-500">*</span>
            </label>
            {selectedCategories.service?.priceRange && (
              <p className="mb-1 text-xs text-gray-500">
                Price must be between ₹
                {selectedCategories.service?.priceRange?.min} and ₹
                {selectedCategories.service?.priceRange?.max}
              </p>
            )}
            <input
              type="number"
              name="servicePrice"
              value={formData.servicePrice}
              onChange={handleInputChange}
              onBlur={() => handleBlur("servicePrice")}
              min={
                selectedCategories.service?.priceRange
                  ? selectedCategories.service?.priceRange?.min
                  : 0
              }
              max={
                selectedCategories.service?.priceRange
                  ? selectedCategories.service?.priceRange?.max
                  : undefined
              }
              step="10"
              placeholder="Enter price"
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                errors.servicePrice && touched.servicePrice
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage field="servicePrice" />
          </div>
          {/* Availability */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Availability <span className="text-red-500">*</span>
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              onBlur={() => handleBlur("availability")}
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                errors.availability && touched.availability
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Availability</option>
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ErrorMessage field="availability" />
          </div>

          {/* Working Hours Section */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <MdInfo className="text-[#0b8263]" />
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
                        ? "bg-[#0b8263] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  onBlur={() => handleBlur("workingStartTime")}
                  className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                    errors.workingStartTime && touched.workingStartTime
                      ? "error-border border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage field="workingStartTime" />
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
                  onBlur={() => handleBlur("workingEndTime")}
                  className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                    errors.workingEndTime && touched.workingEndTime
                      ? "error-border border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage field="workingEndTime" />
              </div>
            </div>
          </div>
          {/* Service Areas Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <MdInfo className="text-[#0b8263]" />
              Service Areas <span className="text-red-500">*</span>
            </h3>

            {/* Error message for service areas */}
            {errors.serviceAreas && touched.serviceAreas && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <FaExclamationCircle />
                  {errors.serviceAreas}
                </p>
              </div>
            )}

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
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
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
                      className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3"
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

            {/* Pincode Input */}
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
          {/* <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Scope of Work <span className="text-red-500">*</span>
            </label>
            <textarea
              name="scopeOfWork"
              value={formData.scopeOfWork}
              onChange={handleInputChange}
              onBlur={() => handleBlur("scopeOfWork")}
              rows="4"
              placeholder="What exactly will you do? Include deliverables, timeline, etc."
              className={`w-full rounded-md border px-3 py-2 focus:border-[#0b8263] focus:ring-[#0b8263] ${
                errors.scopeOfWork && touched.scopeOfWork
                  ? "error-border border-red-500"
                  : "border-gray-300"
              }`}
            />
            <ErrorMessage field="scopeOfWork" />
          </div> */}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Scope of Work
            </label>

            <div className="mt-1 rounded-md border">
              <EditorProvider>
                <Editor
                  value={formData.scopeOfWork}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scopeOfWork: e.target.value,
                    }))
                  }
                  containerProps={{
                    style: { minHeight: "120px" },
                  }}
                >
                  <Toolbar>
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnBulletList />
                    <BtnNumberedList />
                  </Toolbar>
                </Editor>
              </EditorProvider>
            </div>

            {errors.scopeOfWork && (
              <p className="text-xs text-red-500">{errors.scopeOfWork}</p>
            )}
          </div>

          {/* Warranty Toggle */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Warranty:
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    warranty: !prev.warranty,
                  }));
                  if (!formData.warranty) {
                    // Clear warranty errors when enabling
                    setErrors((prev) => ({
                      ...prev,
                      warrantyPeriod: "",
                      warrantyIncludes: "",
                    }));
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                  formData.warranty ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.warranty ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          {/* Warranty Details */}
          {formData.warranty && (
            <div className="col-span-2 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Warranty Period <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("warrantyPeriod")}
                  placeholder="e.g., 6 months, 1 year"
                  className={`mt-1 w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500 ${
                    errors.warrantyPeriod && touched.warrantyPeriod
                      ? "error-border border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage field="warrantyPeriod" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Warranty Includes <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="warrantyIncludes"
                  value={formData.warrantyIncludes}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("warrantyIncludes")}
                  placeholder="e.g., parts, labor, both"
                  rows="3"
                  className={`mt-1 w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500 ${
                    errors.warrantyIncludes && touched.warrantyIncludes
                      ? "error-border border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage field="warrantyIncludes" />
              </div>
            </div>
          )}
          {/* Images Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Service Images (Max {MAX_IMAGES})
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {/* Existing images */}
              {existingImages.map((img, index) => (
                <div key={index} className="group relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${img}`}
                    className="h-32 w-full rounded-md object-cover"
                    alt="service"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    disabled={deletingImage}
                    className="absolute top-1 right-1 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                    title="Delete image"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}

              {/* New image previews */}
              {newImages.map((file, index) => (
                <div key={index} className="group relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-32 w-full rounded-md object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Remove image"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
                    New
                  </div>
                </div>
              ))}

              {/* Upload slot */}
              {existingImages.length + newImages.length < MAX_IMAGES && (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-[#0b8263] hover:text-[#0b8263]">
                  <FiPlus className="text-2xl" />
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
          </div>
          {/* Video Management */}
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Service Video (Max 1)
            </h3>

            {/* Existing video */}
            {existingVideo && (
              <div className="group relative w-full max-w-md">
                <video
                  src={`${import.meta.env.VITE_API_URL}${existingVideo}`}
                  controls
                  className="w-full rounded-md"
                />
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  disabled={deletingVideo}
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  title="Delete video"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            )}

            {/* New video preview */}
            {newVideo && (
              <div className="mb-4">
                <div className="group relative w-full max-w-md">
                  <video
                    src={URL.createObjectURL(newVideo)}
                    controls
                    className="w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeNewVideo}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Remove video"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload new video */}
            {!existingVideo && !newVideo && (
              <div className="mb-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-gray-400 transition-colors hover:border-[#0b8263] hover:text-[#0b8263]">
                  <FiPlus className="text-2xl" />
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
          </div>
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="col-span-2 rounded-md bg-red-50 p-4">
              <h4 className="mb-2 flex items-center gap-1 font-medium text-red-800">
                <MdWarning className="text-lg" />
                Please fix the following errors:
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Buttons */}
          <div className="col-span-2 mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              // onClick={onCancel}
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              // disabled={submitting || !formData.category}
              disabled={submitting || !isFormChanged}
              className={`flex items-center gap-2 ${isFormChanged ? "cursor-pointer" : "cursor-not-allowed"} " rounded-md bg-[#0b8263] px-6 py-2 text-white transition-colors hover:bg-[#096d52] disabled:opacity-50`}
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" />
                  Updating...
                </>
              ) : (
                <div>Update Service</div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;
