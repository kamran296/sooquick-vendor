import React from "react";
import HeroBg from "../../assets/landing/herobg.png";

const HomeHero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background image with different behavior on mobile vs desktop */}
      <div className="relative h-[40vh] w-full md:h-[90vh] md:min-h-[500px]">
        {/* Mobile: Show full image without cropping */}
        <img
          src={HeroBg}
          alt="Hero background"
          className="h-full w-full object-contain object-center md:hidden"
        />

        {/* Desktop: Show cropped/covered version */}
        <div
          className="hidden h-full w-full md:block"
          style={{
            backgroundImage: `url(${HeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Optional overlay */}
        {/* <div className="absolute inset-0 bg-black/20"></div> */}
      </div>

      {/* Content container */}
      {/* <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="max-w-4xl text-center text-white">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Your Main Heading Here
          </h1>
          <p className="mb-8 text-lg sm:text-xl md:text-2xl">
            Supporting subheading or value proposition
          </p>
          <button className="rounded-lg bg-[#0b8263] px-8 py-3 text-lg font-semibold text-white transition hover:bg-[#0a6e53]">
            Call to Action
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default HomeHero;
