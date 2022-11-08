import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ActivationPage from "./pages/ActivationPage";

function App() {
  return (
    <>
      <NavBar />
      <div className="container pt-3">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/activation/:token" element={<ActivationPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
