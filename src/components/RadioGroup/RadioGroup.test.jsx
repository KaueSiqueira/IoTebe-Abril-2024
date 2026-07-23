import React from "react";
import { render } from "@testing-library/react";
import RadioGroup from "./RadioGroup";
import RadioInput from "./RadioInput/RadioInput";

test("Verifica se o componente renderiza corretamente um titulo", () => {
  const { container } = render(<RadioGroup title={"teste"} />);

  const hasTitle = container.querySelector(".radio-group-title");

  expect(!!hasTitle).toBe(true);
});

test("Verifica se o componente renderiza corretamente os filhos", () => {
  const { container } = render(
    <RadioGroup>
      <RadioInput />
    </RadioGroup>
  );

  const hasChildren = container.querySelector(".radio-group");

  expect(!!hasChildren).toBe(true);
});
