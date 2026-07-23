import React from "react";
import AutomaticDiagnostic from "./automatic/AutomaticDiagnostic.jsx";
import Summary from "../../dashboards/sensor/Summary.jsx";
import DiagnosticMenu from "../../dashboards/sensor/diagnostic/DiagnosticMenu";
import useRightMenu from "../../hooks/RightMenu/RightMenu.jsx";

export default function RightMenu() {
  const { sidemenuContext, spotId, sensorVersion } = useRightMenu();

  return (
    <div
      className="col-lg-3"
      id="rightSideMenu"
      style={{
        width: "100%",
        height: "100%",
        padding: "0px",
        display: !!sidemenuContext ? "block" : "none",
      }}
    >
      {sidemenuContext === "train" && <AutomaticDiagnostic />}
      {sidemenuContext === "summary" && <Summary spotId={spotId} sensorVersion={sensorVersion} />}
      {sidemenuContext === "diagnostic" && window.innerWidth > 700 && (
        <DiagnosticMenu />
      )}
    </div>
  );
}
