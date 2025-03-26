import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NetflixLogo from "../NetflixLogo/NetflixLogo";
import TopMenuButton from "../TopMenuButton/TopMenuButton";
import SearchBar from "../SearchBar/SearchBar";
import "./TopMenu.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import tokenVerification from "../../tokenVerification/tokenVerification";

function TopMenu({ LogOutSystem, VerifyAdmin, isTop }) {
  const [userProfilePic, setUserProfilePic] = useState("/media/squirel.jpeg");
  const [ifAdmin, setAdmin] = useState(false);

  // Fetch user profile picture
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const userData = await tokenVerification(token);

        if (userData) {
          const response = await fetch(
            `http://localhost:3000/api/users/${userData._id}`, // Use template literal for dynamic URL
            {
              method: "GET", // GET request to the server
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data from the server.");
          }

          const data = await response.json(); // Parse the response JSON

          const pictureUrl = `http://localhost:3000/${data.profilePicture}`;
          setUserProfilePic(pictureUrl); // Update profile picture
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch admin mode
  const fetchAdminMode = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); // Retrieve the JWT token
      if (token) {
        const userData = await tokenVerification(token); // Verify the token and get user data
        if (userData) {
          const response = await fetch(
            `http://localhost:3000/api/users/${userData._id}`, // Use template literal for dynamic URL
            {
              method: "GET", // GET request to the server
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data from the server.");
          }

          const data = await response.json(); // Parse the response JSON
          setAdmin(data.manager); // Update admin mode based on the server response
        }
      }
    } catch (error) {
      console.error("Error fetching admin mode:", error); // Log any errors
    }
  };

  // Polling for user data and admin mode
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
      await fetchAdminMode();
    };

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch periodically
    }, 10000000); // Poll every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className={`top-menu ${isTop ? "transparent" : "solid"}`}>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={
          isTop
            ? {
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease-in-out",
              }
            : {}
        }
      >
        <div className="container-fluid">
          <div className="stream-logo">
          {/* Netflix Logo */}
          <Link to="/main" className="navbar-brand">
            <NetflixLogo />
          </Link>
          </div>

          {/* Toggler button for small screens */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar content */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <TopMenuButton dest="Home" />
              <TopMenuButton dest="Movies" />
              {ifAdmin && (
                <TopMenuButton
                  dest="admin-zone"
                  onClick={() => VerifyAdmin()}
                />
              )}
              <TopMenuButton dest="Logout" onClick={() => LogOutSystem()} />
            </ul>

            {/* Search Bar */}
            <SearchBar />

            {/* Profile Icon */}
            <ProfileIcon imagePath={userProfilePic} altText="User Profile" />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TopMenu;
