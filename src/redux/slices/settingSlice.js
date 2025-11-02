import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: 0,
};

const settingSlice = createSlice({
  name: "settingTabs",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = settingSlice.actions;
export default settingSlice.reducer;
