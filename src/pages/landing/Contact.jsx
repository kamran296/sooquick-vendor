import React from "react";
import RootLayout from "../../layouts/landing/RootLayout";
import ContactHero from "../../components/landing/ContactHero";
import ContactMain from "../../components/landing/ContactMain";

const Contact = () => {
  return (
    <RootLayout>
      <ContactHero />
      <ContactMain />
    </RootLayout>
  );
};

export default Contact;
