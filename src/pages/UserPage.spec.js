import { render, screen } from "@testing-library/react";
import { RouterProvider, Route } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

import UserPage, { loader } from "./UserPage";
import { memoryRouter, ErrorBoundary } from "../routers";

const server = setupServer(
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: "FakeUser1",
        email: "user1@mail.com",
        image: null,
      })
    );
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

describe("UserPage", () => {
  const setup = (userId) => {
    render(
      <RouterProvider
        router={memoryRouter(
          `/user/${userId}`,
          <Route
            path={`/user/:userId`}
            element={<UserPage />}
            errorElement={<ErrorBoundary />}
            loader={loader}
          />
        )}
      />
    );
  };

  it("renders user name on page when user is found", async () => {
    setup("1");

    const userNode = await screen.findByText(/fakeuser1/i);

    expect(userNode).toBeInTheDocument();
  });
});
