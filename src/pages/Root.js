import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar";

const Root = () => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });
  return (
    <>
      <NavBar auth={auth} />
      <div className="container pt-3">
        <Outlet context={[auth, setAuth]} />
      </div>
    </>
  );
};

export default Root;
