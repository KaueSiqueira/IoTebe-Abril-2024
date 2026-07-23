import React from "react";
import { ContactSupport } from "@mui/icons-material";
import FeedbackToast from "./FeedbackToast/FeedbackToast";

function SuportButton(props) {
  function handleClick() {
    // modo demonstração — não expõe canais de suporte reais (WhatsApp)
    FeedbackToast.info("Suporte indisponível no modo demonstração.");
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
