import React from "react";
import Mobile from "../../assets/landing/mobile.png";
import Title from "./Title";

const MobileApp = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        {/* <h2 className="mb-12 text-center text-3xl font-bold md:text-[48px]">
          Mobile Application
        </h2> */}
        <Title title={"Mobile Application"} />

        <div className="flex items-center justify-around">
          <div className="left text-[100px]">Coming soon</div>
          <div className="right">
            <img src={Mobile} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
