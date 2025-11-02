import React, { useState } from "react";
import Title from "./Title";
import { footerSupport } from "../../utils/landingData";
import ContactMap from "../../assets/landing/contactMap.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ContactMain = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  // Support icons mapping
  const supportIcons = {
    phone: <FaPhoneAlt className="text-teal-600" />,
    email: <FaEnvelope className="text-teal-600" />,
    location: <FaMapMarkerAlt className="text-teal-600" />,
    hours: <FaClock className="text-teal-600" />,
  };

  return (
    <div className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Support Section */}
        <div className="mb-16 lg:mb-20">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Title title={"Support"} />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              We're here to help you with any questions or concerns
            </motion.p>
          </div>

          {/* Support Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {footerSupport.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-xl">
                  <img src={item.src} alt="" />
                </div>

                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <div className="rounded-xl bg-white shadow-md">
          <div className="flex flex-col lg:flex-row">
            {/* Form Column */}
            <div className="w-full p-8 lg:w-1/2 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Contact Us
                </h2>
                <p className="mt-2 text-gray-600">
                  Have questions? Fill out the form below and we'll get back to
                  you soon.
                </p>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-lg bg-green-50 p-4 text-green-800"
                >
                  Thank you for your message! We'll get back to you soon.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`border-transparentpx-4 flex w-full justify-center rounded-md border py-2 text-sm font-medium text-white shadow-sm ${
                        isSubmitting
                          ? "bg-teal-400"
                          : "bg-teal-600 hover:bg-teal-700"
                      } focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none`}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Info Column */}
            <div className="w-full bg-gray-50 p-8 lg:w-1/2 lg:p-12">
              <h3 className="text-xl font-semibold text-gray-900">
                Our Information
              </h3>
              <p className="mt-4 text-gray-600">
                Feel free to reach out to us through any of these channels:
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhoneAlt className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">support@example.com</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Typically reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Office</p>
                    <p className="text-sm text-gray-500">123 Business Ave</p>
                    <p className="text-sm text-gray-500">Delhi, DL 10001</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-lg font-medium text-gray-900">
                  Business Hours
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* map bg */}
        <div className="map mt-12 w-full">
          <img
            src={ContactMap}
            alt="map"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactMain;
