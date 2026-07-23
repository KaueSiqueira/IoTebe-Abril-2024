import React, { useState } from "react";
import SpotViewSpot from "./SpotViewSpot";
import useStatusColor from "../hooks/SpotManagement/useStatusColor";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

function SpotViewCard({
  title,
  color,
  data,
  red,
  green,
  yellow,
  gray,
  close,
  setNode,
  setPath,
  tree,
  setChildren,
  alarm,
  setWhichClicked,
  setSpotPage,
  showPendents,
  alarmSound,
}) {
  const colorsToUse = {
    red: "#FFCED1",
    yellow: "#FFF3AD",
    green: "#A4E5A6",
    gray: "#E5E5E5",
  };

  const [isPlannedIntervention, setIsPlannedIntervention] = useState(false);
  const finalColor = useStatusColor(
    alarm,
    data,
    colorsToUse,
    color,
    "spots",
    showPendents,
    {
      setIsPlannedIntervention,
    }
  );

  return (
    <>
      {finalColor && (
        <div
          className="spotViewCard"
          style={{ backgroundColor: finalColor.hex }}
        >
          <div className="svcaTitle">
            <span>{title}</span>
          </div>
          <div className="svcaGroup">
            {data &&
              data.map(
                (card, index) =>
                  card.sensor_id !== null && (
                    <SpotViewSpot
                      key={card.title + index}
                      title={card.title}
                      color={card.alarmLabel}
                      data={card}
                      red={red}
                      yellow={yellow}
                      green={green}
                      gray={gray}
                      close={close}
                      setNode={setNode}
                      setPath={setPath}
                      tree={tree}
                      setChildren={setChildren}
                      alarm={alarm}
                      setWhichClicked={setWhichClicked}
                      setSpotPage={setSpotPage}
                      showPendents={showPendents}
                      alarmSound={alarmSound}
                    />
                  )
              )}
            {isPlannedIntervention && (
              <div
                className="diagnosticCardTag"
                style={{
                  fontSize: 13,
                  width: "fit-content",
                  marginTop: "10px",
                }}
              >
                <LocalOfferRoundedIcon />
                Intervenção planejada
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SpotViewCard;
