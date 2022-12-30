import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

import en from "../locale/en.json";
import ua from "../locale/ua.json";
import testIDs from "../test-ids.json";

import SignUpPage from "./SignUpPage";
import LanguageSelector from "../components/LanguageSelector";

let requestBody;
let counter = 0;
let acceptLanguageHeader;

const server = setupServer(
  rest.post("/api/1.0/users", async (req, res, ctx) => {
    requestBody = await req.json();
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");

    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

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
    let usernameInputEl;
    let emailInputEl;
    let passwordInputEl;

    const message = "Please, check you email!";

    const setup = (password = "secret", passwordRepeat = "secret") => {
      render(<SignUpPage />);

      usernameInputEl = screen.getByLabelText(/username/i);
      emailInputEl = screen.getByLabelText(/email/i);
      passwordInputEl = screen.getByLabelText("Password", {
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

      const formEl = screen.getByTestId(testIDs.signUpPage);

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
      setup("secret", "secret-two");

      userEvent.click(signUpBtnEl);

      const validationErrorEl = screen.getByText("Passwords mismatch");

      expect(validationErrorEl).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"Email cannot be null"}    | ${"Email"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears $field validation error on typing",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));

        setup();

        userEvent.click(signUpBtnEl);

        const validationErrorEl = await screen.findByText(message);

        userEvent.type(screen.getByLabelText(label), "updated");

        expect(validationErrorEl).not.toBeInTheDocument();
      }
    );
  });

  describe("Internalization", () => {
    let ukrainianToggleEl;
    let englishToggleEl;
    let passwordInputEl;
    let passwordRepeatInputEl;
    let signUpBtnEl;

    const setup = () => {
      render(
        <>
          <LanguageSelector />
          <SignUpPage />
        </>
      );

      ukrainianToggleEl = screen.getByTitle("Українська");
      englishToggleEl = screen.getByTitle("English");

      passwordInputEl = screen.getByLabelText(en.password, {
        exact: true,
      });
      passwordRepeatInputEl = screen.getByLabelText(en.passwordRepeat);

      signUpBtnEl = screen.getByRole("button", { name: en.signUp });
    };

    it("initially renders SignUpPage in English", () => {
      setup();

      const headerEl = screen.getByRole("heading", { name: en.signUp });
      const usernameInputEl = screen.getByLabelText(en.username);
      const emailInputEl = screen.getByLabelText(en.email);

      expect(headerEl).toBeInTheDocument();
      expect(usernameInputEl).toBeInTheDocument();
      expect(emailInputEl).toBeInTheDocument();
      expect(passwordInputEl).toBeInTheDocument();
      expect(passwordRepeatInputEl).toBeInTheDocument();
      expect(signUpBtnEl).toBeInTheDocument();
    });

    it("renders SignUpPage in Ukrainian after changing the language", () => {
      setup();

      userEvent.click(ukrainianToggleEl);

      const headerEl = screen.getByRole("heading", { name: ua.signUp });
      const usernameInputEl = screen.getByLabelText(ua.username);
      const emailInputEl = screen.getByLabelText(ua.email);
      const passwordInputEl = screen.getByLabelText(ua.password, {
        exact: true,
      });
      const passwordRepeatInputEl = screen.getByLabelText(ua.passwordRepeat);
      const signUpBtnEl = screen.getByRole("button", { name: ua.signUp });

      expect(headerEl).toBeInTheDocument();
      expect(usernameInputEl).toBeInTheDocument();
      expect(emailInputEl).toBeInTheDocument();
      expect(passwordInputEl).toBeInTheDocument();
      expect(passwordRepeatInputEl).toBeInTheDocument();
      expect(signUpBtnEl).toBeInTheDocument();
    });

    it("renders SignUpPage in English after switching to English", () => {
      setup();

      userEvent.click(englishToggleEl);

      const headerEl = screen.getByRole("heading", { name: en.signUp });
      const usernameInputEl = screen.getByLabelText(en.username);
      const emailInputEl = screen.getByLabelText(en.email);

      expect(headerEl).toBeInTheDocument();
      expect(usernameInputEl).toBeInTheDocument();
      expect(emailInputEl).toBeInTheDocument();
      expect(passwordInputEl).toBeInTheDocument();
      expect(passwordRepeatInputEl).toBeInTheDocument();
      expect(signUpBtnEl).toBeInTheDocument();
    });

    it("displays passwords mismatch validation alert in Ukrainian", () => {
      setup();

      userEvent.type(passwordInputEl, "update");
      userEvent.click(ukrainianToggleEl);

      const validationErrorEl = screen.getByText(
        ua.validationPasswordsMismatch
      );

      expect(validationErrorEl).toBeInTheDocument();
    });

    it("sends accept language header as en for outgoing request", async () => {
      setup();

      userEvent.type(passwordInputEl, "P4ssword");
      userEvent.type(passwordRepeatInputEl, "P4ssword");

      const signUpFormEl = screen.queryByTestId(testIDs.signUpPage);

      userEvent.click(signUpBtnEl);

      await waitForElementToBeRemoved(signUpFormEl);

      expect(acceptLanguageHeader).toBe("en");
    });

    it("sends accept language header as ua for outgoing request if ua is selected", async () => {
      setup();

      userEvent.type(passwordInputEl, "P4ssword");
      userEvent.type(passwordRepeatInputEl, "P4ssword");

      const signUpFormEl = screen.queryByTestId(testIDs.signUpPage);

      userEvent.click(ukrainianToggleEl);
      userEvent.click(signUpBtnEl);

      await waitForElementToBeRemoved(signUpFormEl);

      expect(acceptLanguageHeader).toBe("ua");
    });
  });
});
