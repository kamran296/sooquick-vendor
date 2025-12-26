import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceTab } from "../../redux/slices/serviceSlice";

const ServiceTabs = () => {
  const serviceTabData = [
    {
      id: 0,
      name: "My Services",
      path: "/",
    },
    {
      id: 1,
      name: "Post Services",
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
    <div className="p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {serviceTabData.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`flex items-center justify-between rounded-lg border p-3 transition-all duration-200 ${
              activeTab === card.id
                ? "border-teal-500 bg-teal-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${
                  activeTab === card.id ? "text-teal-700" : "text-gray-900"
                }`}
              >
                {card.name}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {card.count > 0 && (
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    card.name === "Pending Approvals"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {card.count}
                </span>
              )}
              {activeTab === card.id && (
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceTabs;
