import {
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import ErrorPage from "./ErrorPage";

import Root from "./pages/Root";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ActivationPage from "./pages/ActivationPage";
import HomePage from "./pages/HomePage";

export const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index path="/" element={<HomePage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="user/:userId" element={<UserPage />} />
      <Route path="activation/:token" element={<ActivationPage />} />
    </Route>
  )
);

export const memoryRouter = (initialPath) =>
  createMemoryRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="user/:userId" element={<UserPage />} />
        <Route path="activation/:token" element={<ActivationPage />} />
      </Route>
    ),
    {
      initialEntries: [initialPath],
    }
  );
