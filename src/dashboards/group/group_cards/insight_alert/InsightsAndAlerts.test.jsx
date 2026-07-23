import React from "react";
import InsightsAndAlerts from "./InsightsAndAlerts";
import { DashgroupProvider, WhichRenderProvider } from "../../../../contexts";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";

global.MutationObserver = jest.fn(function (callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  this.takeRecords = jest.fn();
  this.callback = callback;
});

jest.mock("../../../../apis", () => {
  return {
    getGroupAlarmHistory: jest.fn().mockResolvedValue({
      data: [
        {
          path: "Usina Santa Lucia / Moenda B / Turbina",
          spot_name: "LA",
          spot_id: 1321,
          sensor_id: "NG00036",
          spot_status: "YELLOW",
          status_color: "YELLOW",
          diagnostic_status: "PENDING",
          last_alarmed_time: 1696441740,
          percent_above_alarm: 14,
        },
      ],
    }),
  };
});

jest.mock("../../../../contexts/DashgroupContext", () => {
  const createContext = require("react").createContext;

  let loadState = {
    isLoading: false,
    criticalLoading: false,
    insightsLoading: false,
    alarmTrendLoading: false,
  };

  const setLoad = jest.fn();

  return {
    __esModule: true,
    DashgroupContext: createContext({
      load: loadState,
      setLoad: setLoad,
      updateChildrenFunctionLoop: jest.fn(),
    }),
    DashgroupProvider: ({ children }) => {
      return <>{children}</>;
    },
  };
});

jest.mock("../../../../contexts/WhichRender", () => {
  const createContext = require("react").createContext;

  return {
    __esModule: true,
    WhichRenderContext: createContext({
      treeData: [{}],
      selectedNode: { id: 1 },
      selectedNodeChildren: [1],
    }),
    WhichRenderProvider: ({ children }) => {
      return <>{children}</>;
    },
  };
});

it("mudança de aba", async () => {
  await act(async () => {
    render(
      <WhichRenderProvider>
        <DashgroupProvider>
          <InsightsAndAlerts />
        </DashgroupProvider>
      </WhichRenderProvider>
    );
  });

  await waitFor(() => {
    screen.getByText("Pendentes");
  });

  const concludedButton = screen.getByText("Pendentes");

  await waitFor(() => {
    fireEvent.click(concludedButton);
  });

  var isActive = concludedButton.classList.contains("divider-screen-selected");

  var hasCards = !!screen.getByText("em andamento");

  expect(isActive).toBe(true);
  expect(hasCards).toBe(true);
});
