// SettingTabs.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/settingSlice";

const SettingTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.setting.activeTab);

  const tabs = [
    { id: 0, name: "Profile" },
    { id: 1, name: "KYC" },
  ];

  return (
    <div className="sticky top-0 z-30 flex w-full items-center justify-center overflow-y-hidden py-2 md:py-2">
      <div className="tabs flex items-center justify-center gap-2 rounded-full bg-gray-200 px-4 py-2 md:gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`cursor-pointer rounded-full px-4 py-1 transition-colors ${
              activeTab === tab.id
                ? "bg-[#0b8263] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            {tab.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingTabs;
