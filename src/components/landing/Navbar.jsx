import React, { useState } from "react";
import {
  FaBars,
  FaWhatsapp,
  FaShoppingCart,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/landing/Logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
  };

  return (
    <>
      {/* Top Contact Bar - Hidden on mobile */}
      <div className="hidden w-full px-4 py-2 text-black md:flex">
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
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Mobile menu button and logo */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="mr-4 text-gray-700 focus:outline-none md:hidden"
              >
                {isMobileMenuOpen ? (
                  <IoClose className="text-2xl" />
                ) : (
                  <FaBars className="text-2xl" />
                )}
              </button>
              <div className="text-xl font-bold text-gray-800">
                <a href="/" className="flex items-center">
                  <img src={Logo} alt="Logo" className="h-8 md:h-10" />
                </a>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="ml-8 hidden max-w-md flex-1 md:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute top-2.5 right-3 text-gray-500">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="relative text-gray-700 hover:text-yellow-500"
              >
                <FaShoppingCart className="text-2xl text-[#0b8266]" />
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs text-white">
                  3
                </span>
              </a>
              <a href="#" className="hidden items-center -space-x-1.5 md:flex">
                <div className="relative z-10">
                  {/* Circular user icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b8266]">
                    <FaUser className="text-lg text-[#0b8266]" />
                  </div>
                </div>

                {/* Text container */}
                <div className="relative">
                  {/* Inversely curved div */}
                  <div className="absolute top-0 -left-[15px] h-10 w-6 overflow-hidden bg-[#0b8266]">
                    <div className="h-[41px] w-full rounded-r-full border-t-2 border-r-2 border-b-2 border-l-0 border-white bg-white"></div>
                  </div>
                  <Link
                    to="/signup"
                    className="flex h-10 items-center rounded-r-full bg-[#0b8266] px-4 text-white"
                  >
                    <span className="text-sm font-medium text-white">
                      Login/Register
                    </span>
                  </Link>
                </div>
              </a>
            </div>
          </div>

          {/* Mobile Search - Visible only on mobile */}
          <div className="px-2 pb-3 md:hidden">
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
          </div>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="z-30 h-screen border-t border-gray-200 bg-white md:hidden">
            <div className="container mx-auto px-4 py-2">
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="flex items-center border-b border-gray-100 py-2 text-gray-700 hover:text-yellow-500"
                >
                  <CiMail className="mr-2 text-yellow-500" />
                  cs@soquick.com
                </a>
                <a
                  href="#"
                  className="flex items-center border-b border-gray-100 py-2 text-gray-700 hover:text-yellow-500"
                >
                  <FaWhatsapp className="mr-2 text-yellow-500" />
                  +1 234 567 890
                </a>
                <a
                  href="#"
                  className="flex items-center border-b border-gray-100 py-2 text-gray-700 hover:text-yellow-500"
                >
                  <FaUser className="mr-2 text-yellow-500" />
                  Login/Register
                </a>
                <a
                  href="#"
                  className="py-2 text-gray-700 hover:text-yellow-500"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="py-2 text-gray-700 hover:text-yellow-500"
                >
                  Faq
                </a>
                <a
                  href="#"
                  className="py-2 text-gray-700 hover:text-yellow-500"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="py-2 text-gray-700 hover:text-yellow-500"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
