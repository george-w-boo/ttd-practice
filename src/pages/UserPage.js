import React from "react";
import { useParams } from "react-router-dom";

import testIDs from "../test-ids.json";

const UserPage = () => {
  let { userId } = useParams();

  return <div data-testid={`${testIDs.userPage}-${userId}`}>UserPage</div>;
};

export default UserPage;
