import React from "react";

const UserListItem = ({ user }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="me-auto d-flex flex-column align-items-start">
        <span className="fw-bold">{user.firstName}</span>
        {user.email}
      </div>
      <button type="button" className="btn btn-primary">
        See User
      </button>
    </li>
  );
};

export default UserListItem;
