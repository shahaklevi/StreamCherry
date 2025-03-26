import React from "react";
import { Link } from "react-router-dom";
import "./NetflixLogo.css";

function NetflixLogo() {
  return (
    <div className="logo-container">
      <svg
      className="streamcherry-logo"
        width="300"
        height="100"
        viewBox="0 8 111 70"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="StreamCherry Logo"
      >
        <text
          x="50%"
          y="50%"
          fill="#E50914"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="32"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          StreamCherry
        </text>
      </svg>
    </div>
  );
}

export default NetflixLogo;
