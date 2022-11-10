import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

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
                return axiosResponse.data.users?.map((user, i) => (
                  <li
                    key={user.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="me-auto d-flex flex-column align-items-start">
                      <span className="fw-bold">{user.firstName}</span>
                      {user.age}
                    </div>
                    <button type="button" className="btn btn-primary">
                      See User
                    </button>
                  </li>
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
