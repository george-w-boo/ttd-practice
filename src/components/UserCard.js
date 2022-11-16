import ava from "../assets/avatar.svg";

const UserCard = ({ user }) => {
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
      <div className="card-body">
        <h3>{user.username}</h3>
      </div>
    </div>
  );
};

export default UserCard;
