import React from "react";
import testIDs from "../test-ids.json";

const HomePage = () => {
  return <div data-testid={testIDs.homePage}>HomePage</div>;
};

export default HomePage;
