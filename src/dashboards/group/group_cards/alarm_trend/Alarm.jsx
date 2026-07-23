import React from "react";

const CIRCLE_COLOR = {
  green: { backgroundColor: "rgba(28, 191, 33)" },
  yellow: { backgroundColor: "rgba(255, 224, 50)" },
  red: { backgroundColor: "rgba(253, 13, 27)" },
  gray: { backgroundColor: "rgba(156, 156, 156)" },
};

export default function Alarm({ number, color }) {
  return (
    <div className="column">
      <div className="row-center">
        <div className="align-right instTrend" style={CIRCLE_COLOR[color]}>
          <span className="center">{number}</span>
        </div>
      </div>
    </div>
  );
}
