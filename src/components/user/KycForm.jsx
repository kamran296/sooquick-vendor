import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getKycInfo,
  submitKycInfo,
  updateKycData,
  updateDocument,
  removeDocument,
} from "../../redux/slices/kycSlice";

// Create a separate component for the file input
const FileInput = ({
  label,
  documentType,
  accept,
  file,
  onFileUpload,
  onRemoveFile,
}) => {
  const inputRef = useRef(null);

  const handleDivClick = () => {
    inputRef.current?.click();
  };

  const extractFileName = (path) => {
    if (!path) return "";

    // Remove folder path
    const justName = path.split("/").pop();

    // Remove timestamp prefix (e.g., 1756412594496-)
    return justName.replace(/^\d+-/, "");
  };

  // Check if file is a File object (new upload) or a reference object (from server)
  // const isFileObject = file && typeof file === "object" && file instanceof File;
  const isFileObject =
    file &&
    typeof file === "object" &&
    (file instanceof File ||
      (typeof file.name === "string" &&
        typeof file.size === "number" &&
        typeof file.type === "string"));
  const isReferenceObject =
    file && typeof file === "object" && file.name && !(file instanceof File);
  const fileName = isFileObject
    ? file.name
    : isReferenceObject
      ? file.name
      : extractFileName(file);
  console.log(fileName, "fileName");

  const isImage = fileName && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  const isPDF = fileName && /\.pdf$/i.test(fileName);
  console.log(file, "file");
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {file ? (
        <div className="relative rounded-lg border bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isImage ? (
                <div className="h-16 w-16 overflow-hidden rounded-md border">
                  <img
                    src={
                      // isReferenceObject
                      //   ?
                      `${import.meta.env.VITE_API_URL}${file}`
                      // : URL.createObjectURL(file)
                    }
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
                <span className="max-w-xs truncate text-sm font-medium">
                  {/* {isFileObject
                    ? file.name.length > 15
                      ? `${file.name.substring(0, 15)}...`
                      : file.name
                    : isReferenceObject
                      ? file.name.length > 20
                        ? `${file.name.substring(0, 15)}...`
                        : file.name
                      : file || "Uploaded file"} */}
                  {fileName.length > 15
                    ? `${fileName.substring(0, 15)}...`
                    : fileName || "Uploaded file"}
                </span>
                {isFileObject && (
                  <span className="text-xs text-gray-500">
                    {file.size
                      ? `Size: ${Math.round(file.size / 1024)} KB`
                      : ""}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              onClick={() => onRemoveFile(documentType)}
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
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-teal-400 hover:bg-teal-50"
          onClick={handleDivClick}
        >
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            onChange={(e) => onFileUpload(e, documentType)}
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload {label.toLowerCase()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: {accept === "*" ? "Any file type" : accept}
              </p>
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
  );
};

const KycForm = () => {
  const dispatch = useDispatch();
  const { kycData, loading, error, success, kycStatus } = useSelector(
    (state) => state.kyc,
  );

  const [localData, setLocalData] = useState({
    companyName: "",
    landlineNumber: "",
    panNumber: "",
    gstNumber: "",
    businessType: "company",
    ...kycData,
  });

  useEffect(() => {
    dispatch(getKycInfo());
  }, [dispatch]);

  useEffect(() => {
    if (kycData) {
      setLocalData((prev) => ({
        ...prev,
        ...kycData,
        // Only update businessType if it's different and valid
        businessType: kycData.businessType || prev.businessType,
      }));
    }
  }, [kycData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  const handleBusinessTypeChange = (type) => {
    // Update both local state and Redux state
    setLocalData({
      ...localData,
      businessType: type,
      ...(type === "individual" && { gstNumber: "" }),
    });

    // Also update Redux to ensure consistency
    dispatch(
      updateKycData({
        businessType: type,
        ...(type === "individual" && { gstNumber: "" }),
      }),
    );
  };

  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateDocument({ documentType, file }));
    }
  };

  const handleRemoveFile = (documentType, index = null) => {
    dispatch(removeDocument({ documentType, index }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateKycData(localData));
    dispatch(submitKycInfo()); // No need to pass localData
  };

  if (kycStatus === "verified") {
    return (
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold">KYC Verification</h2>
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          Your KYC has been verified. You can now proceed to create and post
          services.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">KYC Verification</h2>

      {kycStatus === "requested" && (
        <div className="mb-4 rounded border border-teal-400 bg-teal-100 px-4 py-3 text-teal-700">
          Your KYC is under review. You will be notified once it's verified.
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          KYC information submitted successfully! Your documents are under
          review.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={kycStatus === "requested" || success}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleBusinessTypeChange("company")}
                className={`flex-1 rounded-lg border px-4 py-3 text-center transition-colors ${
                  localData.businessType === "company"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">Company</div>
                <div className="mt-1 text-xs text-gray-500">
                  GST and business documents required
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleBusinessTypeChange("individual")}
                className={`flex-1 rounded-lg border px-4 py-3 text-center transition-colors ${
                  localData.businessType === "individual"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">Individual</div>
                <div className="mt-1 text-xs text-gray-500">
                  PAN and cancelled cheque only
                </div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {localData.businessType === "company"
                ? "Company Name"
                : "Full Name"}
            </label>
            <input
              type="text"
              name="companyName"
              value={localData.companyName || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {localData.businessType === "company" && (
            <div className="mb-4">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Landline Number
              </label>
              <input
                type="text"
                name="landlineNumber"
                value={localData.landlineNumber || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={localData.panNumber || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {localData.businessType === "company" && (
            <div className="mb-4">
              <label className="mb-1 text-sm font-medium text-gray-700">
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={localData.gstNumber || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                required={localData.businessType === "company"}
              />
            </div>
          )}

          <h3 className="mt-6 mb-4 text-lg font-semibold">Documents</h3>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FileInput
              label="PAN Card"
              documentType="panCard"
              accept="image/*,.pdf"
              file={kycData.documents && kycData.documents.panCard}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />

            {localData.businessType === "individual" && (
              <FileInput
                label="Aadhaar Card"
                documentType="aadhaarCard"
                accept="image/*,.pdf"
                file={kycData.documents && kycData.documents.aadhaarCard}
                onFileUpload={handleFileUpload}
                onRemoveFile={handleRemoveFile}
              />
            )}

            {localData.businessType === "company" && (
              <>
                <FileInput
                  label="GST Certificate"
                  documentType="gstCertificate"
                  accept="image/*,.pdf"
                  file={kycData.documents && kycData.documents.gstCertificate}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />
                <FileInput
                  label="CIN Certificate"
                  documentType="cinCertificate"
                  accept="image/*,.pdf"
                  file={kycData.documents && kycData.documents.cinCertificate}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />
              </>
            )}

            <FileInput
              label="Cancelled Cheque"
              documentType="cancelledCheque"
              accept="image/*,.pdf"
              file={kycData.documents && kycData.documents.cancelledCheque}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {(kycStatus !== "requested" || !success) && (
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full rounded-md px-4 py-2 text-white ${
                loading ? "bg-gray-400" : "bg-[#0b8263] hover:bg-teal-900"
              }`}
            >
              {loading ? "Submitting..." : "Submit KYC Information"}
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default KycForm;
