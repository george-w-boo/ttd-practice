import React from "react";
import { Link } from "react-router-dom";

const UserListItem = ({ user }) => {
  return (
    <Link
      to={`/user/${user.id}`}
      data-testid={`${user.username}-${user.id}`}
      style={{ textDecoration: "none" }}
    >
      <li
        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
      >
        <div className="me-auto d-flex flex-column align-items-start">
          <span className="fw-bold">{user.username}</span>
          {user.email}
        </div>
      </li>
    </Link>
  );
};

export default UserListItem;
