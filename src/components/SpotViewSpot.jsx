import React, { useEffect, useState } from "react";
import {
  findNode,
  mountFullPath,
  getGroupChildren,
  timeText,
} from "../utilities";
import useStatusColor from "../hooks/SpotManagement/useStatusColor";
import alarmAudio from "../assets/audio/alarme.mp3";

function SpotViewSpot({
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
  const [percent, setPercent] = useState(-3);
  const [time, setTime] = useState(0);
  const [currentSpotColor, setCurrentSpotColor] = useState(null);
  const [alarming, setAlarming] = useState(false);

  const colorsToUse = {
    red: "#FE5C66",
    yellow: "#FFE032",
    green: "#5CD160",
    gray: "#737373",
  };

  const finalColor = useStatusColor(
    alarm,
    [data],
    colorsToUse,
    color,
    "spots",
    showPendents,
    {
      setPercent,
      setTime,
    }
  );

  const handleClickSpot = async (tree_id) => {
    const { node } = findNode(tree, tree_id);
    sessionStorage.setItem(
      "whichClicked",
      JSON.stringify({
        tree_id: node.tree_id,
      })
    );
    setNode(node);
    setPath(mountFullPath(tree, tree_id, false));
    setChildren(getGroupChildren(node));
    close(false);
    setWhichClicked({
      tree_id: node.tree_id,
    });
    setSpotPage("diagnostic");
  };

  useEffect(() => {
    const audio = new Audio(alarmAudio);
    audio.pause();
    setAlarming(false);
    if (
      alarmSound &&
      (finalColor.name === red ||
        finalColor.name === yellow ||
        finalColor.name === green ||
        finalColor.name === gray)
    ) {
      if (
        ((currentSpotColor === "GRAY" || currentSpotColor === "GREEN") &&
          ["YELLOW", "RED"].includes(finalColor.name)) ||
        (currentSpotColor === "YELLOW" && finalColor.name === "RED")
      ) {
        let count = 0;

        audio.addEventListener("ended", () => {
          count++;

          if (count < 3) {
            setTimeout(() => {
              audio.play();
            }, 1000);
          } else {
            audio.pause();
            setAlarming(false);
          }
        });

        audio.play();
        setAlarming(true);
      } else {
        audio.pause();
        setAlarming(false);
      }
    } else {
      audio.pause();
      setAlarming(false);
    }

    setCurrentSpotColor(finalColor.name);

    return () => {
      audio.pause();
      setAlarming(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalColor.name, alarmSound, red, yellow, green, gray]);

  // useEffect(() => {
  //   if (title === "NG01878") {
  //     console.log("ALARMES", alarm);
  //     console.log("SPOT", [data]);

  //     console.log("COR FINAL", finalColor.name);
  //     console.log("COR NA ARVORE", color);
  //     console.log("======================");
  //   }
  // }, [finalColor.name, color, title, alarm, data]);

  return (
    <>
      {finalColor && (
        <div
          className={`svcaSpot ${
            alarming
              ? finalColor.name === "YELLOW"
                ? "alarmingSpotYellow"
                : "alarmingSpotRed"
              : ""
          }`}
          onClick={() => handleClickSpot(data.id + "_spot")}
          style={
            finalColor.name === red ||
            finalColor.name === yellow ||
            finalColor.name === green ||
            finalColor.name === gray
              ? {}
              : { display: "none" }
          }
        >
          <div
            className="svcasColor"
            style={{ backgroundColor: finalColor.hex }}
          />
          <div className="svcasText">
            <span className="svcasTitle">{title}</span>
            {percent >= 0 && finalColor.name !== "GREEN" ? (
              <div className="svcasStatus">
                {finalColor.name === "GRAY" ? (
                  <span className="svcasConditon">Sem conexão</span>
                ) : (
                  <span className="svcasConditon">Rompimento {percent}%</span>
                )}
                <span className="svcasTime">
                  {finalColor.name !== "GRAY"
                    ? color === finalColor.name
                      ? "em andamento"
                      : timeText(Math.floor(Date.now() / 1000) - time)
                    : ""}
                </span>
              </div>
            ) : (
              finalColor.name === color &&
              color === "GRAY" && (
                <div className="svcasStatus">
                  <span className="svcasConditon">
                    {data.connectionLabel === "OK"
                      ? "Alarmes desativados"
                      : "Sem conexão"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SpotViewSpot;
