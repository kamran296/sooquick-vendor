// hooks/useKycForm.js
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getKycInfo,
  submitKycInfo,
  //   updateDocument as updateReduxDocument,
  //   removeDocument as removeReduxDocument,
} from "../redux/slices/kycSlice";
import { toast } from "react-toastify";
import request from "../axios/requests";

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

export const useKycForm = () => {
  const dispatch = useDispatch();

  // ONLY read from Redux, don't write on every change
  const reduxData = useSelector((state) => state.kyc.kycData);
  const reduxStatus = useSelector((state) => state.kyc.kycStatus);
  const reduxLoading = useSelector((state) => state.kyc.loading);
  const reduxSuccess = useSelector((state) => state.kyc.success);
  const reduxError = useSelector((state) => state.kyc.error);

  // LOCAL STATE for form inputs - this prevents re-renders
  const [formData, setFormData] = useState({
    businessType: "company",
    companyName: "",
    landlineNumber: "",
    panNumber: "",
    gstNumber: "",
    aadhaarNumber: "",
    officeAddress: "",
    documents: {
      panCard: null,
      cancelledCheque: null,
      aadhaarCard: null,
      gstCertificate: null,
      cinCertificate: null,
      agreement: null,
      addressProof: null,
    },
  });

  const [initialData, setInitialData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [deletingDoc, setDeletingDoc] = useState(null);

  const initializedRef = useRef(false);

  // Load from Redux ONCE when component mounts
  useEffect(() => {
    dispatch(getKycInfo());
  }, [dispatch]);

  // Sync Redux data to local state - but only ONCE
  useEffect(() => {
    if (reduxData && !initializedRef.current) {
      const merged = {
        ...formData,
        ...reduxData,
      };
      setFormData(merged);
      setInitialData(merged);
      initializedRef.current = true;
    }
  }, [reduxData]);

  // Track dirty state locally
  useEffect(() => {
    if (!initialData) return;

    const changed = Object.keys(formData).some((key) => {
      if (key === "documents") {
        return Object.keys(formData.documents).some(
          (docKey) =>
            formData.documents[docKey] !== initialData.documents?.[docKey],
        );
      }
      return formData[key] !== initialData[key];
    });

    setIsDirty(changed);
  }, [formData, initialData]);

  // Input change handler - ONLY updates local state, NOT Redux
  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Optional: Debounced validation
    validateFieldDebounced(name, value);
  }, []);

  // Business type change - updates local state
  const handleBusinessTypeChange = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      businessType: type,
      ...(type === "individual" && { gstNumber: "", companyName: "" }),
    }));
  }, []);

  // File upload - updates local state immediately
  const handleFileUpload = useCallback((e, documentType) => {
    console.log(e, documentType, "5555555");
    const file = e.target.files[0];
    if (!file) return;

    // Update local state for immediate UI feedback
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file,
      },
    }));

    // OPTIONAL: You can still update Redux, but do it in the background
    // This won't cause re-renders if your components are properly memoized
    // dispatch(updateReduxDocument({ documentType, file }));
  }, []); // Remove dispatch from deps if you comment out the Redux update

  // Remove file - updates local state
  const handleRemoveFile = useCallback(
    async (documentType, file) => {
      setDeletingDoc(documentType);

      try {
        // If it's a server file, delete from server
        if (file && typeof file === "string") {
          await request.deleteKycFile({
            documentType,
            documentPath: file,
          });
          toast.success("Document deleted successfully");

          // Optionally refresh Redux data after server deletion
          dispatch(getKycInfo());
        }

        // Update local state
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: null,
          },
        }));
      } catch (error) {
        console.error("Failed to delete document:", error);
        toast.error("Failed to delete document");
      } finally {
        setDeletingDoc(null);
      }
    },
    [dispatch],
  );

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (formData.businessType === "individual") {
      // Aadhaar validation
      if (!formData.aadhaarNumber) {
        newErrors.aadhaarNumber = "Aadhaar number is required";
      } else if (!validateAadhaar(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = "Enter valid 12-digit Aadhaar number";
      }

      // PAN validation for individual
      if (!formData.panNumber) {
        newErrors.panNumber = "PAN number is required";
      } else if (!validatePAN(formData.panNumber)) {
        newErrors.panNumber = "Enter valid PAN number (e.g., ABCDE1234F)";
      }
    } else {
      // Company validation
      if (!formData.companyName?.trim()) {
        newErrors.companyName = "Company name is required";
      }

      // PAN validation for company
      if (!formData.panNumber) {
        newErrors.panNumber = "PAN number is required";
      } else if (!validatePAN(formData.panNumber)) {
        newErrors.panNumber = "Enter valid PAN number (e.g., ABCDE1234F)";
      }

      // GST validation
      if (!formData.gstNumber) {
        newErrors.gstNumber = "GST number is required";
      } else if (!validateGST(formData.gstNumber)) {
        newErrors.gstNumber = "Enter valid GST number (e.g., 22ABCDE1234F1Z5)";
      }
    }

    // Common validations for both types
    // Office address validation
    if (!formData.officeAddress?.trim()) {
      newErrors.officeAddress = "Office address is required";
    } else if (formData.officeAddress.trim().length < 10) {
      newErrors.officeAddress =
        "Enter valid Office Address (minimum 10 characters)";
    }

    // Document validations based on business type
    if (formData.businessType === "individual") {
      if (!formData.documents?.aadhaarCard) {
        newErrors.aadhaarCard = "Please upload your Aadhaar card";
      }
      if (!formData.documents?.panCard) {
        newErrors.panCard = "Please upload your PAN card";
      }
    } else {
      if (!formData.documents?.panCard) {
        newErrors.panCard = "Please upload your PAN card";
      }
      if (!formData.documents?.gstCertificate) {
        newErrors.gstCertificate = "Please upload your GST certificate";
      }
      if (!formData.documents?.cinCertificate) {
        newErrors.cinCertificate = "Please upload your CIN certificate";
      }
    }

    // Common document validations for both types
    if (!formData.documents?.cancelledCheque) {
      newErrors.cancelledCheque = "Please upload cancelled cheque";
    }

    if (!formData.documents?.addressProof) {
      newErrors.addressProof = "Please upload your address proof";
    }

    if (!formData.documents?.agreement) {
      newErrors.agreement = "Please upload signed agreement";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Submit - ONLY update Redux on form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fill all the required feilds.");
        return;
      }

      // Now dispatch to Redux with the final form data
      const result = await dispatch(submitKycInfo(formData));

      if (result.meta.requestStatus === "fulfilled") {
        // Update initial data to match submitted data
        setInitialData(formData);
        toast.success("KYC submitted successfully");
      }
    },
    [dispatch, formData, validateForm],
  );

  // Download agreement
  const handleDownloadAgreement = useCallback(async () => {
    try {
      const response = await request.getAgreement();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Terms-and-Agreement.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Agreement downloaded successfully");
    } catch (error) {
      console.error("Failed to download agreement:", error);
      toast.error("Failed to download agreement. Please try again.");
    }
  }, []);

  // Debounced validation helper
  const validateFieldDebounced = useMemo(() => {
    let timeoutId;
    return (field, value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Validation logic here
      }, 300);
    };
  }, []);

  return {
    // Local state (for form inputs)
    formData,
    errors,
    touched,
    isDirty,
    deletingDoc,

    // Redux state (for status, loading, etc.)
    loading: reduxLoading,
    success: reduxSuccess,
    error: reduxError,
    kycStatus: reduxStatus,

    // Actions
    handleInputChange,
    handleBusinessTypeChange,
    handleFileUpload,
    handleRemoveFile,
    handleSubmit,
    handleDownloadAgreement,
  };
};
