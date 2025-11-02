// import React, { useEffect } from "react";
// import UserLayout from "../../layouts/user/UserLayout";
// import ServiceTabs from "../../components/service/ServiceTabs";
// import { useDispatch, useSelector } from "react-redux";
// import CreateServices from "../../components/service/CreateServices";
// import request from "../../axios/requests";
// import { setServices } from "../../redux/slices/serviceSlice";
// import { toast } from "react-toastify";
// import AllServices from "../../components/service/AllServices";
// // import PendingServices from "../../components/service/PendingServices";
// // import RejectedServices from "../../components/service/RejectedServices";

// const Services = () => {
//   const dispatch = useDispatch();
//   const activeTab = useSelector((state) => state.service.serviceTabActive);

//   useEffect(() => {
//     const getAllServices = async () => {
//       try {
//         const response = await request.getAllServices();
//         dispatch(setServices(response.data.services));
//       } catch (error) {
//         toast.error("No services found");
//       }
//     };

//     getAllServices();
//   }, [dispatch]);

//   const renderContent = () => {
//     switch (activeTab) {
//       case 0:
//         return <AllServices />;
//       case 1:
//         return <CreateServices />;
//       case 2:
//       // return <PendingServices />;
//       case 3:
//       // return <RejectedServices />;
//       default:
//         return (
//           <div className="p-6 text-center text-gray-500">No service found</div>
//         );
//     }
//   };

//   return (
//     <UserLayout>
//       <ServiceTabs />
//       {renderContent()}
//     </UserLayout>
//   );
// };

// export default Services;

// demo2
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

const Services = () => {
  const dispatch = useDispatch();
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
      setSearchParams({ tab: tabToUrlMap[activeTab] });
    }
  }, []);

  // Update URL when active tab changes
  useEffect(() => {
    setSearchParams({ tab: tabToUrlMap[activeTab] });
  }, [activeTab, setSearchParams]);

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
      <ServiceTabs />
      {renderContent()}
    </UserLayout>
  );
};

export default Services;
