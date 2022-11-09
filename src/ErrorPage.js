import { useRouteError } from "react-router-dom";
import Alert from "./components/Alert";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="container">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Alert type="danger" textContent={error.statusText || error.message} />
    </div>
  );
}
