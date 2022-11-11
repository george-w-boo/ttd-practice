import { render, screen } from "@testing-library/react";
import { RouterProvider, Route } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { memoryRouter, ErrorBoundary } from "../routers";
import { loader as usersLoader } from "../pages/HomePage";
import UserList from "./UserList";

const page1 = {
  content: [
    {
      id: 1,
      username: "FakeUser1",
      email: "atuny0@sohu.com",
      image: "https://robohash.org/hicveldicta.png",
    },
    {
      id: 2,
      username: "FakeUser2",
      email: "hbingley1@plala.or.jp",
      image: "https://robohash.org/doloremquesintcorrupti.png",
    },
    {
      id: 3,
      username: "FakeUser3",
      email: "rshawe2@51.la",
      image: "https://robohash.org/consequunturautconsequatur.png",
    },
  ],
  page: 0,
  size: 10,
  totalPages: 3,
};

const server = setupServer(
  rest.get("/api/1.0/users", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(page1));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

describe("UserList", () => {
  const setup = () => {
    render(
      <RouterProvider
        router={memoryRouter(
          "/",
          <Route
            index
            path="/"
            loader={usersLoader}
            element={<UserList />}
            errorElement={<ErrorBoundary />}
          />
        )}
      />
    );
  };

  it("renders list items", async () => {
    setup();

    const listItemNodes = await screen.findAllByText(/fakeuser/i);

    expect(listItemNodes.length).toBe(3);
  });
});
