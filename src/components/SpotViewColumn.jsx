import React, { useEffect } from "react";
import SpotViewCard from "./SpotViewCard";
import useStatusColor from "../hooks/SpotManagement/useStatusColor";
import { getFlatDataFromTree } from "react-sortable-tree";

function SpotViewColumn({
  title,
  color,
  data,
  red,
  green,
  yellow,
  gray,
  alarm,
  close,
  setNode,
  setPath,
  tree,
  setChildren,
  handleColumnWidthChange,
  setWhichClicked,
  setSpotPage,
  showPendents,
  alarmSound,
}) {
  const flatPlant = getFlatDataFromTree({
    treeData: data,
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
  });

  const colorsToUse = {
    red: "#FE5C66",
    yellow: "#FFE032",
    green: "#5CD160",
    gray: "#737373",
  };

  const finalColor = useStatusColor(
    alarm,
    flatPlant,
    colorsToUse,
    color,
    "all",
    showPendents
  );

  useEffect(() => {
    handleColumnWidthChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {finalColor && (
        <div className="spotViewColumn">
          <div className="svcTitle">
            <span>{title}</span>
            <span
              className="svcDotStatus"
              style={{ backgroundColor: finalColor.hex }}
            ></span>
          </div>
          <div className="svcCards">
            {data
              ? data.map((group, key) =>
                  group.type === "GROUP" ? (
                    group.children?.map((equipment, subIdx) => {
                      return (
                        <SpotViewCard
                          key={
                            data[key].title + " / " + equipment.title + subIdx
                          }
                          title={data[key].title + " / " + equipment.title}
                          color={equipment.alarmLabel}
                          data={equipment.children}
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
                      );
                    })
                  ) : group.type === "SECTOR" ? (
                    ""
                  ) : (
                    <SpotViewCard
                      key={data[key].title + key}
                      title={data[key].title}
                      color={group.alarmLabel}
                      data={group.type === "SPOT" ? [group] : group.children}
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
                )
              : ""}
          </div>
        </div>
      )}
    </>
  );
}

export default SpotViewColumn;
