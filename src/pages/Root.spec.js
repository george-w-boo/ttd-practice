import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import testIDs from "../test-ids.json";

import { setupServer } from "msw/node";
import { rest } from "msw";
import { memoryRouter } from "../routers";

const server = setupServer(
  rest.post("/api/1.0/users/token/:token", async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("https://dummyjson.com/users", async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          users: [
            { id: 11, firstName: "Marcel", age: 39 },
            { id: 12, firstName: "Assunta", age: 42 },
            { id: 13, firstName: "Trace", age: 26 },
          ],
        },
      })
    );
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

describe("App", () => {
  describe("App routing", () => {
    const setup = (path) => {
      render(<RouterProvider router={memoryRouter(path)} />);
    };

    it.each`
      page                | path                   | testId
      ${"HomePage"}       | ${"/"}                 | ${testIDs.homePage}
      ${"SignUpPage"}     | ${"/signup"}           | ${testIDs.signUpPage}
      ${"LoginPage"}      | ${"/login"}            | ${testIDs.loginPage}
      ${"UserPage"}       | ${"/user/random-user"} | ${testIDs.userPage + "-random-user"}
      ${"ActivationPage"} | ${"/activation/token"} | ${testIDs.activationPage + "-token"}
    `("renders $page at $path", async ({ _, path, testId }) => {
      setup(path);

      const pageEl = await screen.findByTestId(testId);

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
    `("does not render $page at $path", async ({ _, path, testId }) => {
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
      async ({ _, path, name, testId }) => {
        setup(path);

        const linkEl = await screen.findByRole("link", { name });

        userEvent.click(linkEl);

        const targetPageEl = await screen.findByTestId(testId);

        expect(targetPageEl).toBeInTheDocument();
      }
    );
  });
});
