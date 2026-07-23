import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { WhichRenderContext, DashgroupContext } from "../../contexts";
import { plotGroupAlarmsTrend } from "../../apis";
import axios from "axios";

function chartData(alarmData) {
  return {
    labels: alarmData.dateLabels.map((date) => {
      const time = date.split("/");
      return new Date(time[2], time[1] - 1, time[0]).getTime();
    }),
    datasets: [
      {
        label: "Saudável",
        borderColor: "rgba(28, 191, 33)",
        backgroundColor: "rgba(28, 191, 33, 0.4)",
        data: alarmData.healthyData,
      },
      {
        label: "Alerta",
        borderColor: "rgba(255, 224, 50)",
        backgroundColor: "rgba(255, 224, 50, 0.4)",
        data: alarmData.alertData,
      },
      {
        label: "Crítico",
        borderColor: "rgba(253, 13, 27)",
        backgroundColor: "rgba(253, 13, 27, 0.4)",
        data: alarmData.criticalData,
      },
      {
        label: "Indisponíveis",
        borderColor: "rgba(156, 156, 156)",
        backgroundColor: "rgba(156, 156, 156, 0.4)",
        data: alarmData.undefinedData,
      },
    ],
  };
}

function plotChart(alarmsData) {
  return {
    type: "line",
    data: chartData(alarmsData),
    options: {
      animation: false,
      maintainAspectRatio: true,
      devicePixelRatio: 2,
      responsive: true,

      interaction: {
        mode: "index",
        axis: "x",
        intersect: false,
      },

      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",

            displayFormats: {
              day: "DD/MM",
            },

            tooltipFormat: "DD/MM/YYYY",
          },

          ticks: {
            source: "auto",
            maxRotation: 0,
            minRotation: 0,
          },
        },

        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "N° de pontos de coleta",
          },
        },
      },

      plugins: {
        legend: {
          align: "start",
          position: "bottom",
          fullSize: false,

          labels: {
            usePointStyle: true,
            font: { size: 10 },
          },

          onHover: ({ native }) => {
            native.target.style.cursor = "pointer";
          },

          onLeave: ({ native }) => {
            native.target.style.cursor = null;
          },
        },

        tooltip: {
          backgroundColor: "rgba(0,0,0,0.4)",
        },
      },
    },
  };
}

let trendChart;

export default function useAlarmsTrend() {
  const { selectedNodeChildren, selectedNode } = useContext(WhichRenderContext);
  const alarmTrend = useRef(null);
  const [cancelToken, setCancelToken] = useState();

  const { setLoad, updateChildrenFunctionLoop } = useContext(DashgroupContext);
  const [data, setData] = useState();
  const [error, setError] = useState(false);

  const generateSpotChunk = (spot_array) => {
    const itemsPerRequest = 15;
    let spot_chunk = [];

    if (spot_array.length > itemsPerRequest) {
      const numberOfRequests = Math.ceil(spot_array.length / itemsPerRequest);

      for (let i = 0; i < numberOfRequests; i++) {
        if (i === 0) {
          spot_chunk.push(spot_array.slice(0, itemsPerRequest));
        } else {
          spot_chunk.push(
            spot_array.slice(
              i * itemsPerRequest,
              i * itemsPerRequest + itemsPerRequest
            )
          );
        }
      }
    } else {
      spot_chunk[0] = spot_array;
    }
    return spot_chunk;
  };

  const plotGroupTrendAlarms = useCallback(
    async (spot_array, spot_group_id, source) => {
      const setLoading = (payload) => {
        setLoad({ type: "alarmTrend", payload });
      };

      setError(false);
      setLoading(true);

      const spot_chunk = generateSpotChunk(spot_array);
      try {
        const res = await Promise.all(
          spot_chunk.map((chunk) =>
            plotGroupAlarmsTrend(chunk, spot_group_id, source)
          )
        );
        let concat_data = undefined;
        for (let req of res) {
          if (concat_data === undefined) {
            concat_data = req.data;
          } else if (!!concat_data) {
            concat_data.alertData = concat_data.alertData.map(function (
              num,
              i
            ) {
              return num + req.data.alertData[i];
            });
            concat_data.criticalData = concat_data.criticalData.map(function (
              num,
              i
            ) {
              return num + req.data.criticalData[i];
            });
            concat_data.healthyData = concat_data.healthyData.map(function (
              num,
              i
            ) {
              return num + req.data.healthyData[i];
            });
            concat_data.undefinedData = concat_data.undefinedData.map(function (
              num,
              i
            ) {
              return num + req.data.undefinedData[i];
            });
          }
        }
        setData(concat_data);
        setLoading(false);
      } catch (error) {
        if (error.message !== "cancelado") {
          setError(error);
          setLoading(false);
        }
      }
    },
    [setLoad]
  );

  const loadDataAsync = async (spot_array, spot_group_id, source) => {
    plotGroupTrendAlarms(spot_array, spot_group_id, source);
  };

  const loadData = useCallback(
    async (spot_array, spot_group_id, source) => {
      plotGroupTrendAlarms(spot_array, spot_group_id, source);
    },
    [plotGroupTrendAlarms]
  );

  useEffect(() => {
    if (!!data) {
      !!trendChart && trendChart.destroy();
      let ctx;
      !!alarmTrend.current && (ctx = alarmTrend.current.getContext("2d"));
      trendChart = new Chart(ctx, plotChart(data));
    }
  }, [data]);

  useEffect(() => {
    !!cancelToken && cancelToken.cancel("cancelado");
    setCancelToken(axios.CancelToken.source());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeChildren]);

  useEffect(() => {
    if (!!cancelToken) {
      loadData(selectedNodeChildren, selectedNode.id, cancelToken);
      updateChildrenFunctionLoop({
        id: "alarmTrend",
        childFunction: () =>
          loadDataAsync(selectedNodeChildren, selectedNode.id, cancelToken),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelToken]);

  return {
    noData: !selectedNodeChildren[0],
    data,
    error,
    alarmTrend,
  };
}
