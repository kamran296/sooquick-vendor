import React, { useRef, useEffect } from "react";
import { servicesData } from "../../utils/landingData";
import Title from "./Title";

const ServiceCategories = () => {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <Title title={"Services Categories"} />
          {/* <div className="mx-auto mt-4 h-1 w-24 bg-[#0b8263]"></div> */}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {servicesData.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center transition-all hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-md sm:h-56 md:h-60">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#0b8263] opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
              </div>

              {/* Title */}
              <h3 className="mt-5 max-w-[90%] text-center text-lg font-semibold text-gray-800 md:text-xl">
                {item.title}
              </h3>

              {/* Optional: Description or CTA */}
              {item.description && (
                <p className="mt-2 max-w-[90%] text-center text-gray-600">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Optional: View More Button */}
        <div className="mt-12 flex justify-center">
          <button className="rounded-lg bg-[#0b8263] px-8 py-3 text-white transition hover:bg-[#0a6e53] focus:ring-2 focus:ring-[#0b8263] focus:ring-offset-2 focus:outline-none">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

const EssentialServices = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <Title title="Essentials Services" />
        <div className="mt-12 grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4">
          {servicesData.map((item) => (
            <div key={item.idx} className="flex flex-col items-center">
              <div className="overflow-hidden rounded-[12px] md:h-[200px] md:w-[250px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 max-w-[200px] text-center text-lg font-medium">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComboServices = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <Title title={"Combo Services Packs"} />

        <div className="mt-12 grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4">
          {servicesData.map((item) => (
            <div key={item.idx} className="flex flex-col items-center">
              <div className="overflow-hidden rounded-[12px] md:h-[200px] md:w-[250px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 max-w-[200px] text-center text-lg font-medium">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComingServices = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <Title title={"Coming Soon Services"} />

        <div className="mt-12 grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4">
          {servicesData.map((item) => (
            <div key={item.idx} className="flex flex-col items-center">
              <div className="overflow-hidden rounded-[12px] md:h-[200px] md:w-[250px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 max-w-[200px] text-center text-lg font-medium">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ServiceCategories, EssentialServices, ComboServices, ComingServices };
