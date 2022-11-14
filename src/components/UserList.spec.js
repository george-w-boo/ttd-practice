import { render, screen } from "@testing-library/react";
import { RouterProvider, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { memoryRouter, ErrorBoundary } from "../routers";

import UserList from "./UserList";

const users = [
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
  {
    id: 4,
    username: "FakeUser4",
    email: "atuny0@sohu.com",
    image: "https://robohash.org/hicveldicta.png",
  },
  {
    id: 5,
    username: "FakeUser5",
    email: "hbingley1@plala.or.jp",
    image: "https://robohash.org/doloremquesintcorrupti.png",
  },
  {
    id: 6,
    username: "FakeUser6",
    email: "rshawe2@51.la",
    image: "https://robohash.org/consequunturautconsequatur.png",
  },
  {
    id: 7,
    username: "FakeUser7",
    email: "atuny0@sohu.com",
    image: "https://robohash.org/hicveldicta.png",
  },
  {
    id: 8,
    username: "FakeUser8",
    email: "hbingley1@plala.or.jp",
    image: "https://robohash.org/doloremquesintcorrupti.png",
  },
  {
    id: 9,
    username: "FakeUser9",
    email: "rshawe2@51.la",
    image: "https://robohash.org/consequunturautconsequatur.png",
  },
];

const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const server = setupServer(
  rest.get("/api/1.0/users", async (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get("page"));
    let size = Number.parseInt(req.url.searchParams.get("size"));

    if (Number.isNaN(page)) page = 0;
    if (Number.isNaN(size)) size = 5;

    return res(ctx.status(200), ctx.json(getPage(page, size)));
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

  it("renders next page after clicking link next", async () => {
    setup();

    await screen.findByText(/FakeUser1/i);
    const linkNextNode = screen.queryByText(/next >/i);

    userEvent.click(linkNextNode);

    const fakeUser4Node = await screen.findByText(/fakeuser4/i);

    expect(fakeUser4Node).toBeInTheDocument();
  });

  it("disables next btn at last page", async () => {
    setup();

    await screen.findByText(/FakeUser1/i);
    const linkNextNode = screen.queryByText(/next >/i);

    userEvent.click(linkNextNode);
    userEvent.click(linkNextNode);

    expect(linkNextNode).toBeDisabled();
  });

  it("initially btn previous is disabled", async () => {
    setup();

    await screen.findByText(/FakeUser1/i);
    const linkPrevNode = screen.queryByText(/< previous/i);

    expect(linkPrevNode).toBeDisabled();
  });

  it("checks if btn previosu works properly", async () => {
    setup();

    await screen.findByText(/FakeUser1/i);
    const linkNextNode = screen.queryByText(/next >/i);

    userEvent.click(linkNextNode);

    await screen.findByText(/FakeUser4/i);
    const linkPrevNode = screen.queryByText(/< previous/i);

    userEvent.click(linkPrevNode);

    const fakeUser1Node = await screen.findByText(/FakeUser1/i);

    expect(fakeUser1Node).toBeInTheDocument();
  });
});
