import React from "react";
import { GatewayList } from "../gateway/GatewayList";
import DashGroup from "../dashboards/group/DashGroup";
import DashSpot from "../dashboards/sensor/DashSpot";
import AccountSettings from "../features/AccountSettings";

function SelectedDashboard({ type, selectedTreePath }) {
  if (type === "SPOT") return <DashSpot selectedPath={selectedTreePath} />;
  if (type === "GROUP") return <DashGroup selectedPath={selectedTreePath} />;
  if (type === "EQUIPMENT") return <DashGroup selectedPath={selectedTreePath} />;
  if (type === "PLANT") return <DashGroup selectedPath={selectedTreePath} />;
  if (type === "SECTOR") return <DashGroup selectedPath={selectedTreePath} />;
  if (type === "gateway") return <GatewayList />;
  if (type === "account") return <AccountSettings />;
  return null;
}

export default SelectedDashboard;
