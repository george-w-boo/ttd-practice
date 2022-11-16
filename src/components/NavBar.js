import React from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";

import logo from "../assets/hoaxify.png";

import LanguageSelector from "./LanguageSelector";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img
            src={logo}
            width="60"
            alt="hoaxify logo"
            style={{ marginLeft: "-8px" }}
          />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          <Link className="nav-link" to="/signup" title="SignUp">
            {t("signUp")}
          </Link>
          <Link className="nav-link" to="/login" title="Login">
            Login
          </Link>
          <LanguageSelector />
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
