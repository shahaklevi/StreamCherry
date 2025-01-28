import React from "react";
import "./IndicatorIcon.css";

const IndicatorIcon = ({ onClick, icon, ariaLabel }) => {
  return (
    <button className="indicator-icon" onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className="indicator-icon" />
    </button>
  );
};

export default IndicatorIcon;
