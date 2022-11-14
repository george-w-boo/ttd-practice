import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Alert from "./Alert";
import UserListItem from "./UserListItem";
import { getUsers } from "../api/apiCalls";

const UserList = () => {
  const [currentPage, setPage] = useState({
    content: [],
    page: 0,
    size: 3,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { content, page, size, totalPages } = currentPage;

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        setIsLoading(true);
        const response = await getUsers(page, size);
        setPage(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, size]);

  const onClickNextHandler = async () => {
    setPage((latestState) => ({ ...latestState, page: latestState.page + 1 }));
  };

  return (
    <div className="card">
      <div className="card-header text-center">
        <h3>Users</h3>
        <ul className="list-group">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Alert error={error.message} />
          ) : (
            content.map((user) => <UserListItem key={user.id} user={user} />)
          )}
        </ul>
      </div>
      <button
        onClick={onClickNextHandler}
        disabled={content.length < size ? true : false}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default UserList;
