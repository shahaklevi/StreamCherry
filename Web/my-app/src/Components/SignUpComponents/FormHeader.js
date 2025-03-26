import React from "react";
import { Link } from "react-router-dom";
import NetflixLogo from "../NetflixLogo/NetflixLogo";

const FormHeader = () => {
  return (
    <>
      <Link to="/">
        <NetflixLogo />
      </Link>
      <Link to="/login">
        <button
          type="button"
          className="btn btn-signin"
          style={{ color: "white"}}
        >
          Sign in
        </button>
      </Link>
    </>
  );
};

export default FormHeader;
