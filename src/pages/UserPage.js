import React from "react";
import { useParams, defer, useLoaderData, Await } from "react-router-dom";
import { getUser } from "../api/apiCalls";

import testIDs from "../test-ids.json";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const UserPage = () => {
  let { userId } = useParams();
  const getUsersResponseDeffered = useLoaderData();

  return (
    <div data-testid={`${testIDs.userPage}-${userId}`}>
      <p>UserPage</p>
      <React.Suspense
        fallback={
          <div className="d-flex justify-content-center">
            <Spinner />
          </div>
        }
      >
        <Await
          resolve={getUsersResponseDeffered.getUserResponse}
          errorElement={<Alert />}
        >
          {({ data }) => {
            console.log("axiosResponse", data);
            return <p>{data.username}</p>;
          }}
        </Await>
      </React.Suspense>
    </div>
  );
};

export default UserPage;

export function loader({ params }) {
  return defer({ getUserResponse: getUser(params.userId) });
}
