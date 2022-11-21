import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import LoginPage from "./LoginPage";
import { MemoryRouter } from "react-router-dom";

let requestBody,
  counter = 0;

const server = setupServer(
  rest.post("/api/1.0/auth", async (req, res, ctx) => {
    requestBody = await req.json();
    counter += 1;

    return res(ctx.status(401));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

describe("LoginPage", () => {
  describe("Layout", () => {
    it("renders LoginPage", () => {
      render(<LoginPage />);

      const headerEl = screen.getByRole("heading", { name: "Login" });

      expect(headerEl).toBeInTheDocument();
    });

    it("has input Email of type email", () => {
      render(<LoginPage />);

      const emailInputEl = screen.getByLabelText(/email/i);

      expect(emailInputEl.type).toBe("email");
    });

    it("has input Password of type Password", () => {
      render(<LoginPage />);

      const passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });

      expect(passwordInputEl.type).toBe("password");
    });

    it("has login btn initially disabled", () => {
      render(<LoginPage />);

      const loginBtnEl = screen.getByRole("button", { name: /login/i });

      expect(loginBtnEl).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let loginBtnEl;
    let emailInputEl;
    let passwordInputEl;

    const setup = (password = "secret") => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );

      emailInputEl = screen.getByLabelText(/email/i);
      passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });
      loginBtnEl = screen.getByRole("button", { name: /login/i });

      userEvent.type(emailInputEl, "test@test.com");
      userEvent.type(passwordInputEl, password);
    };

    it("enables login btn when email and password are filled", () => {
      setup();

      expect(loginBtnEl).toBeEnabled();
    });

    it("checks if login submit fn has proper body", async () => {
      setup();

      userEvent.click(loginBtnEl);

      const spinnerEl = screen.getByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinnerEl);

      expect(requestBody).toEqual({
        email: "test@test.com",
        password: "secret",
      });
    });

    it("checks if login btn is disabled while ongoing api call", async () => {
      setup();

      userEvent.click(loginBtnEl);
      userEvent.click(loginBtnEl);

      const spinnerEl = screen.getByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinnerEl);

      expect(counter).toEqual(1);
    });

    it("renders spinner during api call", async () => {
      setup();

      let spinnerEl = screen.queryByRole("status", { hidden: true });

      expect(spinnerEl).not.toBeInTheDocument();
      userEvent.click(loginBtnEl);

      spinnerEl = screen.getByRole("status", { hidden: true });

      await waitForElementToBeRemoved(spinnerEl);
    });

    const generateValidationError = () => {
      return rest.post("/api/1.0/auth", async (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ message: "Incorrect credentials" })
        );
      });
    };

    it("renders auth fail message", async () => {
      server.use(generateValidationError());
      setup();
      userEvent.click(loginBtnEl);

      const errorMsg = await screen.findByText(/Incorrect credentials/i);

      expect(errorMsg).toBeInTheDocument();
    });

    it("clears fail msg when text input is changed", async () => {
      server.use(generateValidationError());
      setup();
      userEvent.click(loginBtnEl);

      const errorMsg = await screen.findByText(/Incorrect credentials/i);

      expect(errorMsg).toBeInTheDocument();

      userEvent.type(emailInputEl, "t");

      expect(errorMsg).not.toBeInTheDocument();
    });
  });

  describe("Internalization", () => {
    // to do...
  });
});
