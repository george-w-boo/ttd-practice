import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import testIDs from "./test-ids.json";

import App from "./App";

describe("App", () => {
  describe("App routing", () => {
    const setup = (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
    };

    it("does not render HomePage at /signup", () => {
      setup("/signup");

      const homePageEl = screen.queryByTestId(testIDs.homePage);

      expect(homePageEl).not.toBeInTheDocument();
    });

    it.each`
      page                | path                   | testId
      ${"HomePage"}       | ${"/"}                 | ${testIDs.homePage}
      ${"SignUpPage"}     | ${"/signup"}           | ${testIDs.signUpPage}
      ${"LoginPage"}      | ${"/login"}            | ${testIDs.loginPage}
      ${"UserPage"}       | ${"/user/random-user"} | ${testIDs.userPage + "-random-user"}
      ${"ActivationPage"} | ${"/activation/token"} | ${testIDs.activationPage + "-token"}
    `("renders $page at $path", ({ _, path, testId }) => {
      setup(path);

      const pageEl = screen.getByTestId(testId);

      expect(pageEl).toBeInTheDocument();
    });

    it.each`
      page                | path                   | testId
      ${"HomePage"}       | ${"/signup"}           | ${testIDs.homePage}
      ${"HomePage"}       | ${"/login"}            | ${testIDs.homePage}
      ${"HomePage"}       | ${"/user/random-user"} | ${testIDs.homePage}
      ${"HomePage"}       | ${"/activation/token"} | ${testIDs.homePage}
      ${"SignPage"}       | ${"/"}                 | ${testIDs.signUpPage}
      ${"SignPage"}       | ${"/login"}            | ${testIDs.signUpPage}
      ${"SignPage"}       | ${"/user/random-user"} | ${testIDs.signUpPage}
      ${"SignPage"}       | ${"/activation/token"} | ${testIDs.signUpPage}
      ${"LoginPage"}      | ${"/"}                 | ${testIDs.loginPage}
      ${"LoginPage"}      | ${"/signup"}           | ${testIDs.loginPage}
      ${"LoginPage"}      | ${"/user/random-user"} | ${testIDs.loginPage}
      ${"LoginPage"}      | ${"/activation/token"} | ${testIDs.loginPage}
      ${"UserPage"}       | ${"/"}                 | ${testIDs.userPage + "-random-user"}
      ${"UserPage"}       | ${"/signup"}           | ${testIDs.userPage + "-random-user"}
      ${"UserPage"}       | ${"/login"}            | ${testIDs.userPage + "-random-user"}
      ${"UserPage"}       | ${"/activation/token"} | ${testIDs.userPage + "-random-user"}
      ${"ActivationPage"} | ${"/"}                 | ${testIDs.activationPage + "-token"}
      ${"ActivationPage"} | ${"/signup"}           | ${testIDs.activationPage + "-token"}
      ${"ActivationPage"} | ${"/login"}            | ${testIDs.activationPage + "-token"}
      ${"ActivationPage"} | ${"/user/random-user"} | ${testIDs.activationPage + "-token"}
    `("does not render $page at $path", ({ _, path, testId }) => {
      setup(path);

      const homePageEl = screen.queryByTestId(testId);

      expect(homePageEl).not.toBeInTheDocument();
    });

    it.each`
      targetPage      | path         | name        | testId
      ${"HomePage"}   | ${"/signup"} | ${"Home"}   | ${testIDs.homePage}
      ${"SignUpPage"} | ${"/"}       | ${"SignUp"} | ${testIDs.signUpPage}
      ${"LoginPage"}  | ${"/signup"} | ${"Login"}  | ${testIDs.loginPage}
    `(
      "leads to $targetPage upon clicking navLink $name",
      ({ _, path, name, testId }) => {
        setup(path);

        const linkEl = screen.getByRole("link", { name });

        userEvent.click(linkEl);

        const targetPageEl = screen.queryByTestId(testId);

        expect(targetPageEl).toBeInTheDocument();
      }
    );
  });
});
