import { render, screen } from "@testing-library/react";

import testIDs from "./test-ids.json";

import App from "./App";
import { MemoryRouter } from "react-router-dom";

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
      page            | path                   | testId
      ${"HomePage"}   | ${"/"}                 | ${testIDs.homePage}
      ${"SignUpPage"} | ${"/signup"}           | ${testIDs.signUpPage}
      ${"LoginPage"}  | ${"/login"}            | ${testIDs.loginPage}
      ${"UserPage"}   | ${"/user/random-user"} | ${testIDs.userPage + "-random-user"}
    `("renders $page at $path", ({ _, path, testId }) => {
      setup(path);

      const pageEl = screen.getByTestId(testId);

      expect(pageEl).toBeInTheDocument();
    });

    it.each`
      page           | path                   | testId
      ${"HomePage"}  | ${"/signup"}           | ${testIDs.homePage}
      ${"HomePage"}  | ${"/login"}            | ${testIDs.homePage}
      ${"HomePage"}  | ${"/user/random-user"} | ${testIDs.homePage}
      ${"SignPage"}  | ${"/"}                 | ${testIDs.signUpPage}
      ${"SignPage"}  | ${"/login"}            | ${testIDs.signUpPage}
      ${"SignPage"}  | ${"/user/random-user"} | ${testIDs.signUpPage}
      ${"LoginPage"} | ${"/"}                 | ${testIDs.loginPage}
      ${"LoginPage"} | ${"/signup"}           | ${testIDs.loginPage}
      ${"LoginPage"} | ${"/user/random-user"} | ${testIDs.loginPage}
      ${"UserPage"}  | ${"/"}                 | ${testIDs.userPage + "-random-user"}
      ${"UserPage"}  | ${"/signup"}           | ${testIDs.userPage + "-random-user"}
      ${"UserPage"}  | ${"/login"}            | ${testIDs.userPage + "-random-user"}
    `("does not render $page at $path", ({ _, path, testId }) => {
      setup(path);

      const homePageEl = screen.queryByTestId(testId);

      expect(homePageEl).not.toBeInTheDocument();
    });
  });
});
