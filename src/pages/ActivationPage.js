import React from "react";
import { useParams } from "react-router-dom";

import testIDs from "../test-ids.json";

const ActivationPage = () => {
  const { token } = useParams();

  return (
    <div data-testid={testIDs.activationPage + "-" + token}>ActivationPage</div>
  );
};

export default ActivationPage;
