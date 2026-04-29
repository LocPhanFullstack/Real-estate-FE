import React from "react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import DiscoverSection from "./components/DiscoverSection";
import CallToActionSection from "./components/CallToActionSection";
import FooterSection from "./components/FooterSection";

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
