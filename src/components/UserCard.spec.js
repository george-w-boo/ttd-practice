import storage from "../state/storage";
import { render, screen } from "../test-utils";
import UserCard from "./UserCard";

const fakeUser = {
  id: 27,
  username: "test2",
  email: "test2@test.com",
  image: null,
};

describe("UserCard", () => {
  const setup = (user = fakeUser) => {
    storage.setItem("auth", fakeUser);
    render(<UserCard user={user} />);
  };

  it("renders edit btn when logged-in user is shown", () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });

    expect(editBtn).toBeInTheDocument();
  });

  it("does not render edit btn when not logged-in user is shown", () => {
    setup({ ...fakeUser, id: 1 });

    const editBtn = screen.queryByRole("button", { name: /edit/i });

    expect(editBtn).not.toBeInTheDocument();
  });
});
