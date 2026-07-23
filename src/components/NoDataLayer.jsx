import React from "react";

function NoDataLayer({ noData = false, className, children }) {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }} className={className}>
      {!noData ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            // filter: noData ? "opacity(0%)" : "none",
          }}
        >
          {children}
        </div>
      ) : (
        <h5
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            fontWeight: 700,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            // display: noData ? "block" : "none",
          }}
        >
          NÃO HÁ DADOS
        </h5>
      )}
    </div>
  );
}

export function CardData({ className, title, font }) {
  return (
    <div className={`no_data ${className}`} style={{textAlign: "center"}}>
      <h5 style={font}>{title}</h5>
    </div>
  );
}

export default NoDataLayer;
