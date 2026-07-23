import React from "react";
import { fireEvent, render } from "@testing-library/react";
import RadioGroup from "../RadioGroup";
import RadioInput from "./RadioInput";

test("Verifica se o input é checado", () => {
  const { container } = render(
    <RadioGroup>
      <RadioInput name={"teste"} id={"teste"} value={"teste"} />
    </RadioGroup>
  );

  const input = container.querySelector(".radio-label");

  fireEvent.click(input);

  const isChecked = container.querySelector(".checked");

  expect(!!isChecked).toBe(true);
});
