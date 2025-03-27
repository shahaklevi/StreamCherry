import React, { useState } from "react";
import "./signUpForm.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { useLocation } from "react-router-dom";
import FormHeader from "../../Components/SignUpComponents/FormHeader";
import FileInput from "../../Components/SignUpComponents/FileInput";
import FormInput from "../../Components/SignUpComponents/FormInput";
import ThemeToggle from "../../Components/ThemeToggle/ThemeToggle";

const defaultAvatars = [
  "/images/avatars/avatar1.webp",
  "/images/avatars/avatar2.webp",
  "/images/avatars/avatar3.webp",
  "/images/avatars/avatar4.webp",
  "/images/avatars/avatar5.webp",
  "/images/avatars/avatar6.webp",
];

const SignUpForm = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [formData, setFormData] = useState({
    user_name: "",
    nickName: "", // New field for nickname
    password: "",
    confirmPassword: "",
    mail: email || "",
    phone: "",
    profilePicture: null,
    manager: false,
  });

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "manager" ? value === "yes" : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if confirmPassword is empty
    if (!formData.confirmPassword) {
      setErrorMessage("Confirm Password cannot be empty");
      return;
    }

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_name", formData.user_name);
    formDataToSend.append("nickName", formData.nickName); // Append nickName to the request
    formDataToSend.append("password", formData.password);
    formDataToSend.append("mail", formData.mail);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("manager", formData.manager);
    // Add detailed logging for profilePicture
    console.log("Profile picture before sending:", formData.profilePicture);
    console.log(
      "Profile picture type:",
      formData.profilePicture ? typeof formData.profilePicture : "null"
    );
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        body: formDataToSend,
      });
      console.log(response);

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("jwtToken", token);
        setUser(data.user);
        navigate("/main");
        alert("User Successfully Registered");
      } else {
        alert("Registry error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-overlay">
        <FormHeader />
        <div className="signup-toggle-wrapper">
          <ThemeToggle />
        </div>
        <div className="signup-form-container">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
            />
            <FormInput
              label="Phone"
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <FormInput
              label="Username"
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
            />
            <FormInput
              label="Nickname" // New field for nickname
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
            {/* Display error message */}
            {/* גריד אווטארים במקום FileInput */}
            <div className="avatars-grid">
              {defaultAvatars.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Avatar"
                  className={`avatar-option ${
                    formData.profilePicture === avatar ? "selected" : ""
                  }`}
                  onClick={() =>
                    console.log("Selected Avatar:", avatar) ||
                    setFormData({ ...formData, profilePicture: avatar })
                  }
                />
              ))}
            </div>
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
