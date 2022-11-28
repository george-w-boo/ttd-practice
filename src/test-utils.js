import React from "react";
import { render } from "@testing-library/react";
import AuthContextProvider from "./state/AuthContextProvider";
import { RouterProvider } from "react-router-dom";
import { memoryRouter } from "./routers";
import LanguageSelector from "./components/LanguageSelector";

const AllTheProviders = ({ children }) => {
  return (
    <RouterProvider router={memoryRouter}>
      <AuthContextProvider>
        {children}
        <LanguageSelector />
      </AuthContextProvider>
    </RouterProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
