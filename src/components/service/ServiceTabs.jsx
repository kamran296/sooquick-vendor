import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceTab } from "../../redux/slices/serviceSlice";

const ServiceTabs = () => {
  const serviceTabData = [
    {
      id: 0,
      name: "Your Services",
      path: "/",
    },
    {
      id: 1,
      name: "Post/Edit Services",
      path: "/",
    },
    {
      id: 2,
      name: "Pending Approvals",
      path: "/",
    },
    {
      id: 3,
      name: "Rejected Services",
      path: "/",
    },
  ];
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.service.serviceTabActive);
  const { requestedCount, rejectedCount } = useSelector(
    (state) => state.service,
  );

  const handleClick = (index) => {
    dispatch(setServiceTab(index));
  };

  return (
    <div className="relative flex w-full items-center justify-center p-4">
      <nav
        className="grid max-w-xl grid-cols-2 space-x-2 rounded-lg bg-gray-100 p-1 md:flex md:max-w-5xl"
        aria-label="Tabs"
      >
        {serviceTabData.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-white text-[#0b8263] shadow-sm" // Active: white pill, colored text
                : "text-gray-500 hover:bg-white hover:text-gray-700" // Inactive: subtle background change
            }`}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <div className="flex items-center">
              <span>{item.name}</span>
              {/* FIXED: Remove the curly braces around the values */}
              {item.name === "Pending Approvals" && requestedCount > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  {requestedCount}
                </span>
              )}
              {item.name === "Rejected Services" && rejectedCount > 0 && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                  {rejectedCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ServiceTabs;
