import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";

import logo from "../assets/hoaxify.png";

import LanguageSelector from "./LanguageSelector";
import { AuthContext } from "../state/AuthContextProvider";

const NavBar = () => {
  const auth = useContext(AuthContext);

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
          {!auth.isLoggedIn && (
            <>
              <Link className="nav-link" to="/signup" title="SignUp">
                {t("signUp")}
              </Link>
              <Link className="nav-link" to="/login" title="Login">
                Login
              </Link>
            </>
          )}
          {auth.isLoggedIn && (
            <Link
              className="nav-link"
              to={`/user/${auth.id}`}
              title="My Profile"
            >
              My Profile
            </Link>
          )}
          <LanguageSelector />
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
