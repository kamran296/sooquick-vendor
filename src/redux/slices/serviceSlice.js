// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   serviceTabActive: 0,
//   services: [],
//   requestedCount: 0,
//   rejectedCount: 0,
//   state: null,
//   error: null,
// };

// const serviceSlice = createSlice({
//   name: "service",
//   initialState,
//   reducers: {
//     setServiceTab: (state, action) => {
//       state.serviceTabActive = action.payload;
//     },
//     setServices: (state, action) => {
//       const data = action.payload;
//       state.services = data;
//       state.requestedCount = data.filter(
//         (item) => item.isApproved === "requested",
//       ).length;
//       state.rejectedCount = data.filter(
//         (item) => item.isApproved === "rejected",
//       ).length;
//     },

//   },
// });

// export const { setServiceTab, setServices } = serviceSlice.actions;
// export default serviceSlice.reducer;

// demo2
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceTabActive: 0,
  services: [],
  totalServices: 0,
  requestedCount: 0,
  rejectedCount: 0,
  state: null,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setServiceTab: (state, action) => {
      state.serviceTabActive = action.payload;
    },
    setServices: (state, action) => {
      const data = action.payload;
      state.services = data;
      state.totalServices = data.length;
      state.requestedCount = data.filter(
        (item) => item.isApproved === "requested",
      ).length;
      state.rejectedCount = data.filter(
        (item) => item.isApproved === "rejected",
      ).length;
    },
    setActiveTabFromUrl: (state, action) => {
      // This will be used to sync tab from URL parameter
      const tabFromUrl = action.payload;
      if (tabFromUrl >= 0 && tabFromUrl <= 3) {
        state.serviceTabActive = tabFromUrl;
      }
    },
  },
});

export const { setServiceTab, setServices, setActiveTabFromUrl } =
  serviceSlice.actions;
export default serviceSlice.reducer;
