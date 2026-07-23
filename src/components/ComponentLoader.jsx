import React from "react";
import { concatClassName } from "../utilities";

const ComponentLoader = ({ customStyle, className }) => {
  return (
    <div
      className={concatClassName("parent-loader", className)}
      style={customStyle}
    >
      <div className="loader"></div>
    </div>
  );
};

export default ComponentLoader;
