import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "./Spinner";

const UserList = () => {
  const { users } = useLoaderData();

  console.log("result", users);

  return (
    <div className="card">
      <div className="card-header text-center">
        <h3>Users</h3>
        <React.Suspense fallback={<Spinner />}>
          <Await
            resolve={users}
            errorElement={<div>Couldn't load users</div>}
            children={(resolvedUsers) => (
              <ul className="list-group">
                {resolvedUsers.map((user, i) => (
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
                ))}
              </ul>
            )}
          />
        </React.Suspense>
      </div>
    </div>
  );
};

export default UserList;
