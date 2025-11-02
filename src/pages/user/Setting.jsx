import React from "react";
import SystemLayout from "../../layouts/user/SystemLayout";
import UserSetting from "../../components/user/UserSetting";
import SettingTabs from "../../components/user/SettingTabs";
import { useSelector } from "react-redux";
import KycForm from "../../components/user/KycForm";
import UserLayout from "../../layouts/user/UserLayout";

const Setting = () => {
  const activeTab = useSelector((state) => state.setting.activeTab);
  return (
    <UserLayout>
      <SettingTabs />
      {activeTab === 1 && <KycForm />}
      {activeTab === 0 && <UserSetting />}
    </UserLayout>
  );
};

export default Setting;
