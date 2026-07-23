import React from "react";
import { colors } from "../utilities";

function Button({ onClick, className, buttonType, buttonRef, disabled, cancel, small, style, children, value, ...rest }) {

  return (
    <button
      onClick={onClick}
      ref={buttonRef}
      disabled={disabled}
      style={{
        ...style
      }}
      className={`${!!className && className} ${buttonType ? buttonType : ""}`}
      {...rest}
    >
      {children || value}
    </button>
  );
}

export default Button;
