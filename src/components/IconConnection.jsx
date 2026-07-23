import React from "react";
import { Tooltip } from "@material-ui/core";

function IconConnection(props) {
  return (
    <>
      <Tooltip title={props.tooltipTitle} placement="top" arrow>
        <props.icon
          style={{
            color: props.colorIcon,
            fontSize: 20,
            backgroundColor: "white",
          }}
        />
      </Tooltip>
      <div
        className="dashedLine"
        style={{
          color: props.colorIcon,
        }}
      />
    </>
  );
}

export default IconConnection;