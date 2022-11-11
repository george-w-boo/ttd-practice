import React from "react";
import { defer } from "react-router-dom";
import { getUsers, getUsersAxios } from "../api/apiCalls";
import UserList from "../components/UserList";
import testIDs from "../test-ids.json";

const HomePage = () => {
  return (
    <div data-testid={testIDs.homePage}>
      <UserList />
    </div>
  );
};

export default HomePage;

export function loader() {
  // return defer({ axiosResponse: getUsersAxios() });
  return defer({ axiosResponse: getUsers() });
}
