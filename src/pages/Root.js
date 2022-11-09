import React from "react";
import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar";

const Root = () => {
  return (
    <>
      <NavBar />
      <div className="container pt-3">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
