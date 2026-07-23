import { Tooltip } from "@material-ui/core";
import React from "react";
import { mountFullPath, getCurrentTreeIndex } from "../../../../utilities";

function RankSpot({ node, index, data, onClick }) {
  const { criticalPercentage, alertPercentage, healthyPercentage, undefinedPercentage, spot_id } = data;
  const currentTreeIndex = getCurrentTreeIndex(node, spot_id);

  return (
    <>
      <div className="rowCritic">
        <span className="textSize-24">{`${index + 1}º`}</span>
        <div className="width-90p">
          <div className="width-100p height-24 row-center">
            <Tooltip title={`Crítico: ${criticalPercentage}%`} placement="top" arrow>
              <span className="height-100p fullRed" style={{ width: `${criticalPercentage}%` }} />
            </Tooltip>
            <Tooltip title={`Em Alerta: ${alertPercentage}%`} placement="top" arrow>
              <span className="height-100p fullYellow" style={{ width: `${alertPercentage}%` }} />
            </Tooltip>
            <Tooltip title={`Saudável: ${healthyPercentage}%`} placement="top" arrow>
              <span className="height-100p fullGreen" style={{ width: `${healthyPercentage}%` }} />
            </Tooltip>
            <Tooltip title={`Indefinido: ${undefinedPercentage}%`} placement="top" arrow>
              <span className="height-100p fullGray" style={{ width: `${undefinedPercentage}%` }} />
            </Tooltip>
          </div>
          <span onClick={() => onClick(spot_id, currentTreeIndex)} className="textSize-14 pointer">
            {mountFullPath([node], spot_id+"_spot")}
          </span>
        </div>
      </div>
      <hr />
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.data.spot_id === nextProps.data.spot_id &&
    prevProps.data.healthyPercentage === nextProps.data.healthyPercentage &&
    prevProps.data.alertPercentage === nextProps.data.alertPercentage &&
    prevProps.data.undefinedPercentage === nextProps.data.criticalPercentage
  );
}

export default React.memo(RankSpot, areEqual);
