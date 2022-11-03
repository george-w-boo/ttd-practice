import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
    it("enables sign-up btn if password and password repeat are the same", () => {
      render(<SignUpPage />);

      const passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });
      const passwordRepeatInputEl = screen.getByLabelText(/Password Repeat/i);
      const signUpBtnEl = screen.getByRole("button", { name: /sign up/i });

      userEvent.type(passwordInputEl, "secret");
      userEvent.type(passwordRepeatInputEl, "secret");

      expect(signUpBtnEl).toBeEnabled();
    });
  });
});
