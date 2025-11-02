import React from "react";
import AboutBg from "../../../assets/landing/aboutbg.png";

const AboutHero = () => {
  return (
    <div className="relative flex h-[40vh] w-full items-start md:h-auto">
      {/* Mobile: Show full image without cropping */}
      <img
        src={AboutBg}
        alt="Hero background"
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
};

export default AboutHero;
