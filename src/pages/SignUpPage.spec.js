import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

import SignUpPage from "./SignUpPage";

describe("SignUpPage", () => {
  describe("Layout", () => {
    it("renders SignUpPage", () => {
      render(<SignUpPage />);

      const headerEl = screen.getByRole("heading", { name: "Sign Up" });

      expect(headerEl).toBeInTheDocument();
    });

    it("has input Username of type text", () => {
      render(<SignUpPage />);

      const usernameInputEl = screen.getByLabelText(/username/i);

      expect(usernameInputEl.type).toBe("text");
    });

    it("has input Email of type email", () => {
      render(<SignUpPage />);

      const emailInputEl = screen.getByLabelText(/email/i);

      expect(emailInputEl.type).toBe("email");
    });

    it("has input Password of type Password", () => {
      render(<SignUpPage />);

      const passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });

      expect(passwordInputEl.type).toBe("password");
    });

    it("has input Password Repeat of type Password", () => {
      render(<SignUpPage />);

      const passwordRepeatInputEl = screen.getByLabelText(/Password Repeat/i);

      expect(passwordRepeatInputEl.type).toBe("password");
    });

    it("has Sign Up btn initially disabled", () => {
      render(<SignUpPage />);

      const signUpBtnEl = screen.getByRole("button", { name: /sign up/i });

      expect(signUpBtnEl).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let signUpBtnEl;
    const message = "Please, check you email!";

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

    const setup = (password = "secret", passwordRepeat = "secret") => {
      render(<SignUpPage />);

      const usernameInputEl = screen.getByLabelText(/username/i);
      const emailInputEl = screen.getByLabelText(/email/i);
      const passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });
      const passwordRepeatInputEl = screen.getByLabelText(/Password Repeat/i);
      signUpBtnEl = screen.getByRole("button", { name: /sign up/i });

      userEvent.type(usernameInputEl, "test-user");
      userEvent.type(emailInputEl, "test@test.com");
      userEvent.type(passwordInputEl, password);
      userEvent.type(passwordRepeatInputEl, passwordRepeat);
    };

    it("enables sign-up btn if password and password repeat are the same", () => {
      setup();

      expect(signUpBtnEl).toBeEnabled();
    });

    // manual approach to check if sign-up submit fn has proper body
    // it("checks if sign-up submit fn has proper body", () => {
    //   render(<SignUpPage />);

    //   const usernameInputEl = screen.getByLabelText(/username/i);
    //   const emailInputEl = screen.getByLabelText(/email/i);
    //   const passwordInputEl = screen.getByLabelText("Password", {
    //     exact: true,
    //   });
    //   const passwordRepeatInputEl = screen.getByLabelText(/Password Repeat/i);
    //   const signUpBtnEl = screen.getByRole("button", { name: /sign up/i });

    //   userEvent.type(usernameInputEl, "test-user");
    //   userEvent.type(emailInputEl, "test@test.com");
    //   userEvent.type(passwordInputEl, "secret");
    //   userEvent.type(passwordRepeatInputEl, "secret");

    //   const mockFn = jest.fn();

    //   axios.post = mockFn;

    //   userEvent.click(signUpBtnEl);

    //   const signUpFirstCall = mockFn.mock.calls[0];
    //   const signUpSecondArgument = signUpFirstCall[1];

    //   expect(signUpSecondArgument).toEqual({
    //     username: "test-user",
    //     email: "test@test.com",
    //     password: "secret",
    //   });
    // });

    it("checks if sign-up submit fn has proper body (Mock Server Worker solution)", async () => {
      setup();

      userEvent.click(signUpBtnEl);

      await screen.findByText(message);

      expect(requestBody).toEqual({
        username: "test-user",
        email: "test@test.com",
        password: "secret",
      });
    });

    it("checks if sign-up btn is disabled while ongoing api call", async () => {
      setup();

      userEvent.click(signUpBtnEl);
      userEvent.click(signUpBtnEl);

      await screen.findByText(message);

      expect(counter).toEqual(1);
    });

    it("renders spinner after clicking sign up", async () => {
      setup();

      let spinnerEl = screen.queryByRole("status", { hidden: true });

      expect(spinnerEl).not.toBeInTheDocument();
      userEvent.click(signUpBtnEl);

      spinnerEl = screen.queryByRole("status", { hidden: true });

      expect(spinnerEl).toBeInTheDocument();

      await screen.findByText(message);
    });

    it("renders check email alert after successful api call", async () => {
      setup();

      let emailAlertEl = screen.queryByText(message);

      expect(emailAlertEl).not.toBeInTheDocument();

      userEvent.click(signUpBtnEl);

      emailAlertEl = await screen.findByText(message);

      expect(emailAlertEl).toBeInTheDocument();
    });

    it("hides sign-up form upon successful api call", async () => {
      setup();

      const formEl = screen.getByTestId("sign-up-form");

      userEvent.click(signUpBtnEl);

      await waitForElementToBeRemoved(formEl);

      // alternative for waitForElementToBeRemoved:
      // await waitFor(() => {
      //   expect(formEl).not.toBeInTheDocument();
      // });
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

      userEvent.click(signUpBtnEl);

      const spinnerEl = screen.queryByRole("status", { hidden: true });
      const usernameValidationErrorEl = await screen.findByText(
        "Username cannot be null"
      );

      expect(usernameValidationErrorEl).toBeInTheDocument();
      expect(spinnerEl).not.toBeInTheDocument();
    });

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));

      setup();

      userEvent.click(signUpBtnEl);

      const validationErrorEl = await screen.findByText(message);

      expect(validationErrorEl).toBeInTheDocument();
    });

    it("displays passwords mismatch client validation error", () => {
      setup('secret', 'secret-two');

      userEvent.click(signUpBtnEl);

      const validationErrorEl = screen.getByText('Passwords mismatch');

      expect(validationErrorEl).toBeInTheDocument();
    });
  });
});
