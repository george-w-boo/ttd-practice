import React from "react";
import { render } from "@testing-library/react";
import AuthContextProvider from "./state/AuthContextProvider";
import LanguageSelector from "./components/LanguageSelector";

const AllTheProviders = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
      <LanguageSelector />
    </AuthContextProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
