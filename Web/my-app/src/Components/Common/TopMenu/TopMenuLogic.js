import { useUser } from "Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import React, { createContext, useContext, useState } from "react";

const TopMenuContext = createContext();
export const TopMenuProvider = ({ children }) => {
const navigate = useNavigate(); // Initialize useNavigate    
const { logout, verifyAdminToken } = useUser();
const LogOut = () => {
    logout();
    navigate("/login");
  };
  const isAdmin = () => {
    verifyAdminToken();
  };
  return (
    <TopMenuContext.Provider
        value={{
            LogOut,
            isAdmin,
        }}
    >
        {children}
    </TopMenuContext.Provider>
);
}
export const useTopMenu = () => useContext(TopMenuContext);
