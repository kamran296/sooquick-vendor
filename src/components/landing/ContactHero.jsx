import React from "react";
import ContactBg from "../../assets/landing/contact.png";

const ContactHero = () => {
  return (
    <div className="relative flex h-[40vh] w-full items-start md:h-auto">
      {/* Mobile: Show full image without cropping */}
      <img
        src={ContactBg}
        alt="Hero background"
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
};

export default ContactHero;
