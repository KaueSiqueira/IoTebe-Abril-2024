import React from "react";

function Card({
  isVisible = true,
  chartDivRef,
  height,
  flex,
  minHeight,
  maxHeight,
  className,
  children,
  flexD,
  style,
}) {
  return (
    <div
      style={{
        padding: 5,
        height: height,
        flex: flex,
        minHeight: minHeight,
        maxHeight: maxHeight,
      }}
      className={className}
    >
      <div
        ref={chartDivRef}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          minHeight: minHeight || "100%",
          backgroundColor: "white",
          padding: 8,
          borderRadius: 10,
          flexDirection: flexD || "row",
          boxShadow: "1px 1px 5px 0px rgb(50 50 50 / 30%)",
          ...style,
        }}
        className={`card-chart ${isVisible ? "card-chart-visible" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export default Card;
