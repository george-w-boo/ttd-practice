import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import testIDs from "../test-ids.json";

import LoginPage from "./LoginPage";

let requestBody;
let counter = 0;

const server = setupServer(
  rest.post("/api/1.0/users", async (req, res, ctx) => {
    requestBody = await req.json();
    counter += 1;

    return res(ctx.status(200));
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
      render(<LoginPage />);

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

    it("checks if sign-up submit fn has proper body (Mock Server Worker solution)", async () => {
      setup();

      userEvent.click(loginBtnEl);

      expect(requestBody).toEqual({
        username: "test-user",
        email: "test@test.com",
        password: "secret",
      });
    });

    it("checks if sign-up btn is disabled while ongoing api call", async () => {
      setup();

      userEvent.click(loginBtnEl);
      userEvent.click(loginBtnEl);

      expect(counter).toEqual(1);
    });

    it("renders spinner after clicking login", async () => {
      setup();

      let spinnerEl = screen.queryByRole("status", { hidden: true });

      expect(spinnerEl).not.toBeInTheDocument();
      userEvent.click(loginBtnEl);

      spinnerEl = screen.queryByRole("status", { hidden: true });

      expect(spinnerEl).toBeInTheDocument();
    });

    it("hides sign-up form upon successful api call", async () => {
      setup();

      const formEl = screen.getByTestId(testIDs.LoginPage);

      userEvent.click(loginBtnEl);

      await waitForElementToBeRemoved(formEl);
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it("hides spinner and makes sign-up btn enabled after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );

      setup();

      userEvent.click(loginBtnEl);

      const spinnerEl = screen.queryByRole("status", { hidden: true });
      const usernameValidationErrorEl = await screen.findByText(
        "Username cannot be null"
      );

      expect(usernameValidationErrorEl).toBeInTheDocument();
      expect(spinnerEl).not.toBeInTheDocument();
    });

    it.each`
      field         | message
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));

      setup();

      userEvent.click(loginBtnEl);

      const validationErrorEl = await screen.findByText(message);

      expect(validationErrorEl).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"email"}    | ${"Email cannot be null"}    | ${"Email"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears $field validation error on typing",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));

        setup();

        userEvent.click(loginBtnEl);

        const validationErrorEl = await screen.findByText(message);

        userEvent.type(screen.getByLabelText(label), "updated");

        expect(validationErrorEl).not.toBeInTheDocument();
      }
    );
  });

  describe("Internalization", () => {
    // to do...
  });
});
