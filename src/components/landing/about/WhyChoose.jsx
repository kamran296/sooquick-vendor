import React from "react";
import Title from "../Title";
const WhyChoose = () => {
  const subTitle = `“SooQuick is built on Trust, driven by Reliability, and designed for
     unmatched Convenience — so your life runs smoother, faster, safer.”`;
  return (
    <div className="flex h-auto flex-col px-14 py-12">
      <Title title={"Why Choose SooQuick"} subText={subTitle} />
      {/* container */}
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-around md:gap-10">
        <div className="card1 relative h-[300px] w-[250px] rounded-xl bg-[#0b8263]"></div>
        <div className="card1 relative h-[300px] w-[250px] rounded-xl bg-[#0b8263]"></div>
        <div className="card1 relative h-[300px] w-[250px] rounded-xl bg-[#0b8263]"></div>
      </div>
    </div>
  );
};

export default WhyChoose;
