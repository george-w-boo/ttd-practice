import { waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import storage from "../state/storage";
import { render, screen } from "../test-utils";
import UserCard from "./UserCard";

import { setupServer } from "msw/node";
import { rest } from "msw";

let id, requestBody, header;

const server = setupServer(
  rest.put("/api/1.0/users/:id", async (req, res, ctx) => {
    id = req.params.id;
    requestBody = await req.json();
    header = req.headers.get("Authorization");

    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  id = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const fakeUser = {
  id: 27,
  username: "test2",
  email: "test2@test.com",
  image: null,
  header: "auth header value",
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

  it("sends edit user api request with proper id and request body", async () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);
    userEvent.clear(editUsernameInput);
    userEvent.type(editUsernameInput, "username-updated");

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    const spinner = await screen.findByRole("status");

    await waitForElementToBeRemoved(spinner);

    expect(id).toBe("27");
    expect(requestBody).toEqual({ username: "username-updated" });
  });

  it("sends edit-user request with authorization header", async () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    const spinner = await screen.findByRole("status");

    await waitForElementToBeRemoved(spinner);

    expect(header).toBe("auth header value");
  });
});
