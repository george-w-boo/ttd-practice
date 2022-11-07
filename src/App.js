import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  return (
    <div className="container">
      <LanguageSelector />
      <SignUpPage />
    </div>
  );
}

export default App;
