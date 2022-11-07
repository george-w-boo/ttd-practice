import React from "react";
import { t } from "i18next";

import logo from "../assets/hoaxify.png";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/" title="Home" onClick={() => {}}>
          <img src={logo} width="60" alt="hoaxify logo" />
          Hoaxify
        </a>
        <ul className="navbar-nav">
          <a className="nav-link" href="/signup" onClick={() => {}}>
            {t("signUp")}
          </a>
          <a className="nav-link" href="/login" onClick={() => {}}>
            Login
          </a>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
