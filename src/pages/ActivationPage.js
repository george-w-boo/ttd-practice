import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { activate } from "../api/apiCalls";
import testIDs from "../test-ids.json";

import Alert from "../components/Alert";

const ActivationPage = ({ testToken = null }) => {
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let { token } = useParams();

  if (testToken) token = testToken;

  useEffect(() => {
    (async () => {
      setError(null);
      try {
        setIsLoading(true);
        const response = await activate(token);

        if (response.data.message === "Account is activated") {
          setResult("success");
          return;
        }

        setError({ message: response });
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  return (
    <div
      data-testid={testIDs.activationPage + "-" + token}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {result === "success" && (
        <Alert type="success" textContent="Account is activated" />
      )}
      {error && <Alert type="danger" textContent={error.message} />}
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
