import React from "react";
import RootLayout from "../../layouts/landing/RootLayout";
import FaqHero from "../../components/landing/faq/FaqHero";
import HowitWorks from "../../components/landing/faq/HowitWorks";
import {
  customerFaqData,
  customerSteps,
  vendorSteps,
} from "../../utils/landingData";

const Faq = () => {
  return (
    <RootLayout>
      <FaqHero />
      <HowitWorks />
      {/* <HowitWorks
        whom={"Vendors"}
        data={customerSteps}
        faqData={customerFaqData}
      /> */}
    </RootLayout>
  );
};

export default Faq;
