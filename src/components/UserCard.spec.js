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

  it("hides edit layout upon successful username update", async () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    const spinner = await screen.findByRole("status");

    await waitForElementToBeRemoved(spinner);

    expect(editUsernameInput).not.toBeInTheDocument();
  });

  it("updates username in after successful edit call", async () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);
    userEvent.clear(editUsernameInput);
    userEvent.type(editUsernameInput, "new-user");

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    const updatedHeading = await screen.findByRole("heading", {
      name: /new-user/i,
    });

    expect(updatedHeading).toBeInTheDocument();
  });

  it("renders last updated name in input in edit mode after successful username update", async () => {
    setup();

    let editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    let editUsernameInput = screen.queryByLabelText(/Change your username/i);
    userEvent.clear(editUsernameInput);
    userEvent.type(editUsernameInput, "new-user");

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    editBtn = await screen.findByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    editUsernameInput = screen.queryByLabelText(/Change your username/i);

    expect(editUsernameInput).toHaveValue("new-user");
  });

  it("hides edit layout upon clicking cancel btn and displays original username", async () => {
    setup();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);
    userEvent.type(editUsernameInput, "adfsdf");

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    userEvent.click(cancelBtn);

    const heading = screen.getByRole("heading", { name: "test2" });

    expect(heading).toBeInTheDocument();
  });

  it("renders last updated username upon clicking cancel in second edit", async () => {
    setup();

    let editBtn = screen.getByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const editUsernameInput = screen.queryByLabelText(/Change your username/i);
    userEvent.clear(editUsernameInput);
    userEvent.type(editUsernameInput, "new username");

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    editBtn = await screen.findByRole("button", { name: /edit/i });
    userEvent.click(editBtn);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    userEvent.click(cancelBtn);

    const heading = screen.getByRole("heading", { name: "new username" });

    expect(heading).toBeInTheDocument();
  });

  it("renders delete btn when logged-in user is shown", () => {
    setup();

    const deleteBtn = screen.getByRole("button", {
      name: /delete my account/i,
    });

    expect(deleteBtn).toBeInTheDocument();
  });

  it("does not render delete btn when not logged-in user is shown", () => {
    setup({ ...fakeUser, id: 1 });

    const deleteBtn = screen.queryByRole("button", {
      name: /delete my account/i,
    });

    expect(deleteBtn).not.toBeInTheDocument();
  });

  it("renders modal upon clicking delete btn", () => {
    setup();

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

    const deleteBtn = screen.queryByRole("button", {
      name: /delete my account/i,
    });
    userEvent.click(deleteBtn);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("renders confirmation question with cancel and confirm btn upon clicking delete btn", () => {
    setup();

    const deleteBtn = screen.queryByRole("button", {
      name: /delete my account/i,
    });
    userEvent.click(deleteBtn);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
  });
});
