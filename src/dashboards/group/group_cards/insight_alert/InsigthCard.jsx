import React, { useEffect } from "react";
import { timeText } from "../../../../utilities";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

function InsightCard({ data, onClick }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    forceUpdate();
  }, [data, forceUpdate]);

  let splitPath = data?.path?.split(" / ");
  let lastPathItem = splitPath?.pop();
  let remainingPath = splitPath?.join(" / ");

  return (
    <div
      style={{
        backgroundColor: data.status_color === "RED" ? "#FFCED1" : "#FFF3AD",
        justifyContent: "space-between",
        borderLeft: `10px solid ${
          data.status_color === "RED" ? "#FE5C66" : "#FFE032"
        }`,
        alignItems: "stretch",
      }}
      className="insight_card row-center scale"
    >
      <div
        className="row-center insight_card_link ml-3 mr-3"
        onClick={() => {
          onClick(
            data.spot_id + "_spot",
            data.end_diagnostic_time ? "completed" : "pending",
            data.diagnostic_card_id
          );
        }}
        style={{justifyContent: "space-between",}}
      >
        <div className="insight_card_left" style={{maxWidth: window.innerWidth < 700 && "63%"}}>
          {remainingPath && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: "#000000",
                fontFamily: "Inter, sans-serif",
                width: window.innerWidth < 700 && "90%"
              }}
            >
              {remainingPath.toUpperCase()}
            </span>
          )}
          <div>
            <span
              style={{
                fontWeight: 500,
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                display: window.innerWidth < 700 && "flex"
              }}
            >
              {lastPathItem && lastPathItem + " / "}
              {data.spot_name}
            </span>
            <span
              style={{
                marginLeft: window.innerWidth > 700 && 14,
                fontSize: 13,
                fontWeight: 300,
                color: "#000000",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {data.sensor_id}
            </span>
          </div>
        </div>

        <div className="insight_card_right" style={{whiteSpace: window.innerWidth > 700 && "nowrap"}}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "#000000",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {data.spot_status !== data.status_color ||
            data.sensor_id === null ||
            data.end_diagnostic_time
              ? timeText(
                  Math.floor(Date.now() / 1000) -
                    (data.end_diagnostic_time || data.last_alarmed_time)
                )
              : "em andamento"}
          </p>
          {data.diagnostic_status === "PLANNED_INTERVENTION" && (
            <div
              className="diagnosticCardTag"
              style={{ fontSize: 13, cursor: "pointer" }}
            >
              <LocalOfferRoundedIcon />
              Intervenção planejada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
