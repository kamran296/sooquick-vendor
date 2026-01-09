import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserLayout from "../../layouts/user/UserLayout";
import ServiceTabs from "../../components/service/ServiceTabs";
import { useDispatch, useSelector } from "react-redux";
import CreateServices from "../../components/service/CreateServices";
import request from "../../axios/requests";
import {
  setServices,
  setActiveTabFromUrl,
} from "../../redux/slices/serviceSlice";
import { toast } from "react-toastify";
import AllServices from "../../components/service/AllServices";
import { FaArrowLeft } from "react-icons/fa";

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTab = useSelector((state) => state.service.serviceTabActive);
  const [searchParams, setSearchParams] = useSearchParams();

  // Map tab indices to URL parameters
  const tabToUrlMap = {
    0: "all",
    1: "create",
    2: "pending",
    3: "rejected",
  };

  const urlToTabMap = {
    all: 0,
    create: 1,
    pending: 2,
    rejected: 3,
  };

  // Sync URL with active tab on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");

    if (tabFromUrl && urlToTabMap[tabFromUrl] !== undefined) {
      // If URL has a valid tab parameter, update the active tab
      dispatch(setActiveTabFromUrl(urlToTabMap[tabFromUrl]));
    } else {
      // If no tab in URL, set default and update URL
      setSearchParams({ tab: tabToUrlMap[activeTab] }, { replace: true });
    }
  }, []);

  // Update URL when active tab changes
  useEffect(() => {
    // Only update if the tab actually changed
    const currentTab = searchParams.get("tab");
    const newTab = tabToUrlMap[activeTab];

    if (currentTab !== newTab) {
      setSearchParams({ tab: newTab }, { replace: true });
    }
  }, [activeTab, searchParams, setSearchParams]);

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const response = await request.getAllServices();
        dispatch(setServices(response.data.services));
      } catch (error) {
        toast.error("No services found");
      }
    };

    getAllServices();
  }, [dispatch]);

  const renderContent = () => {
    // Determine filter based on active tab
    let filter = "all";
    switch (activeTab) {
      case 0:
        filter = "all";
        break;
      case 2:
        filter = "requested"; // Using your existing isApproved status
        break;
      case 3:
        filter = "rejected"; // Using your existing isApproved status
        break;
      default:
        filter = "all";
    }

    switch (activeTab) {
      case 0:
        return <AllServices filter={filter} />;
      case 1:
        return <CreateServices />;
      case 2:
        return <AllServices filter={filter} />;
      case 3:
        return <AllServices filter={filter} />;
      default:
        return (
          <div className="p-6 text-center text-gray-500">No service found</div>
        );
    }
  };

  return (
    <UserLayout>
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-teal-600 underline hover:text-teal-700"
      >
        <FaArrowLeft /> <div>back to dashboard</div>
      </div>
      <ServiceTabs />
      {renderContent()}
    </UserLayout>
  );
};

export default Services;
