import { render, screen } from "../test-utils";
import { RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import testIDs from "../test-ids.json";

import { setupServer } from "msw/node";
import { rest } from "msw";
import { memoryRouter } from "../routers";

import storage from "../state/storage";

let logoutCount = 0;
let header;

const server = setupServer(
  rest.post("/api/1.0/users/token/:token", async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/api/1.0/users", async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          { id: 11, username: "Marcel", email: "marcel@test.com", image: null },
          {
            id: 12,
            username: "Assunta",
            email: "assunta@test.com",
            image: null,
          },
          { id: 13, username: "Trace", email: "trace@test.com", image: null },
        ],
      })
    );
  }),
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    header = req.headers.get("Authorization");
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: "user1",
        email: "user1@mail.com",
        image: null,
      })
    );
  }),
  rest.post("/api/1.0/auth", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 11, username: "Marcel" }));
  }),
  rest.post("/api/1.0/logout", (req, res, ctx) => {
    logoutCount += 1;
    return res(ctx.status(200));
  }),
  rest.delete("/api/1.0/users/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

const setup = (path) => {
  render(<RouterProvider router={memoryRouter(path)} />);
};

beforeAll(() => server.listen());

beforeEach(() => {
  logoutCount = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

describe("App", () => {
  describe("App routing", () => {
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
      async ({ targetPage, path, name, testId }) => {
        setup(path);

        const linkEl = await screen.findByRole("link", { name });

        userEvent.click(linkEl);

        const targetPageEl = await screen.findByTestId(testId);

        expect(targetPageEl).toBeInTheDocument();
      }
    );

    it("checks if click on user leads to the user page", async () => {
      setup("/");

      const userNode = await screen.findByTestId(/Marcel-11/i);

      userEvent.click(userNode);

      const userPageNode = await screen.findByTestId(`${testIDs.userPage}-11`);

      expect(userPageNode).toBeInTheDocument();
    });
  });

  describe("Login", () => {
    const setupLoggedIn = () => {
      const emailInputEl = screen.getByLabelText(/email/i);
      const passwordInputEl = screen.getByLabelText("Password", {
        exact: true,
      });

      userEvent.type(emailInputEl, "test@test.com");
      userEvent.type(passwordInputEl, "aA1234");
    };

    it("redirects to homepage after successful login", async () => {
      setup("/login");
      setupLoggedIn();

      const loginBtnEl = screen.getByRole("button", { name: /login/i });
      userEvent.click(loginBtnEl);

      const pageEl = await screen.findByTestId(testIDs.homePage);

      expect(pageEl).toBeInTheDocument();
    });

    it("hides sign-up and login from header after successful login", async () => {
      setup("/login");

      const loginLinkNode = await screen.findByTitle(/login/i);
      const signUpLinkNode = await screen.findByTitle(/signup/i);

      setupLoggedIn();

      const loginBtnEl = screen.getByRole("button", { name: /login/i });
      userEvent.click(loginBtnEl);

      await screen.findByTestId(testIDs.homePage);

      expect(loginLinkNode).not.toBeInTheDocument();
      expect(signUpLinkNode).not.toBeInTheDocument();
    });

    it("renders user page upon clicking My Profile", async () => {
      setup("/login");

      const loginLinkNode = await screen.findByTitle(/login/i);
      const signUpLinkNode = await screen.findByTitle(/signup/i);

      setupLoggedIn();

      const loginBtnEl = screen.getByRole("button", { name: /login/i });
      userEvent.click(loginBtnEl);

      await screen.findByTestId(testIDs.homePage);

      expect(loginLinkNode).not.toBeInTheDocument();
      expect(signUpLinkNode).not.toBeInTheDocument();

      const myProfileLinkNode = screen.queryByTitle(/my profile/i);

      userEvent.click(myProfileLinkNode);

      const username = await screen.findByText("user1");

      expect(username).toBeInTheDocument();
    });

    it("stores logged-in data in locale storage", async () => {
      setup("/login");
      setupLoggedIn();

      const loginBtnEl = screen.getByRole("button", { name: /login/i });
      userEvent.click(loginBtnEl);

      await screen.findByTestId(testIDs.homePage);

      const loggedInDataInLS = storage.getItem("auth");

      expect(loggedInDataInLS.isLoggedIn).toBeTruthy();
    });

    it("renders logged-in state layout after page refresh", () => {
      storage.setItem("auth", { isLoggedIn: true });
      setup("/");

      const myProfileLinkNode = screen.queryByTitle(/my profile/i);

      expect(myProfileLinkNode).toBeInTheDocument();
    });
  });

  describe("Logout", () => {
    let logoutLink;

    const setupLoggedIn = () => {
      storage.setItem("auth", {
        isLoggedIn: true,
        id: 5,
        username: "user5",
        header: "auth-token",
      });
      setup("/");

      logoutLink = screen.queryByRole("link", { name: /logout/i });
    };
    it("renders logout ling upon successful login", () => {
      setupLoggedIn();

      expect(logoutLink).toBeInTheDocument();
    });

    it("renders login and sign-up upon clicking logout link", async () => {
      setupLoggedIn();

      userEvent.click(logoutLink);

      const loginLink = await screen.findByRole("link", { name: /login/i });

      expect(loginLink).toBeInTheDocument();
    });

    it("sends logout api call after clicking logout", async () => {
      setupLoggedIn();
      userEvent.click(logoutLink);

      await screen.findByRole("link", { name: /login/i });

      expect(logoutCount).toBe(1);
    });

    it("removes authorization header from api calls upon user logout", async () => {
      setupLoggedIn();
      userEvent.click(logoutLink);

      await screen.findByRole("link", { name: /login/i });

      const user = await screen.findAllByText(/Marcel/i, { exact: true });

      userEvent.click(user[0]);

      await screen.findByRole("heading", { name: /user1/i });

      expect(header).toBeFalsy();
    });
  });

  describe("Delete User", () => {
    let deleteMyAccountBtn;

    const setupLoggedInUserPage = async () => {
      storage.setItem("auth", {
        isLoggedIn: true,
        header: "auth-token",
        id: 1,
        username: "user1",
      });

      setup("/user/5");

      deleteMyAccountBtn = await screen.findByRole("button", {
        name: /delete my account/i,
      });
    };

    it("redirects to homepage upon deleting user", async () => {
      await setupLoggedInUserPage();

      userEvent.click(deleteMyAccountBtn);
      userEvent.click(screen.queryByRole("button", { name: /yes/i }));

      await screen.findByTestId(testIDs.homePage);
    });

    it("renders login and sign-up btns upon deleting user", async () => {
      await setupLoggedInUserPage();

      userEvent.click(deleteMyAccountBtn);
      userEvent.click(screen.queryByRole("button", { name: /yes/i }));

      await screen.findByTitle(/login/i);
    });
  });
});

console.error = () => {};
