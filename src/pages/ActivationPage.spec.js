import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import ActivationPage from "./ActivationPage";

let counter = 0;

const server = setupServer(
  rest.post("/api/1.0/users/token/:token", async (req, res, ctx) => {
    if (req.params.token === "fakeToken") {
      return res(ctx.status(400));
    }

    counter += 1;

    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

describe("ActivationPage", () => {
  const setup = (token) => {
    render(
      <MemoryRouter initialEntries={[`/activation/${token}`]}>
        <Routes>
          <Route path="/activation/:token" element={<ActivationPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders activation success alert if token is valid", async () => {
    setup("successToken");

    const alertEl = await screen.findByText("Account is activated");

    expect(alertEl).toBeInTheDocument();
  });

  it("sends activation request to the server", async () => {
    setup("successToken");

    await screen.findByText("Account is activated");

    expect(counter).toBe(1);
  });

  it("renders failure alert if token is invalid", async () => {
    setup("fakeToken");

    const alertEl = await screen.findByText("Error", { exact: false });

    expect(alertEl).toBeInTheDocument();
  });
});
