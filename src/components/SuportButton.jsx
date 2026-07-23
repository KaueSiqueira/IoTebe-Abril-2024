import React from "react";
import { ContactSupport } from "@mui/icons-material";

function SuportButton(props) {
  function handleClick() {
    const phoneNumber = props.phoneNumber;
    const message = props.message;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  }

  return (
    <button
      style={{
        padding: 0,
        background: "none",
        border: "none",
        display: "flex",
      }}
      onClick={handleClick}
    >
      <ContactSupport style={{ color: "rgb(21, 98, 132)", fontSize: 25 }} />
    </button>
  );
}

export default SuportButton;
