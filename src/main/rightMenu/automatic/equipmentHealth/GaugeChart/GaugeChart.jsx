import React from "react";
import GaugeComponent from "react-gauge-component";
import "./GaugeChart.css";

function GaugeChart({id="velocity", name, value, alarm, ticks }) {
  return (
    <div className="gauge-chart-container">
      <p className="gauge-chart-title">{name}</p>
      <GaugeComponent
        id={id}
        className="gauge-component"
        marginInPercent={{ top: 0.06, bottom: 0, left: 0.06, right: 0.06 }}
        value={value}
        maxValue={alarm.alert + alarm.critical > value? alarm.alert + alarm.critical : value}
        type="radial"
        labels={{
          valueLabel: {
            formatTextValue: (value) => value.toString().replace(".", ","),
            maxDecimalDigits: 1,
            style: {
              textShadow: "none",
              fill: "#072531",
              fontSize: "22px",
            },
          },
          tickLabels: {
            type: "inner",
            ticks: ticks,
            defaultTickValueConfig: {
              formatTextValue: (value) => value.toString().replace(".", ","),
              maxDecimalDigits: 1,
              style: {
                textShaddow: "none",
                fill: "#072531",
                fontSize: "12px",
              },
            },
            defaultTickLineConfig: {
              style: {
                textShaddow: "none",
                fill: "#072531",
                fontSize: "14px",
              },
            },
          },
        }}
        arc={{
          colorArray: ["#1CBF21", "#FFE032", "#FD0D1B"],
          subArcs: [{ limit: alarm.alert }, { limit: alarm.critical }, {}],
          padding: 0,
        }}
        pointer={{
          color: "#072531",
          baseColor: "#FFFFFF",
          length: 0.4,
          elastic: true,
          animationDelay: 0,
          width: 12,
        }}
      />
    </div>
  );
}

export default GaugeChart;
