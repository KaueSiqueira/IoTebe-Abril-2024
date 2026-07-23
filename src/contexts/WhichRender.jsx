import React, { createContext } from "react";

const WhichRenderContext = createContext();

function WhichRenderProvider({ children, value }) {
  return <WhichRenderContext.Provider value={value}>{children}</WhichRenderContext.Provider>;
}

export { WhichRenderContext, WhichRenderProvider };
