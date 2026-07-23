import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("<Button />", () => {
  it("should rendered on screen, click call a function", () => {
    const fn = jest.fn();
    render(<Button value={"opa"} onClick={fn} />);
    const button = screen.getByRole("button", { name: /opa/gi });

    userEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
