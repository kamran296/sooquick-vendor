import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../../axios/requests";

const initialState = {
  notifications: [],
  unreadCount: 0,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Async thunk
export const getAllNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.getNotification();
      console.log("notifications received", response.data);
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications",
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await request.markNotification(id);
      return id; // ✅ return ID so reducer can update state
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update notification",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (notif) => notif._id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((notif) => !notif.read).length;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(
          (notif) => !notif.read,
        ).length;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload,
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload,
        );
      });
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  setNotifications,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
