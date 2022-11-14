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

  const onClickNextHandler = (event) => {
    event.preventDefault();
    setPage((latestState) => ({ ...latestState, page: latestState.page + 1 }));
  };

  const onClickPreviousHandler = (event) => {
    event.preventDefault();
    setPage((latestState) => ({ ...latestState, page: latestState.page - 1 }));
  };

  const onClickDigitHandler = (event) => {
    const {} = event.t;
  };

  console.log("page", page);

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
      <div className="card-footer">
        <nav aria-label="users pagination">
          <ul class="pagination">
            <li class={`page-item ${page === 0 ? "disabled" : ""}`}>
              <a class="page-link" href="/" onClick={onClickPreviousHandler}>
                &lt; Previous
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li class="page-item" key={i}>
                <a class="page-link" href="/">
                  {i + 1}
                </a>
              </li>
            ))}
            <button
              class={`page-item ${
                page && page === totalPages - 1 ? "disabled" : ""
              }`}
            >
              <a class="page-link" href="/" onClick={onClickNextHandler}>
                Next &gt;
              </a>
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UserList;
