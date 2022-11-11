import {
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  useRouteError,
} from "react-router-dom";

import ErrorPage from "./ErrorPage";

import Root from "./pages/Root";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ActivationPage from "./pages/ActivationPage";
import HomePage, { loader as usersLoader } from "./pages/HomePage";
import Alert from "./components/Alert";

const subRoutes = (
  <>
    <Route
      index
      path="/"
      loader={usersLoader}
      element={<HomePage />}
      errorElement={<ErrorBoundary />}
    />
    <Route path="signup" element={<SignUpPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="user/:userId" element={<UserPage />} />
    <Route path="activation/:token" element={<ActivationPage />} />
  </>
);

const routes = (
  <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
    {subRoutes}
  </Route>
);

export const browserRouter = createBrowserRouter(
  createRoutesFromElements(routes)
);

export const memoryRouter = (initialPath, customRoutes = routes) =>
  createMemoryRouter(createRoutesFromElements(customRoutes), {
    initialEntries: [initialPath],
  });

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  if (error.response?.responseText) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return <Alert type="danger" textContent={error.response.responseText} />;
  }

  if (error.request?.responseText) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return <Alert type="danger" textContent={error.request?.responseText} />;
  }

  // Something happened in setting up the request that triggered an Error
  return <Alert type="danger" textContent={error.message} />;
}
