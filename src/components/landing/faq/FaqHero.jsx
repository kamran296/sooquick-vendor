import React from "react";
import FaqBg from "../../../assets/landing/faqBg.png";

const FaqHero = () => {
  return (
    <div className="relative flex h-[40vh] w-full items-start md:h-auto">
      {/* Mobile: Show full image without cropping */}
      <img
        src={FaqBg}
        alt="Hero background"
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
};

export default FaqHero;
