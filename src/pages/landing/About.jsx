import React from "react";
import RootLayout from "../../layouts/landing/RootLayout";
import AboutHero from "../../components/landing/about/AboutHero";
import StoryAndMission from "../../components/landing/about/StoryAndMission";
import { aboutStory, aboutMission } from "../../utils/landingData";
import WhyChoose from "../../components/landing/about/WhyChoose";
import Team from "../../components/landing/about/Team";

const About = () => {
  return (
    <RootLayout>
      <AboutHero />
      <StoryAndMission title={"Our Story"} info={aboutStory} />
      <StoryAndMission title={"Vision And Mision"} info={aboutMission} />
      <WhyChoose />
      <Team />
    </RootLayout>
  );
};

export default About;
