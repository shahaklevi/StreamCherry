import React from "react";
import { Link } from "react-router-dom";
import "./NetflixLogo.css";

function NetflixLogo() {
  return (
    <div className="logo-container">
      <img
        className="streamcherry-logo"
        src="/images/logos/7.png" 
        alt="StreamCherry Logo"
        width="300"
        height="100"
      />
    </div>
  );
}

export default NetflixLogo;
