import React from "react";
import { Card } from "../../components";
import AlarmsTrend from "./group_cards/alarm_trend/AlarmsTrend";
import CriticalSpots from "./group_cards/critical_spots/CriticalSpots";
import InsightsAndAlerts from "./group_cards/insight_alert/InsightsAndAlerts";
import { DashgroupProvider } from "../../contexts";
import useGroupView from "../../hooks/GroupView/useGroupView";

export function GroupView() {
  const { load, setLoad, updateChildrenFunctionLoop } =
    useGroupView();

  return (
    <div id="SubContainer" style={{ overflow: "auto" }}>
      <div id="chartsContainer" style={{ height: "calc(100vh - 110px)" }}>
        <DashgroupProvider
          value={{ load, setLoad, updateChildrenFunctionLoop }}
        >
          <div className="row flexible-column">
            <div
              className="col-12 col-lg-6 order-1"
              style={{ padding: 0, height: "100%" }}
            >
              <div className="row" style={{ height: "100%" }}>
                <Card className="col-12" height="50%" minHeight="230px">
                  <AlarmsTrend />
                </Card>
                <CriticalSpots />
              </div>
            </div>

            <div
              className="col-12 col-lg-6 order-2"
              style={{ padding: 0, height: "100%" }}
            >
              <div className="row" style={{ height: "100%" }}>
                <Card
                  className="col-12 insights-and-alerts"
                  height="100%"
                  minHeight="460px"
                >
                  <InsightsAndAlerts />
                </Card>
              </div>
            </div>
          </div>
        </DashgroupProvider>
      </div>
    </div>
  );
}
