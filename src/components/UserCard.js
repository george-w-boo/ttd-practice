import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Input from "../components/Input";
import ava from "../assets/avatar.svg";
import { deleteUser, updateUser } from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { logoutSuccess, userUpdateSuccess } from "../state/authActions";

const UserCard = ({ user }) => {
  const [userName, setUserName] = useState(user.username);
  const [inEditMode, setInEditMode] = useState(false);
  const [isUpdateUserIsLoading, setUpdateUserIsLoading] = useState(false);
  const [isDeleteUserIsLoading, setDeleteUserIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { id, header, username } = useSelector((store) => ({
    id: store.id,
    username: store.username,
    header: store.header,
  }));

  useEffect(() => {
    setUserName(user.username);
  }, [user]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let content;

  const onChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const onSaveHandler = async (userId, userName) => {
    try {
      setUpdateUserIsLoading(true);
      await updateUser(userId, userName, header);
      setInEditMode(false);
      dispatch(
        userUpdateSuccess({
          username: userName,
        })
      );
    } catch (err) {}

    setUpdateUserIsLoading(false);
  };

  const onDeleteYesHandler = async (userId) => {
    try {
      setDeleteUserIsLoading(true);
      await deleteUser(userId, header);
      navigate("/");
      dispatch(logoutSuccess());
    } catch (err) {}

    setDeleteUserIsLoading(false);
  };

  const onCancelHandler = () => {
    setInEditMode(false);
    setUserName(username);
  };

  const onDeleteHandler = () => {
    setIsModalVisible(true);
  };

  const closeModalHandler = () => {
    setIsModalVisible(false);
  };

  if (inEditMode) {
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
          isDisabled={isUpdateUserIsLoading}
          isLoading={isUpdateUserIsLoading}
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
          <>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-outline-success"
                onClick={() => setInEditMode(true)}
              >
                Edit
              </button>
              &nbsp;
              <button className="btn btn-danger" onClick={onDeleteHandler}>
                Delete My Account
              </button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
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
      {isModalVisible && (
        <Modal
          title="Are you sure?"
          onClicLeftBtn={closeModalHandler}
          onClickRightBtn={() => onDeleteYesHandler(id)}
          isLoading={isDeleteUserIsLoading}
        />
      )}
    </>
  );
};

export default UserCard;
