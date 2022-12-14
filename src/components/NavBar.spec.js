import { render, screen } from "../test-utils";
import { MemoryRouter } from "react-router-dom";

import NavBar from "./NavBar";

describe("NavBar", () => {
  it.each`
    page            | name
    ${"HomePage"}   | ${"Home"}
    ${"SignUpPage"} | ${"SignUp"}
    ${"LoginPage"}  | ${"Login"}
  `("renders link to $page", ({ _, name }) => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const linkEl = screen.getByRole("link", { name });

    expect(linkEl).toBeInTheDocument();
  });
});
