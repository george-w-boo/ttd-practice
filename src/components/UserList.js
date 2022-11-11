import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";
import UserListItem from "./UserListItem";

const UserList = () => {
  const getUsersResponseDeffered = useLoaderData();

  return (
    <div className="card">
      <div className="card-header text-center">
        <h3>Users</h3>
        <ul className="list-group">
          <React.Suspense
            fallback={
              <div className="d-flex justify-content-center">
                <Spinner />
              </div>
            }
          >
            <Await
              resolve={getUsersResponseDeffered.axiosResponse}
              errorElement={<Alert />}
            >
              {(axiosResponse) => {
                return axiosResponse.data.content?.map((user, i) => (
                  <UserListItem key={user.id} user={user} />
                ));
              }}
            </Await>
          </React.Suspense>
        </ul>
      </div>
    </div>
  );
};

export default UserList;
