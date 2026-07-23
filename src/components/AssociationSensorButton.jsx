import React from "react";
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { ProtectedFeature } from "./ProtectedFeature/ProtectedFeature";

const AssociationSensorButton = ({ onClick, conditional, text }) => {
  return (
    <>
      {conditional ? (
        <button className="elevated-button" onClick={onClick}>
          <RadioButtonChecked style={{ fontSize: 18 }} />
          {text}
        </button>
      ) : (
        <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
          <button className="elevated-button" onClick={onClick}>
            <RadioButtonUnchecked style={{ fontSize: 18 }} />
            Associar Sensor
          </button>
        </ProtectedFeature>
      )}
    </>
  );
};

export default AssociationSensorButton;
