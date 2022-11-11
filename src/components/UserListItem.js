import React from "react";

const UserListItem = ({ user }) => {
  return (
    <li
      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
      style={{ cursor: "pointer" }}
    >
      <div className="me-auto d-flex flex-column align-items-start">
        <span className="fw-bold">{user.username}</span>
        {user.email}
      </div>
    </li>
  );
};

export default UserListItem;
