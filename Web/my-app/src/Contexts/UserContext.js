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
            const userData = await tokenVerification(token);
            if (userData) {
                setCurrentUser(userData);
                return true;
            } else {
                alert("Invalid token.");
                logout(); // Logout if token is invalid
                return false;
            }
        } else {
            logout(); // Logout if no token found
            return false;
        }
    };

    // Verify admin token and navigate if user is an admin
    const verifyAdminToken = async () => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            const userData = await tokenVerification(token);
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
