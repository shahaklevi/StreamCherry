import React from "react";
import "./HomePage.css";
import HomePageForm from "Components/HomePageForm/HomePageForm";
import FeatureBoxes from "Components/Common/FeatureBoxes/FeatureBoxes"; // Import the new component

const HomePage = () => {
  return (
    <div className="homepage">
      <HomePageForm />
      <FeatureBoxes />
    </div>
  );
};

export default HomePage;
