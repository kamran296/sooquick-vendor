import React, { useEffect } from "react";
import SystemLayout from "../../layouts/user/SystemLayout";
import UserSetting from "../../components/user/UserSetting";
import SettingTabs from "../../components/user/SettingTabs";
import { useDispatch, useSelector } from "react-redux";
import KycForm from "../../components/user/KycForm";
import UserLayout from "../../layouts/user/UserLayout";
import { useLocation, useNavigate } from "react-router-dom";

const Setting = () => {
  // const activeTab = useSelector((state) => state.setting.activeTab);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      navigate(`?tab=profile`, { replace: true });
    }
  }, []);

  // Sync URL with Redux state
  // useEffect(() => {
  //   const tabId = activeTab === "kyc" ? 1 : 0;
  //   dispatch(setActiveTab(tabId));
  // }, [activeTab, dispatch]);
  return (
    <UserLayout>
      <SettingTabs />
      {activeTab === "kyc" && <KycForm />}
      {activeTab === "profile" && <UserSetting />}
    </UserLayout>
  );
};

export default Setting;
