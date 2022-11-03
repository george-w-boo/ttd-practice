import { render, screen } from "@testing-library/react";

import SignUpPage from "./SignUpPage";

test("renders learn react link", () => {
  render(<SignUpPage />);

  const headerEl = screen.getByRole("heading", { name: "Sign Up" });

  expect(headerEl).toBeInTheDocument();
});
