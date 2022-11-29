import { render, screen } from "@testing-library/react";
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
        <NavBar auth={{ isLoggedIn: false }} />
      </MemoryRouter>
    );

    const linkEl = screen.getByRole("link", { name });

    expect(linkEl).toBeInTheDocument();
  });
});
