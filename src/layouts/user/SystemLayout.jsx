import React from "react";
import Navbar from "../../components/user/Navbar";
import SettingTabs from "../../components/user/SettingTabs";

const SystemLayout = ({ children }) => {
  return (
    <div className="relative">
      <Navbar />
      {children}
    </div>
  );
};

export default SystemLayout;
