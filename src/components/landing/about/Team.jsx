import React from "react";
import Title from "../Title";
import Team1 from "../../../assets/landing/team1.png";
import Team2 from "../../../assets/landing/team2.png";
import Team3 from "../../../assets/landing/team3.png";
import Team4 from "../../../assets/landing/team4.png";

const Team = () => {
  return (
    <div className="font-mont flex h-auto flex-col px-14 py-12">
      {/* header  */}
      <div className="">
        <Title title={"Small Team, Big Impact"} />
      </div>
      {/* Intro */}
      <div className="intro flex flex-col items-center justify-center gap-10">
        {/* First row - image left, text center */}
        <div className="top flex w-full items-center justify-between">
          <div className="left w-1/3">
            <img src={Team1} alt="logo" className="w-full" />
          </div>
          <div className="center w-1/3 text-center text-[26px] md:text-[50px]">
            Vinay Kumar <br />
            CEO & Founder
          </div>
          <div className="right hidden w-1/3 md:flex"></div>{" "}
          {/* Empty spacer */}
        </div>

        {/* Second row - text center, image right */}
        <div className="bottom flex w-full items-center justify-between">
          <div className="left hidden w-1/3 md:flex"></div> {/* Empty spacer */}
          <div className="center w-1/3 text-center text-[26px] md:text-[50px]">
            Vinay Kumar <br />
            CEO & Founder
          </div>
          <div className="right w-1/3">
            <img src={Team1} alt="logo" className="w-full" />
          </div>
        </div>
      </div>

      {/* join our team */}
      <div className="flex items-center justify-between pt-16">
        <div className="left">
          <img src={Team2} alt="" />
        </div>
        <div className="center">
          <img src={Team4} alt="" />
        </div>
        <div className="right">
          <img src={Team3} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Team;
