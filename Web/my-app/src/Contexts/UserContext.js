import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import tokenVerification from "../tokenVerification/tokenVerification";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Set the current user
    const setUser = (user) => {
        setCurrentUser(user);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("jwtToken");
        setCurrentUser(null);
        navigate("/login"); // Redirect to login page on logout
    };

    // Verify token and set user if valid
    const verifyToken = async () => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const userData = await tokenVerification(token);
                if (userData) {
                    setCurrentUser(userData);
                    return true;
                } else {
                    alert("Invalid token.");
                    logout();
                    return false;
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                alert("An error occurred while verifying the token.");
                logout();
                return false;
            }
        } else {
            logout();
            return false;
        }
    };
    

    const verifyAdminToken = async () => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            const user = await tokenVerification(token);
            const response = await fetch(
                `http://localhost:3000/api/users/${user._id}`, // Use template literal for dynamic URL
                {
                    method: "GET", // GET request to the server
                }
            );

            if (!response.ok) {
                alert("Failed to fetch user data.");
                logout();
                return false;
            }

            const userData = await response.json();
            if (userData) {
                if (userData.manager) {
                    alert("Welcome admin!");
                    setCurrentUser(userData);
                    navigate("/admin-zone"); // Navigate to admin zone
                    return true;
                } else {
                    alert("Access restricted: Admins only.");
                    return false;
                }
            } else {
                alert("Invalid token.");
                logout();
                return false;
            }
        } else {
            alert("No token found.");
            logout();
            return false;
        }
    };


    return (
        <UserContext.Provider
            value={{
                currentUser,
                setUser,
                logout,
                verifyToken,
                verifyAdminToken,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
