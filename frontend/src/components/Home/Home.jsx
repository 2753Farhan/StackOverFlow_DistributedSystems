import React, { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import CallToAction from "./CallToAction";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <HeroSection />
      <HowItWorks />
      <PopularCategories />
      <CallToAction />
    </section>
  );
};

export default Home;
