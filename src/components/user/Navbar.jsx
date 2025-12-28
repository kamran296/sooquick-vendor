import React, { useState } from "react";
import {
  // FaBars,
  // FaWhatsapp,

  FaUser,
} from "react-icons/fa";
// import { CiMail } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/logo.png";
import Vendor from "../../assets/vendor.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationBell from "./Notification";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const name = useSelector((state) => state.user.name);
  const membership = useSelector((state) => state.user.membership);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  return (
    <>
      {/* Top Contact Bar - Hidden on mobile */}
      {/* <div className="hidden w-full px-4 py-2 text-black md:flex">
        <div className="container mx-auto flex items-center justify-start">
          <FaBars
            onClick={toggleDesktopMenu}
            className="cursor-pointer text-xl text-black"
          />
          <div className="flex w-full items-center justify-center space-x-6">
            <div className="flex items-center">
              <CiMail className="mr-2 text-lg text-yellow-400" />
              <span className="text-sm">cs@soquick.com</span>
            </div>
            <div className="flex items-center">
              <FaWhatsapp className="mr-2 text-lg text-yellow-400" />
              <span className="text-sm">+1 234 567 890</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b-2 border-b-[#0b8263] bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-5 pt-4">
            <div className="flex w-full items-center justify-center gap-4">
              {/* <div className="text-xl font-bold text-gray-800">
                <Link to="/" className="flex items-center">
                  <img src={Logo} alt="Logo" className="h-8 md:h-[50px]" />
                </Link>
              </div> */}
              <div className="flex font-bold text-gray-800">
                <Link to="/" className="flex items-center">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="h-8 scale-110 md:h-10"
                  />
                  <div className="flex flex-col">
                    <p className="p-0 text-sm text-[#0b8263] md:text-xl">
                      SooQuick
                    </p>
                    <p className="-mt-1 text-[5px] md:text-[8px]">
                      Life too busy, but we're so quick
                    </p>
                  </div>
                </Link>
              </div>
              {/* Vertical line */}
              <div className="h-10 w-px bg-[#0b8263]"></div>
              <div className="text-xl font-bold text-gray-800">
                <Link to="/" className="flex items-center">
                  <img src={Vendor} alt="Vendor" className="h-8 md:h-12" />
                </Link>
              </div>
            </div>

            {/* User Actions */}
            <div className="mr-0 flex items-center space-x-4 md:mr-10 md:space-x-8">
              {/* <Link
                href="#"
                className="relative text-gray-700 hover:text-yellow-500"
              >
                <FaBell className="text-2xl text-[#0b8266]" />
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs text-white">
                  3
                </span>
              </Link> */}
              <NotificationBell />

              <Link to="/setting" className="items-center -space-x-1.5">
                <div className="relative z-10 w-fit">
                  {/* Circular user icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b8266]">
                    <FaUser className="text-lg text-[#0b8266]" />
                  </div>
                  <p className="absolute top-10 -right-5 hidden w-20 truncate text-center text-sm text-nowrap md:block">
                    {name ? name : "Profile"}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search - Visible only on mobile */}
          {/* <div className="px-2 pb-3 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute top-2.5 right-3 text-gray-500">
                <FaSearch />
              </button>
            </div>
          </div> */}
        </div>

        {/* Desktop Menu */}
        {isDesktopMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div
              className="bg-opacity-50 absolute inset-0 bg-black opacity-15"
              onClick={toggleDesktopMenu}
            ></div>

            {/* Side modal */}
            <div
              className={`absolute inset-y-0 left-0 flex max-w-full ${isDesktopMenuOpen ? "translate-x-0" : "translate-x-full"} transform transition-transform duration-1000 ease-in-out`}
            >
              <div className="relative w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  {/* Close button */}
                  <div className="px-4 sm:px-6">
                    <button
                      type="button"
                      className="rounded-md text-gray-300 hover:text-white focus:outline-none"
                      onClick={toggleDesktopMenu}
                    >
                      <span className="sr-only">Close panel</span>
                      <IoClose className="h-6 w-6 cursor-pointer text-gray-500" />
                    </button>
                  </div>

                  {/* Navigation links */}
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <nav className="flex flex-col space-y-4">
                      <Link
                        to="/"
                        className="text-lg font-medium text-gray-900 hover:text-yellow-500"
                      >
                        Home
                      </Link>
                      <Link
                        to="/service"
                        className="text-lg font-medium text-gray-900 hover:text-yellow-500"
                      >
                        Services
                      </Link>
                      <Link
                        to="/faq"
                        className="text-lg font-medium text-gray-900 hover:text-yellow-500"
                      >
                        FAQ
                      </Link>
                      <Link
                        to="/about-us"
                        className="text-lg font-medium text-gray-900 hover:text-yellow-500"
                      >
                        About Us
                      </Link>
                      <Link
                        to="/contact"
                        className="text-lg font-medium text-gray-900 hover:text-yellow-500"
                      >
                        Contact Us
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
