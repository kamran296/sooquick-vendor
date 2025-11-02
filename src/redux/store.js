import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sidebar from "./slices/sidebarSlice";
import setting from "./slices/settingSlice";
import kyc from "./slices/kycSlice";
import notification from "./slices/notificationSlice";
import service from "./slices/serviceSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebar,
    setting: setting,
    kyc: kyc,
    notifications: notification,
    service: service,
  },
});

export default store;
