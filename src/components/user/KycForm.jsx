import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getKycInfo,
  submitKycInfo,
  updateKycData,
  updateDocument,
  removeDocument,
  updateBusinessType,
} from "../../redux/slices/kycSlice";

// Validation utilities
const validateAadhaar = (aadhaar) => {
  const cleaned = aadhaar.replace(/\D/g, "");
  if (cleaned.length !== 12) return false;

  // Aadhaar validation algorithm (verhoeff check)
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  let c = 0;
  const reversed = cleaned.split("").reverse().join("");

  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[i % 8][parseInt(reversed[i])]];
  }

  return c === 0;
};

const validatePAN = (pan) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan.toUpperCase());
};

const validateGST = (gst) => {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gst.toUpperCase());
};

// Status Display Component
const StatusCard = ({ status }) => {
  const statusConfig = {
    pending: {
      title: "KYC Verification Required",
      description:
        "Please complete your KYC verification to continue using our services.",
      icon: "⏳",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    requested: {
      title: "KYC Under Review",
      description:
        "Your KYC submission is being reviewed. You'll be notified once verified.",
      icon: "📋",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    verified: {
      title: "KYC Verified",
      description:
        "Your KYC has been successfully verified. You can now access all features.",
      icon: "✅",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    rejected: {
      title: "KYC Rejected",
      description:
        "Your KYC submission was rejected. Please review and resubmit.",
      icon: "❌",
      color: "text-red-600 bg-red-50 border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`rounded-xl border-2 ${config.color} mb-8 p-6`}>
      <div className="flex items-center gap-4">
        <div className="text-3xl">{config.icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{config.title}</h3>
          <p className="mt-1 text-sm">{config.description}</p>
        </div>
      </div>
    </div>
  );
};

// Data Display Component
const DataDisplay = ({ label, value, type = "text" }) => {
  if (!value) return null;

  return (
    <div className="mb-4">
      <dt className="mb-1 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-900">
        {type === "file" ? (
          <a
            href={`${import.meta.env.VITE_API_URL}${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800 hover:underline"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Document
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

// File Input Component (Improved)
const FileInput = ({
  label,
  documentType,
  accept,
  file,
  onFileUpload,
  onRemoveFile,
  required = false,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDivClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const extractFileName = (path) => {
    if (!path) return "";
    const justName = path.split("/").pop();
    return justName.replace(/^\d+-/, "");
  };

  const isFileObject =
    file &&
    typeof file === "object" &&
    (file instanceof File || (file.name && file.size));
  const fileName = isFileObject
    ? file.name
    : typeof file === "string"
      ? extractFileName(file)
      : "";

  useEffect(() => {
    if (isFileObject) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof file === "string") {
      setPreviewUrl(`${import.meta.env.VITE_API_URL}${file}`);
    } else {
      setPreviewUrl(null);
    }
  }, [file, isFileObject]);

  const isImage = fileName && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  const isPDF = fileName && /\.pdf$/i.test(fileName);

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {file ? (
        <div className="relative rounded-lg border bg-gray-50 p-4 transition-all hover:bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isImage && previewUrl ? (
                <div className="h-16 w-16 overflow-hidden rounded-md border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : isPDF ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-red-100">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col">
                <span className="max-w-xs truncate text-sm font-medium text-gray-900">
                  {fileName || "Uploaded file"}
                </span>
                {isFileObject && (
                  <span className="text-xs text-gray-500">
                    Size: {Math.round(file.size / 1024)} KB
                  </span>
                )}
              </div>
            </div>

            {!disabled && (
              <button
                type="button"
                className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                onClick={() => onRemoveFile(documentType)}
                disabled={disabled}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-all ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-teal-400 hover:bg-teal-50"}`}
          onClick={handleDivClick}
        >
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            onChange={(e) => onFileUpload(e, documentType)}
            className="hidden"
            disabled={disabled}
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                {disabled
                  ? "Document uploaded"
                  : `Click to upload ${label.toLowerCase()}`}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {accept === "*" ? "Any file type" : `Formats: ${accept}`}
              </p>
            </div>

            {!disabled && (
              <button
                type="button"
                className="rounded-md bg-teal-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-teal-700"
              >
                Browse Files
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Form Components
const IndividualForm = ({ formData, onChange, errors, disabled }) => {
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "aadhaarNumber":
        if (value && !validateAadhaar(value)) {
          error = "Enter valid 12-digit Aadhaar number";
        }
        break;
      case "panNumber":
        if (value && !validatePAN(value)) {
          error = "Enter valid PAN (e.g., ABCDE1234F)";
        }
        break;
      default:
        break;
    }

    return error;
  };

  return (
    <div className="font-mont space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="aadhaarNumber"
          value={formData.aadhaarNumber || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 12);
            onChange(e.target.name, value);
          }}
          className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.aadhaarNumber ? "border-red-500" : "border-gray-300"}`}
          placeholder="Enter 12-digit Aadhaar number"
          disabled={disabled}
          required
        />
        {errors.aadhaarNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.aadhaarNumber}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          PAN Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber || ""}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            onChange(e.target.name, value);
          }}
          className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.panNumber ? "border-red-500" : "border-gray-300"}`}
          placeholder="ABCDE1234F"
          disabled={disabled}
          required
        />
        {errors.panNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
        )}
      </div>
    </div>
  );
};

const CompanyForm = ({ formData, onChange, errors, disabled }) => {
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "companyName":
        if (!value.trim()) {
          error = "Company name is required";
        }
        break;
      case "panNumber":
        if (value && !validatePAN(value)) {
          error = "Enter valid PAN (e.g., ABCDE1234F)";
        }
        break;
      case "gstNumber":
        if (value && !validateGST(value)) {
          error = "Enter valid GST number";
        }
        break;
      case "landlineNumber":
        if (value && !/^[0-9+\-\s]{6,15}$/.test(value)) {
          error = "Enter valid landline number";
        }
        break;
      default:
        break;
    }

    return error;
  };

  return (
    <div className="font-mont space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter company name"
            disabled={disabled}
            required
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Landline Number
          </label>
          <input
            type="tel"
            name="landlineNumber"
            value={formData.landlineNumber || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.landlineNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="+91-XX-XXXXXXX"
            disabled={disabled}
          />
          {errors.landlineNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.landlineNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              onChange(e.target.name, value);
            }}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.panNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="ABCDE1234F"
            disabled={disabled}
            required
          />
          {errors.panNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            GST Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              onChange(e.target.name, value);
            }}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none ${errors.gstNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="22ABCDE1234F1Z5"
            disabled={disabled}
            required
          />
          {errors.gstNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main KYC Component
const KycForm = () => {
  const dispatch = useDispatch();
  const { kycData, loading, error, success, kycStatus } = useSelector(
    (state) => state.kyc,
  );

  const [formData, setFormData] = useState({
    businessType: "company",
    companyName: "",
    landlineNumber: "",
    panNumber: "",
    gstNumber: "",
    aadhaarNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    dispatch(getKycInfo());
  }, [dispatch]);

  useEffect(() => {
    if (kycData) {
      setFormData((prev) => ({
        ...prev,
        ...kycData,
      }));
    }
  }, [kycData]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update Redux
    dispatch(updateKycData({ [name]: value }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    let error = "";
    const value = formData[name];

    if (formData.businessType === "individual") {
      if (name === "aadhaarNumber") {
        if (!value) error = "Aadhaar number is required";
        else if (!validateAadhaar(value))
          error = "Enter valid 12-digit Aadhaar";
      } else if (name === "panNumber") {
        if (!value) error = "PAN number is required";
        else if (!validatePAN(value)) error = "Enter valid PAN";
      }
    } else {
      if (name === "companyName" && !value) {
        error = "Company name is required";
      } else if (name === "panNumber") {
        if (!value) error = "PAN number is required";
        else if (!validatePAN(value)) error = "Enter valid PAN";
      } else if (name === "gstNumber") {
        if (!value) error = "GST number is required";
        else if (!validateGST(value)) error = "Enter valid GST number";
      } else if (
        name === "landlineNumber" &&
        value &&
        !/^[0-9+\-\s]{6,15}$/.test(value)
      ) {
        error = "Enter valid landline number";
      }
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBusinessTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      businessType: type,
      ...(type === "individual" && { gstNumber: "", companyName: "" }),
    }));

    // Update Redux
    dispatch(updateBusinessType(type));
    dispatch(updateKycData({ businessType: type }));
  };

  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateDocument({ documentType, file }));
    }
  };

  const handleRemoveFile = (documentType) => {
    dispatch(removeDocument({ documentType }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.businessType === "individual") {
      if (!formData.aadhaarNumber) {
        newErrors.aadhaarNumber = "Aadhaar number is required";
      } else if (!validateAadhaar(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Enter valid 12-digit Aadhaar number";
      }

      if (!formData.panNumber) {
        newErrors.panNumber = "PAN number is required";
      } else if (!validatePAN(formData.panNumber)) {
        newErrors.panNumber = "Enter valid PAN number";
      }
    } else {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = "Company name is required";
      }

      if (!formData.panNumber) {
        newErrors.panNumber = "PAN number is required";
      } else if (!validatePAN(formData.panNumber)) {
        newErrors.panNumber = "Enter valid PAN number";
      }

      if (!formData.gstNumber) {
        newErrors.gstNumber = "GST number is required";
      } else if (!validateGST(formData.gstNumber)) {
        newErrors.gstNumber = "Enter valid GST number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(submitKycInfo());
    }
  };

  // If KYC is not pending, show data display
  if (kycStatus && kycStatus !== "pending" && kycStatus !== "rejected") {
    return (
      <div className="font-mont min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              KYC Verification
            </h1>
            <p className="mt-2 text-gray-600">
              View your KYC verification details
            </p>
          </div>

          <StatusCard status={kycStatus} />

          {kycStatus === "rejected" && kycData?.kycRejectionMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">Reason for rejection</p>
              <p className="mt-1 text-sm text-red-700">
                {kycData.kycRejectionMessage}
              </p>
            </div>
          )}

          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Business Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your business details and documents
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Profile Details
                </h3>
                <dl className="space-y-4">
                  <DataDisplay
                    label="Business Type"
                    value={
                      formData.businessType === "company"
                        ? "Company"
                        : "Individual"
                    }
                  />
                  {formData.businessType === "company" && (
                    <>
                      <DataDisplay
                        label="Company Name"
                        value={formData.companyName}
                      />
                      <DataDisplay
                        label="Landline Number"
                        value={formData.landlineNumber}
                      />
                      <DataDisplay
                        label="GST Number"
                        value={formData.gstNumber}
                      />
                    </>
                  )}
                  {formData.businessType === "individual" && (
                    <DataDisplay
                      label="Aadhaar Number"
                      value={formData.aadhaarNumber}
                    />
                  )}
                  <DataDisplay label="PAN Number" value={formData.panNumber} />
                </dl>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Documents
                </h3>
                <dl className="space-y-4">
                  <DataDisplay
                    label="PAN Card"
                    value={kycData.documents?.panCard}
                    type="file"
                  />
                  <DataDisplay
                    label="Cancelled Cheque"
                    value={kycData.documents?.cancelledCheque}
                    type="file"
                  />
                  {formData.businessType === "company" && (
                    <>
                      <DataDisplay
                        label="GST Certificate"
                        value={kycData.documents?.gstCertificate}
                        type="file"
                      />
                      <DataDisplay
                        label="CIN Certificate"
                        value={kycData.documents?.cinCertificate}
                        type="file"
                      />
                    </>
                  )}
                  {formData.businessType === "individual" && (
                    <DataDisplay
                      label="Aadhaar Card"
                      value={kycData.documents?.aadhaarCard}
                      type="file"
                    />
                  )}
                </dl>
              </div>
            </div>

            {kycStatus === "rejected" && (
              <div className="mt-8 border-t pt-6">
                <button
                  onClick={() => dispatch(getKycInfo())}
                  className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
                >
                  Update and Resubmit KYC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show form if KYC is pending or rejected
  return (
    <div className="font-mont min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete KYC Verification
          </h1>
          <p className="mt-2 text-gray-600">
            Verify your identity to access all features
          </p>
        </div>

        <StatusCard status={kycStatus} />

        <div className="rounded-xl bg-white p-6 shadow-lg">
          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    KYC submitted successfully!
                  </p>
                  <p className="text-sm text-green-700">
                    Your documents are under review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Select Business Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleBusinessTypeChange("company")}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${formData.businessType === "company" ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}
                  disabled={kycStatus === "requested"}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${formData.businessType === "company" ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}
                    >
                      {formData.businessType === "company" && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Company</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        GST and business documents required
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleBusinessTypeChange("individual")}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${formData.businessType === "individual" ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}
                  disabled={kycStatus === "requested"}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${formData.businessType === "individual" ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}
                    >
                      {formData.businessType === "individual" && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Individual
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        PAN and cancelled cheque only
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                {formData.businessType === "company"
                  ? "Company Details"
                  : "Personal Details"}
              </h3>

              {formData.businessType === "company" ? (
                <CompanyForm
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                  disabled={kycStatus === "requested"}
                />
              ) : (
                <IndividualForm
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                  disabled={kycStatus === "requested"}
                />
              )}
            </div>

            <div className="mb-8">
              <div className="mb-6 border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Required Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload clear photos or scanned copies
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FileInput
                  label="PAN Card"
                  documentType="panCard"
                  accept="image/*,.pdf"
                  file={kycData.documents?.panCard}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                  required
                  disabled={kycStatus === "requested"}
                />

                {formData.businessType === "individual" && (
                  <FileInput
                    label="Aadhaar Card"
                    documentType="aadhaarCard"
                    accept="image/*,.pdf"
                    file={kycData.documents?.aadhaarCard}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={handleRemoveFile}
                    required
                    disabled={kycStatus === "requested"}
                  />
                )}

                {formData.businessType === "company" && (
                  <>
                    <FileInput
                      label="GST Certificate"
                      documentType="gstCertificate"
                      accept="image/*,.pdf"
                      file={kycData.documents?.gstCertificate}
                      onFileUpload={handleFileUpload}
                      onRemoveFile={handleRemoveFile}
                      required
                      disabled={kycStatus === "requested"}
                    />
                    <FileInput
                      label="CIN Certificate"
                      documentType="cinCertificate"
                      accept="image/*,.pdf"
                      file={kycData.documents?.cinCertificate}
                      onFileUpload={handleFileUpload}
                      onRemoveFile={handleRemoveFile}
                      required
                      disabled={kycStatus === "requested"}
                    />
                  </>
                )}

                <FileInput
                  label="Cancelled Cheque / Bank Statement"
                  documentType="cancelledCheque"
                  accept="image/*,.pdf"
                  file={kycData.documents?.cancelledCheque}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                  required
                  disabled={kycStatus === "requested"}
                />
              </div>
            </div>

            {kycStatus !== "requested" && (
              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={loading || kycStatus === "requested"}
                  className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors ${loading ? "cursor-not-allowed bg-gray-400" : "bg-teal-600 hover:bg-teal-700"}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit KYC Verification"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  By submitting, you agree to our terms and confirm the
                  information is accurate
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KycForm;
