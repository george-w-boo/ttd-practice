import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, Route } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

import UserPage from "./UserPage";
import { memoryRouter, ErrorBoundary } from "../routers";

const server = setupServer();

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
            index
            path={`/user/${userId}`}
            element={<UserPage />}
            errorElement={<ErrorBoundary />}
          />
        )}
      />
    );
  };

  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        console.log("req", req);
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            username: "user1",
            email: "user1@mail.com",
            image: null,
          })
        );
      })
    );
  });

  it("renders user name on page when user is found", async () => {
    setup("1");

    await waitFor(() => {
      expect(screen.getByText(/user1/i)).toBeInTheDocument();
    });
  });
});
