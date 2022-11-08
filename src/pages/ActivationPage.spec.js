import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import ActivationPage from "./ActivationPage";

let counter = 0;

const server = setupServer(
  rest.post("/api/1.0/users/token/:token", async (req, res, ctx) => {
    console.log("counter", counter);
    counter += 1;
    console.log("res(ctx.status(200)", res(ctx.status(200)));
    if (req.params.token === "fakeToken") {
      // console.log("res(ctx.status(400)", res(ctx.status(400)));
      return res(ctx.status(400));
    }

    console.log("counter", counter);
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

  it("sends activation request after token has been changed", async () => {
    const { rerender } = render(<ActivationPage testToken="successToken" />);

    await screen.findByText("Account is activated");

    rerender(<ActivationPage testToken="fakeToken" />);

    await screen.findByText(/error/i);

    expect(counter).toBe(2);
  });
});
