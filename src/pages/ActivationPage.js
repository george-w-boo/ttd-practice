import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { activate } from "../api/apiCalls";
import testIDs from "../test-ids.json";

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

        if (response.status === 400) {
          setError({ message: response });
          return;
        }

        setResult("success");
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
        <div className="alert alert-success mt-3">Account is activated</div>
      )}
      {error && (
        <div className="alert alert-danger mt-3">Error: {error.message}</div>
      )}
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
