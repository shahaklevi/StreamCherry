import React from "react";
import { Link } from "react-router-dom";

function TopMenuButton({ dest, onClick }) {
  const handleClick = (e) => {
    if (dest.toLowerCase() === "logout") {
      e.preventDefault(); // Prevent default navigation for logout
      onClick(); // Call the onClick event for logout
    } else if (onClick) {
      e.preventDefault(); // Prevent navigation and execute onClick for other buttons
      onClick();
    }
  };

  return (
    <li className="nav-item">
      <Link
        to={dest.toLowerCase() === "logout" ? "#" : `/${dest.toLowerCase()}`} // Use '#' for logout
        className="nav-link active"
        aria-current="page"
        onClick={handleClick} // Attach the click handler
      >
        {dest}
      </Link>
    </li>
  );
}

export default TopMenuButton;
