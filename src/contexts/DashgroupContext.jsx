import React, { createContext } from "react";

const DashgroupContext = createContext();

function DashgroupProvider({ value, children }) {
  return <DashgroupContext.Provider value={value}>{children}</DashgroupContext.Provider>;
}

export { DashgroupContext, DashgroupProvider };
