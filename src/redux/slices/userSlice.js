// multi addresses:
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../../axios/requests";

const initialState = {
  name: null,
  user: {
    name: null,
    email: null,
    firstName: null,
    lastName: null,
    phone: null,
    addresses: [], // Now an array
    dob: null,
    gender: null,
    twoFactorEnabled: false,
    kycVerified: "pending",
  },
  membership: {},
  status: "idle",
  error: null,
};

// Async thunk for getting user
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.getUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data",
      );
    }
  },
);

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await request.updateUser(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: () => initialState,
    setUserName: (state, action) => {
      state.name = action.payload;
      state.user.firstName = action.payload;
    },
    addAddress: (state, action) => {
      state.user.addresses.push(action.payload);
    },
    removeAddress: (state, action) => {
      state.user.addresses = state.user.addresses.filter(
        (_, index) => index !== action.payload,
      );
    },
    updateAddress: (state, action) => {
      const { index, address } = action.payload;
      state.user.addresses[index] = address;
    },
    setDefaultAddress: (state, action) => {
      const defaultIndex = action.payload;
      state.user.addresses = state.user.addresses.map((addr, index) => ({
        ...addr,
        isDefault: index === defaultIndex,
      }));
    },
    setMembershipInfo: (state, action) => {
      state.membership = action.payload;
    },
    setkycVerified: (state, action) => {
      state.user.kycVerified = action.payload;
    },
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.user = action.payload;

      // state.userkycVerified = action.payload.kycVerified;
      state.membership = action.payload.membership;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          ...action.payload,
          addresses: action.payload.addresses || [], // Ensure addresses is an array
        };
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "updating";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          ...action.payload.user,
          addresses: action.payload.user.addresses || state.user.addresses,
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetUserState,
  addAddress,
  removeAddress,
  updateAddress,
  setDefaultAddress,
  setUserName,
  setMembershipInfo,
  setkycVerified,
  setUser,
} = userSlice.actions;
export default userSlice.reducer;
