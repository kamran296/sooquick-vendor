import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const partnerLogos = [
    {
      src: "/logo1.png",
      alt: "Partner 1",
      text: "For Customer Support - cs@sooquick.com",
    },
    { src: "/logo2.png", alt: "Partner 2", text: "Lorem ipsum dolor sit." },
    { src: "/logo3.png", alt: "Partner 3", text: "Lorem ipsum dolor sit." },
    { src: "/logo4.png", alt: "Partner 4", text: "Lorem ipsum dolor sit" },
  ];

  return (
    <footer className="font-mont px-4 pt-12 pb-6 sm:px-6 lg:px-8">
      {/* Newsletter Section */}
      <div className="mx-auto mb-14 flex h-fit w-full flex-col items-center justify-between gap-4 rounded-lg bg-[#0b8263] px-6 py-3 sm:flex-row md:h-14">
        <p className="text-lg font-medium whitespace-nowrap text-white sm:text-xl">
          Newsletter Signup
        </p>
        <div className="max-w-xl flex-1">
          <div className="flex gap-2 rounded-md bg-white">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-10 w-full rounded-md border-none px-4 outline-none focus:outline-none"
            />
            <button className="my-1 mr-2 rounded-md bg-[#0b8263] px-4 font-semibold whitespace-nowrap text-white transition-colors hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 md:px-12 lg:flex-row">
          {/* Left Content - Links */}
          <div className="grid w-fit flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            {/* Company Section */}
            <div>
              <h3 className="mb-4 text-[20px] font-medium">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Our Blogs", "Career", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[15px] transition hover:text-yellow-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Company Policy</h3>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms & Conditions", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <a href="#" className="transition hover:text-yellow-400">
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Consumer Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Consumer Policy</h3>
              <ul className="space-y-3">
                {[
                  "Cancellation & Refund",
                  "Security Policy",
                  "Shipping Policy",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-yellow-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendor Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Vendor Policy</h3>
              <ul className="space-y-3">
                {[
                  "Vendor Agreement",
                  "Payment Policy",
                  "Quality Standards",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-yellow-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Content - Logos */}
          <div className="flex flex-col items-start gap-2">
            {/* <div className="grid grid-cols-2 gap-6 sm:grid-cols-4"> */}
            {partnerLogos.map((logo, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-3">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-h-10 max-w-10"
                  />
                </div>
                <span className="text-center text-sm">{logo.text}</span>
              </div>
            ))}
            {/* </div> */}
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="mt-12 flex flex-col items-center">
          <h3 className="mb-6 text-lg font-medium">Follow Us On</h3>
          <div className="flex gap-4">
            {[
              { icon: <FaFacebook />, color: "#3b5998" },
              { icon: <FaTwitter />, color: "#1da1f2" },
              { icon: <FaYoutube />, color: "#ff0000" },
              { icon: <FaInstagram />, color: "#e1306c" },
              { icon: <FaWhatsapp />, color: "#25d366" },
              { icon: <FaLinkedin />, color: "#0077b5" },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className="rounded-full p-3 text-white transition hover:opacity-80"
                style={{ backgroundColor: social.color }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            Copyright © {new Date().getFullYear()} SooQuick Services Private
            Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
