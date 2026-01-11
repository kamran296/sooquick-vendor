import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../../axios/requests";
import { toast } from "react-toastify";

const initialState = {
  kycData: {
    businessType: "company",
    companyName: "",
    landlineNumber: "",
    panNumber: "",
    gstNumber: "",
    aadhaarNumber: "",
    documents: {
      panCard: null,
      gstCertificate: null,
      cancelledCheque: null,
      cinCertificate: null,
      aadhaarCard: null,
      otherDocs: [],
    },
  },
  // Add temporary file storage that won't interfere with your main state
  tempFiles: {},
  loading: false,
  error: null,
  success: false,
  kycStatus: "pending",
  deleteLoading: false,
  deleteError: null,
  deletingDoc: null,
};

// Fetch KYC information
export const getKycInfo = createAsyncThunk(
  "kyc/getKycInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.getKycDetails();
      return response.data;
    } catch (error) {
      return rejectWithValue(toast.error("Failed to fetch KYC data"));
    }
  },
);

// Submit KYC information
export const submitKycInfo = createAsyncThunk(
  "kyc/submitKycInfo",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { kycData, tempFiles } = state.kyc;

      // Create a copy of kycData to work with
      const kycDataToSubmit = { ...kycData };

      // ✅ Validation rules
      const requiredFields = {
        individual: [
          "aadhaarNumber",
          "panNumber",
          "documents.panCard",
          "documents.cancelledCheque",
          "documents.aadhaarCard",
        ],
        company: [
          "companyName",
          "panNumber",
          "gstNumber",
          "documents.panCard",
          "documents.cancelledCheque",
          "documents.gstCertificate",
          "documents.cinCertificate",
        ],
      };

      // Pick the rule set
      const rules = requiredFields[kycDataToSubmit.businessType] || [];

      // Check if all required fields are present
      const missingFields = rules.filter((field) => {
        const keys = field.split(".");
        let value = kycDataToSubmit;
        for (let key of keys) {
          value = value?.[key];
        }
        return !value || (Array.isArray(value) && value.length === 0);
      });

      if (missingFields.length > 0) {
        toast.error(
          `Please fill all required fields: ${missingFields
            .map((f) => f.replace("documents.", ""))
            .join(", ")}`,
        );
        return rejectWithValue("Validation failed");
      }

      // ✅ Build FormData
      const formData = new FormData();

      // Add all basic fields
      Object.keys(kycDataToSubmit).forEach((key) => {
        if (key !== "documents") {
          formData.append(key, kycDataToSubmit[key]);
        }
      });

      // Add documents - use tempFiles if available, otherwise use stored document references
      // Object.keys(kycDataToSubmit.documents).forEach((docKey) => {
      //   // Only include documents relevant based on businessType
      //   if (
      //     kycDataToSubmit.businessType === "company" ||
      //     (kycDataToSubmit.businessType === "individual" &&
      //       ["panCard", "cancelledCheque", "otherDocs"].includes(docKey))
      //   ) {
      //     if (docKey === "otherDocs") {
      //       kycDataToSubmit.documents.otherDocs.forEach((file, index) => {
      //         // Use temp file if available, otherwise use stored reference
      //         const fileToUse = tempFiles[`otherDocs-${index}`] || file;
      //         if (fileToUse) {
      //           formData.append(`documents.otherDocs[${index}]`, fileToUse);
      //         }
      //       });
      //     }
      //     if (
      //       kycDataToSubmit.businessType === "individual" &&
      //       docKey === "aadhaarCard"
      //     ) {
      //       const fileToUse =
      //         tempFiles.aadhaarCard || kycDataToSubmit.documents.aadhaarCard;
      //       if (fileToUse) {
      //         formData.append("documents.aadhaarCard", fileToUse);
      //       }
      //     } else {
      //       // Use temp file if available, otherwise use stored reference
      //       const fileToUse =
      //         tempFiles[docKey] || kycDataToSubmit.documents[docKey];
      //       if (fileToUse) {
      //         formData.append(`documents.${docKey}`, fileToUse);
      //       }
      //     }
      //   }
      // });
      Object.entries(kycDataToSubmit.documents).forEach(([docKey, value]) => {
        const fileToUse = tempFiles[docKey] || value;

        if (!fileToUse) return;

        // Individual allowed docs
        if (kycDataToSubmit.businessType === "individual") {
          const allowed = ["panCard", "cancelledCheque", "aadhaarCard"];
          if (!allowed.includes(docKey)) return;
        }

        // Company allowed docs
        if (kycDataToSubmit.businessType === "company") {
          const allowed = [
            "panCard",
            "cancelledCheque",
            "gstCertificate",
            "cinCertificate",
          ];
          if (!allowed.includes(docKey)) return;
        }

        formData.append(`documents.${docKey}`, fileToUse);
      });

      if (
        kycDataToSubmit.businessType === "individual" &&
        !/^\d{12}$/.test(kycDataToSubmit.aadhaarNumber)
      ) {
        console.log("Aadhaar must have 12 numbers");
        return rejectWithValue("Invalid Aadhaar");
      }

      const response = await request.submitKycDetails(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(toast.error("Failed to submit KYC data"));
    }
  },
);

