import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 0,
  sidebarOpen: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    // setActiveTab: (state, action) => {
    //   state.activeTab = action.payload;
    // },
    setSidebarTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSidebarTab, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
