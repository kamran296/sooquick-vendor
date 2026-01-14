// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import request from "../../axios/requests";

// const initialState = {
//   notifications: [],
//   unreadCount: 0,
//   status: "idle", // idle | loading | succeeded | failed
//   error: null,
// };

// // Async thunk
// export const getAllNotifications = createAsyncThunk(
//   "notifications/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await request.getNotification();
//       console.log("notifications received", response.data);
//       return response.data.notifications;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to fetch notifications",
//       );
//     }
//   },
// );

// export const markNotificationRead = createAsyncThunk(
//   "notifications/markRead",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await request.markNotification(id);
//       return id; // ✅ return ID so reducer can update state
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to update notification",
//       );
//     }
//   },
// );

// const notificationSlice = createSlice({
//   name: "notifications",
//   initialState,
//   reducers: {
//     addNotification: (state, action) => {
//       state.notifications.unshift(action.payload);
//       state.unreadCount += 1;
//     },
//     markAsRead: (state, action) => {
//       const notification = state.notifications.find(
//         (notif) => notif._id === action.payload,
//       );
//       if (notification && !notification.read) {
//         notification.read = true;
//         state.unreadCount -= 1;
//       }
//     },
//     markAllAsRead: (state) => {
//       state.notifications.forEach((notification) => {
//         notification.read = true;
//       });
//       state.unreadCount = 0;
//     },
//     setNotifications: (state, action) => {
//       state.notifications = action.payload;
//       state.unreadCount = action.payload.filter((notif) => !notif.read).length;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllNotifications.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(getAllNotifications.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.notifications = action.payload;
//         state.unreadCount = action.payload.filter(
//           (notif) => !notif.read,
//         ).length;
//       })
//       .addCase(getAllNotifications.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(markNotificationRead.fulfilled, (state, action) => {
//         const notification = state.notifications.find(
//           (n) => n._id === action.payload,
//         );
//         if (notification && !notification.isRead) {
//           notification.isRead = true;
//           state.unreadCount -= 1;
//         }
//         state.notifications = state.notifications.filter(
//           (n) => n._id !== action.payload,
//         );
//       });
//   },
// });

// export const {
//   addNotification,
//   markAsRead,
//   markAllAsRead,
//   setNotifications,
//   clearError,
// } = notificationSlice.actions;

// export default notificationSlice.reducer;

// demo2
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../../axios/requests";

const initialState = {
  notifications: [], // All notifications (paginated)
  unreadNotifications: [], // Only unread notifications for dropdown
  unreadCount: 0,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  status: "idle",
  error: null,
};

// Async thunks
export const getUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnread",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.getUnreadNotification();
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications",
      );
    }
  },
);

export const getAllNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params = { page: 1, limit: 20 }, { rejectWithValue }) => {
    try {
      const response = await request.getAllNotifications(params);
      return response.data.data; // Return the entire data object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all notifications",
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await request.markNotification(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to mark notification as read",
      );
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await request.markAllNotificationsAsRead(); // You need to create this API
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to mark all as read",
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
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Unread Notifications
      .addCase(getUnreadNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUnreadNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unreadNotifications = action.payload;
        state.unreadCount = action.payload.length;
      })
      .addCase(getUnreadNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get All Notifications (paginated)
      .addCase(getAllNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;

        // Update unread count from all notifications
        state.unreadCount = action.payload.notifications.filter(
          (notif) => !notif.isRead,
        ).length;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Mark Single Notification as Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;

        // Update in notifications array
        const notification = state.notifications.find((n) => n._id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        // Update in unreadNotifications array
        state.unreadNotifications = state.unreadNotifications.filter(
          (n) => n._id !== id,
        );
      })

      // Mark All as Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        // Mark all notifications as read
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });

        // Clear unread notifications
        state.unreadNotifications = [];
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, setCurrentPage, clearError } =
  notificationSlice.actions;

export default notificationSlice.reducer;