// delete kyc documents
export const deleteDocument = createAsyncThunk(
  "kyc/deleteDocument",
  async ({ documentType, documentPath }, { rejectWithValue }) => {
    try {
      const response = await request.deleteKycFile({
        documentType,
        documentPath,
      });
      return { documentType, documentPath, response: response.data };
    } catch (error) {
      return rejectWithValue({
        documentType,
        documentPath,
        error: error.response?.data?.message || "Failed to delete document",
      });
    }
  },
);

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    updateKycData: (state, action) => {
      // Only update non-document fields to prevent overwriting files
      const { documents, ...nonDocumentFields } = action.payload;
      state.kycData = {
        ...state.kycData,
        ...nonDocumentFields,
      };
    },
    updateDocument: (state, action) => {
      const { documentType, file } = action.payload;
      // Store file reference in tempFiles instead of main state
      state.tempFiles[documentType] = file;

      // Only store a flag in the main state that a file has been selected
      if (documentType === "otherDocs") {
        if (!state.kycData.documents.otherDocs) {
          state.kycData.documents.otherDocs = [];
        }
        state.kycData.documents.otherDocs.push({
          name: file.name,
          uploaded: true,
        });
      } else {
        state.kycData.documents[documentType] = {
          name: file.name,
          uploaded: true,
        };
      }
    },
    removeDocument: (state, action) => {
      const { documentType, index } = action.payload;
      // Remove from tempFiles
      if (documentType === "otherDocs") {
        delete state.tempFiles[`otherDocs-${index}`];
        state.kycData.documents.otherDocs.splice(index, 1);
      } else {
        delete state.tempFiles[documentType];
        state.kycData.documents[documentType] = null;
      }
    },

    // Add a reducer to clear deletion state
    clearDeletionState: (state) => {
      state.deletingDoc = null;
      state.deleteError = null;
    },

    resetKycState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    updateBusinessType: (state, action) => {
      const businessType = action.payload;
      state.kycData.businessType = businessType;

      if (businessType === "individual") {
        // Clear GST number and company-specific documents for individuals
        state.kycData.gstNumber = "";
        state.kycData.documents.gstCertificate = null;
        state.kycData.documents.cinCertificate = null;

        // Also clear temp files for company-specific documents
        delete state.tempFiles.gstCertificate;
        delete state.tempFiles.cinCertificate;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get KYC Info
      .addCase(getKycInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycInfo.fulfilled, (state, action) => {
        state.loading = false;
        const businessProfile = action.payload.businessProfile || {};

        // Preserve businessType if already set
        const currentBusinessType = state.kycData.businessType;

        state.kycData = {
          ...state.kycData,
          ...businessProfile,
          businessType: businessProfile.businessType || currentBusinessType,
        };

        state.kycStatus = action.payload.kycVerified || "pending";
      })
      .addCase(getKycInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit KYC Info
      .addCase(submitKycInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitKycInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.kycData = action.payload.businessProfile;
        state.kycStatus = action.payload.kycVerified;
        // Clear temp files after successful submission
        state.tempFiles = {};
      })
      .addCase(submitKycInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  updateKycData,
  updateDocument,
  removeDocument,
  resetKycState,
  updateBusinessType,
} = kycSlice.actions;

export default kycSlice.reducer;
