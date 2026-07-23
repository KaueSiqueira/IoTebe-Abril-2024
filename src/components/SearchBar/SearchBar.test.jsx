import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";
import { WhichRenderProvider } from "../../contexts/WhichRender";

// Mock do contexto WhichRenderContext
jest.mock("../../contexts/WhichRender", () => {
  const createContext = require("react").createContext;

  return {
    __esModule: true,
    WhichRenderContext: createContext({
      treeData: [{}],
    }),
    WhichRenderProvider: ({ children }) => {
      return <>{children}</>;
    },
  };
});

test("Verificar se a barra de pesquisada é ativada ao ser clicada", () => {
  const { container } = render(
    <WhichRenderProvider>
      <SearchBar />
    </WhichRenderProvider>
  );

  const searchBar = container.querySelector(".searchBar");

  // Simula um clique na barra de pesquisa
  fireEvent.click(searchBar);

  // Obtem o tamanho após o clique
  let isActive = searchBar.classList.contains("activeSearchBar");

  // Verifica se a barra de pesquisada foi ativada
  expect(isActive).toBe(true);
});
