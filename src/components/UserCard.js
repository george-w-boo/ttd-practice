import { useState } from "react";
import { useSelector } from "react-redux";

import Input from "../components/Input";
import ava from "../assets/avatar.svg";

const UserCard = ({ user }) => {
  const [inEditMode, setInEditMode] = useState(false);
  const loggedInUserId = useSelector((state) => state.id);

  let content;

  if (inEditMode) {
    content = (
      <>
        <Input
          label="Change your username"
          id="username"
          placeholder
          value={user.username}
        />
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-outline-secondary">Cancel</button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{user.username}</h3>
        {user.id === loggedInUserId && (
          <button
            className="btn btn-outline-success"
            onClick={() => setInEditMode(true)}
          >
            Edit
          </button>
        )}
      </>
    );
  }

  return (
    <div className="card text-center">
      <div className="card-header">
        <img
          src={user.img || ava}
          alt={`${user}'s avatar`}
          width="200"
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body">{content}</div>
    </div>
  );
};

export default UserCard;
