import React, { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import CallToAction from "./CallToAction";

const Home = () => {
  const { isAuthorized, user } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="bg-gray-50 min-h-screen">
    
      <h2 className="text-2xl mt-4 ">Welcome, {user.name}!</h2> {/* Display the user's name */}

      <HeroSection />
      <HowItWorks />
      <CallToAction />
    </section>
  );
};

export default Home;
