import userEvent from "@testing-library/user-event";
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

  it("renders input for username after clicking edit btn", () => {
    setup();

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);

    expect(editUsernameInput).not.toBeInTheDocument();

    const editBtn = screen.queryByRole("button", { name: /edit/i });

    userEvent.click(editBtn);

    expect(screen.getByLabelText(/Change your username/i)).toBeInTheDocument();
  });

  it("renders save and cancel btns in edit mode", () => {
    setup();

    const editBtn = screen.queryByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const saveBtn = screen.queryByRole("button", { name: /save/i });
    const cancelBtn = screen.queryByRole("button", { name: /cancel/i });

    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  it("hides Edit btn and username in edit mode", () => {
    setup();

    const editBtn = screen.queryByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/test2/i)).not.toBeInTheDocument();
  });

  it("has current name in the input placeholder", () => {
    setup();

    const editBtn = screen.queryByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);

    expect(editUsernameInput).toHaveValue("test2");
  });
});
