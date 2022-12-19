import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Input from "../components/Input";
import ava from "../assets/avatar.svg";
import { updateUser } from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";

const UserCard = ({ user }) => {
  const [userName, setUserName] = useState(user.username);
  const [inEditMode, setInEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id, header, username } = useSelector((store) => ({
    id: store.id,
    username: store.username,
    header: store.header,
  }));

  useEffect(() => {
    setUserName(user.username);
  }, [user]);

  const dispatch = useDispatch();

  let content;

  const onChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const onSaveHandler = async (userId, userName) => {
    try {
      setIsLoading(true);
      await updateUser(userId, userName, header);
      setInEditMode(false);
      dispatch({
        type: "USER-UPDATE-SUCCESS",
        payload: {
          username: userName,
        },
      });
    } catch (err) {}

    setIsLoading(false);
  };

  const onCancelHandler = () => {
    setInEditMode(false);
    setUserName(username);
  };

  if (inEditMode) {
    console.log("userName", userName);
    content = (
      <>
        <Input
          type="text"
          label="Change your username"
          id="username"
          placeholder
          value={userName}
          onChange={onChangeHandler}
        />
        <ButtonWithProgress
          isDisabled={isLoading}
          isLoading={isLoading}
          onClick={() => onSaveHandler(user.id, userName)}
          text="Save"
        />
        <button className="btn btn-outline-secondary" onClick={onCancelHandler}>
          Cancel
        </button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{user.id === id ? username : userName}</h3>
        {user.id === id && (
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
