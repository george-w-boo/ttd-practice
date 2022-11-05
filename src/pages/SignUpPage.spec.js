import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

import SignUpPage from "./SignUpPage";

describe("SignUpPage", () => {
  describe("Layout", () => {
    it("renders learn react link", () => {
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

    const setup = () => {
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
      userEvent.type(passwordInputEl, "secret");
      userEvent.type(passwordRepeatInputEl, "secret");
    }

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
      let requestBody;

      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          requestBody = await req.json();

          console.log("requstBody", requestBody);

          return res(ctx.status(200));
        })
      );

      server.listen();

      setup();

      userEvent.click(signUpBtnEl);

      await new Promise((resolve) => setTimeout(resolve), 500);

      expect(requestBody).toEqual({
        username: "test-user",
        email: "test@test.com",
        password: "secret",
      });

      server.close();
    });

    it("checks if sign-up btn is disabled while ongoing api call", async () => {
      let counter = 0;

      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          counter++;

          return res(ctx.status(200));
        })
      );

      server.listen();
      
      setup();

      userEvent.click(signUpBtnEl);
      userEvent.click(signUpBtnEl);

      await new Promise((resolve) => setTimeout(resolve), 500);

      expect(counter).toEqual(1);

      server.close();
    });

    it("checks if spinner is visible after clicking sign up", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {

          return res(ctx.status(200));
        })
      );

      server.listen();
      
      setup();
      
      let spinnerEl = screen.queryByRole('status', { hidden: true });

      expect(spinnerEl).not.toBeInTheDocument();
      userEvent.click(signUpBtnEl);
      
      spinnerEl = screen.queryByRole('status', { hidden: true });

      expect(spinnerEl).toBeInTheDocument();

      server.close();
    });
  });
});
