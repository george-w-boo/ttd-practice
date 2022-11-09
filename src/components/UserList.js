import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import Spinner from "./Spinner";

const UserList = () => {
  const data = useLoaderData();

  console.log("result", data);

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
              resolve={data.data}
              errorElement={<div>Couldn't load users</div>}
            >
              {({ users }) =>
                users?.map((user, i) => (
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
                ))
              }
            </Await>
          </React.Suspense>
        </ul>
      </div>
    </div>
  );
};

export default UserList;
