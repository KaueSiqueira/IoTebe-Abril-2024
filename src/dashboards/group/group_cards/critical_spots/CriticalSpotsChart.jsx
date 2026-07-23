import React from "react";
import { Doughnut } from "react-chartjs-2";

const CriticalSpotsChart = ({ totalSpots, yellowCards, redCards, load }) => {
  const healthySpots = totalSpots - yellowCards - redCards;
  const healthySpotsPercent =
    totalSpots > 0 ? Math.round((healthySpots / totalSpots) * 100) : 0;

  const data = {
    datasets: [
      {
        data: !load.criticalLoading
          ? [healthySpots, yellowCards, redCards]
          : [],
        backgroundColor: ["#1CBF21", "#FFE032", "#FD0D1B"],
        rotation: 90,
        borderWidth: 0,
        cutout: "65%",
        animation: {
          animateRotate: false,
          animateScale: false,
        },
      },
    ],
    labels: ["Saudável", "Alerta", "Crítico"],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="critical-spots-chart-container">
      <div className="critical-spots-chart">
        <Doughnut data={data} options={config.options} />
        <span className="critical-spots-healthy-percentage">
          {!load.criticalLoading ? (
            <>
              {healthySpotsPercent}%<br />
              Saudável
            </>
          ) : (
            "Carregando..."
          )}
        </span>
      </div>
    </div>
  );
};

export default CriticalSpotsChart;
