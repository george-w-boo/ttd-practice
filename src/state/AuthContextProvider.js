import React, { useState, createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  id: "",
  setAuth: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
