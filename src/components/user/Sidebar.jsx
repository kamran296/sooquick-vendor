import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen, setSidebarTab } from "../../redux/slices/sidebarSlice";
import {
  FaArrowCircleRight,
  FaBoxes,
  FaTools,
  FaStar,
  FaWallet,
  FaHome,
} from "react-icons/fa";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import request from "../../axios/requests";
import { resetUserState } from "../../redux/slices/userSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.sidebar.activeTab);
  const membership = useSelector((state) => state.user.membership);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const name = useSelector((state) => state.user.name);
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.sidebar);
  // Update sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerTabs = [
    {
      idx: 0,
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      idx: 1,
      title: "Service Management",
      path: "/services",
      icon: <FaTools />,
    },
    { idx: 2, title: "Order Management", path: "/orders", icon: <FaBoxes /> },
    {
      idx: 3,
      title: "Wallet",
      path: "/wallet",
      icon: <FaWallet />,
    },
    // { idx: 3, title: "Ratings", path: "/ratings", icon: <FaStar /> },
    { idx: 4, title: "Support & Help", path: "/support", icon: <BiSupport /> },
  ];

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const handleLogout = async () => {
    try {
      dispatch(resetUserState());
      const response = await request.logout();
      navigate("/");
    } catch (error) {
      dispatch(resetUserState());
      console.log("error loggin out", error);
    }
  };
  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-md bg-[#0b8263] p-2 text-white shadow-md"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Desktop toggle button */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="top-20 left-64 z-30 hidden h-10 w-6 items-center justify-center rounded-r-md bg-[#0b8263] text-white shadow-md transition-all duration-300 md:fixed md:flex"
          style={{ left: sidebarOpen ? "16rem" : "0" }}
        >
          {sidebarOpen ? (
            <FaCircleArrowLeft className="text-xl" />
          ) : (
            <FaArrowCircleRight className="text-xl" />
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black/10 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-[#0b8263] text-white transition-all duration-300 ease-in-out md:relative ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"}`}
        >
          <div className="flex items-center justify-between border-b border-[#0a6f55] p-5">
            <div className="text-xl font-bold">
              {name ? name : "User"}
              <p className="text-xs opacity-75">View Profile</p>
            </div>
          </div>

          <nav className="mt-5">
            <ul className="space-y-2 px-3">
              {headerTabs.map((item) => (
                <li key={item.idx}>
                  <button
                    onClick={() => {
                      dispatch(setSidebarTab(item.idx));
                      navigate(item.path);
                    }}
                    className={`flex w-full items-center rounded-lg px-4 py-3 transition ${
                      activeTab === item.idx
                        ? "bg-white font-semibold text-[#0b8263]"
                        : "text-white hover:bg-[#0a6f55]"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="whitespace-nowrap">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            {/* membership button */}
            <div className="relative mt-5 px-3">
              <button
                onClick={() => {
                  if (membership?.type?.toLowerCase() !== "None") {
                    navigate("/membership-info");
                    return;
                  }
                  navigate("/membership");
                  if (isMobile) {
                    dispatch(sidebarOpen(false));
                  }
                }}
                className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600/30 to-blue-700/30 px-4 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Shimmer animation overlay */}
                <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center">
                  <FaStar className="mr-2 text-white" />
                  <span className="capitalize">
                    {membership && membership.type !== "none"
                      ? membership.type
                      : "Become Member"}
                  </span>
                </div>

                {/* Glittering border effect */}
                <div className="animate-border-shine absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-[length:200%_100%] opacity-70"></div>
              </button>
            </div>
          </nav>

          <div
            className={`absolute bottom-0 w-full border-t border-[#0a6f55] p-4 ${sidebarOpen ? "block" : "hidden"}`}
          >
            <div
              className="flex items-center justify-between px-5 hover:cursor-pointer"
              onClick={handleLogout}
            >
              <div className="log">Logout</div>
              <IoExitOutline className="text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
