import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { RightSideMenuContext } from "../../../contexts";
import { makeCsv } from "../../../utilities";
import { colors } from "../../../utilities";
import { plotAutomaticChart } from "../../../apis";

import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";

const typeColorOff = {
  ANOMALY: "#FFF7CC",
  NOT_ANOMALY: "#D6F0EC",
  WAITING_FEEDBACK: "#FFF7CC",
  UNKNOWN: "#C4C4C4",
};
const typeColorOn = {
  ANOMALY: "#FFEB80",
  NOT_ANOMALY: "#9EDCD2",
  WAITING_FEEDBACK: "#FFEB80",
  UNKNOWN: "#9D9D9D",
};

export default function useAutomaticChart(props) {
  const [noData, setNoData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [size, setSize] = useState("82vh");
  const [loading, setLoading] = useState(true);
  const [yAxisMin, setyAxisMin] = useState(false);
  const [yAxisMax, setyAxisMax] = useState(false);

  const [classChart, setClassChart] = useState("crosshair");
  const [myChart, setMyChart] = useState();

  const [chartDataBackup, setChartDataBackup] = useState();
  const [chartCSV, setChartCSV] = useState({ headers: [], data: [] });
  const [annotations, setAnnotations] = useState({});
  const [chartName, setChartName] = useState(" ");

  const {
    addAnomObserver,
    addTabObserver,
    trainingPeriod,
    limit,
    setValidLimit,
    setPeriodOnList,
    periodOnList,
    setLoadingAutomatic,
    setVelocityAverage,
    setAccelerationAverage,
  } = useContext(RightSideMenuContext);

  const panButton = useRef(null);
  const fullScreenButton = useRef(null);

  const onEnterPress = (target) => {
    target.charCode === 13 && saveLimits();
  };

  const loadData = useCallback(async (dateRange) => {
    setNoData(false);
    setLoading(true);
    setLoadingAutomatic(true);

    try {
      const res = await plotAutomaticChart(
        props.spotId,
        props.metricId,
        dateRange
      );
      setChartName(res.data.chart_name);
      const unit = res.data.unit === "celsius" ? "°C" : res.data.unit;

      const chartData = {
        datasets: res.data.data.map((axisData) => {
          axisData.data.sort((a, b) => (a.x > b.x ? 1 : -1));

          return {
            label:
              axisData.axis === "TEMPERATURE"
                ? "Temperatura"
                : axisData.axis === "VERTICAL"
                ? "Vertical"
                : axisData.axis === "HORIZONTAL"
                ? "Horizontal"
                : axisData.axis === "AXIAL"
                ? "Axial"
                : "Eixo",
            fill: true,
            backgroundColor:
              axisData.axis === "VERTICAL"
                ? colors.vRmsBackground
                : axisData.axis === "HORIZONTAL"
                ? colors.hRmsBackground
                : axisData.axis === "AXIAL"
                ? colors.aRmsBackground
                : colors.tempBackground,
            borderColor:
              axisData.axis === "VERTICAL"
                ? colors.vRmsIndicator
                : axisData.axis === "HORIZONTAL"
                ? colors.hRmsIndicator
                : axisData.axis === "AXIAL"
                ? colors.aRmsIndicator
                : colors.tempIndicator,
            data: axisData.data,
            pointRadius: 0,
            borderWidth: 0.5,
          };
        }),
      };

      chartData.datasets.reverse();

      setChartCSV(makeCsv(chartData));
      setChartDataBackup(chartData);
      await plotChartGraph(chartData, unit);
    } catch (error) {
      console.log(error);
      setNoData(true);
    } finally {
      setLoading(false);
      setLoadingAutomatic(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function plotChartGraph(chartData, unit) {
    var ctx = document.getElementById(props.id);
    setLoading(true);
    setLoadingAutomatic(true);

    !!ctx && (ctx = ctx.getContext("2d"));

    if (!!ctx) {
      let myChartCreated = new Chart(ctx, {
        type: "line",
        data: chartData,
        plugins: [
          CrosshairPlugin,
          {
            beforeInit: (chart) => {
              chart.options.plugins.zoom.pan.enabled = false;
            },
          },
        ],

        options: {
          spanGaps: true,
          animation: false,
          parsing: false,
          maintainAspectRatio: false,
          responsive: true,

          interaction: {
            mode: "index",
            axis: "xy",
            intersect: false,
          },

          onClick: undefined,

          scales: {
            x: {
              type: "time",
              alignToPixels: true,
              min: props.dateRange.startDate,
              max: props.dateRange.endDate,

              time: {
                unit: props.dateType,

                displayFormats: {
                  day: "DD/MM",
                  hour: "HH:mm",
                },

                tooltipFormat: "DD/MM/YYYY HH:mm",
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
                text: unit + (unit === "°C" ? "" : " - rms"),
              },
            },
          },

          plugins: {
            legend: {
              align: "end",
              position: "bottom",

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
              enabled: true,
              backgroundColor: "rgba(0,0,0,0.4)",

              callbacks: {
                label: ({ raw: { y }, dataset: { label } }) =>
                  `${label} = ${y.toFixed(3)} ${unit}`,
              },
            },

            zoom: {
              zoom: {
                mode: "x",

                drag: {
                  enabled: true,
                  backgroundColor: "rgba(21, 98, 132, 0.3)",
                  borderColor: "rgba(21, 98, 132, 0.5)",
                  borderWidth: 0.5,
                },

                onZoomComplete: ({
                  chart,
                  chart: {
                    scales: {
                      x: scalesX,
                      y: { max: maxY },
                    },
                  },
                }) => {
                  chart.options.scales.y.max = parseFloat(maxY);
                  const xDiff = new Date(Math.floor(scalesX.max - scalesX.min));
                  if (
                    xDiff.getFullYear() === 1970 &&
                    xDiff.getMonth() + 1 === 1 &&
                    xDiff.getDate() <= 1
                  ) {
                    chart.options.scales.x.time.unit = "hour";
                  }
                  chart.update();
                },

                onZoomStart: (e) =>
                  e.point.x > e.chart.chartArea.left &&
                  e.point.x < e.chart.chartArea.right &&
                  e.point.y > e.chart.chartArea.top &&
                  e.point.y < e.chart.chartArea.bottom,
              },

              pan: {
                enabled: true,
                mode: "x",
                onPanStart: (e) =>
                  e.point.x > e.chart.chartArea.left &&
                  e.point.x < e.chart.chartArea.right &&
                  e.point.y > e.chart.chartArea.top &&
                  e.point.y < e.chart.chartArea.bottom,
              },

              limits: {
                x: {
                  min: props.dateRange.startDate,
                  max: props.dateRange.endDate,
                },
              },
            },

            crosshair: {
              line: {
                color: "red",
                width: 0.5,
              },

              zoom: { enabled: false },

              sync: {
                enabled: false,
              },
            },

            decimation: {
              enabled: true,
              algorithm: "lttb",
              threshold: 500,
            },

            annotation: {
              annotations,
            },
          },
        },
      });
      setMyChart(myChartCreated);
    }
  }

  function toggleResetMode() {
    myChart.resetZoom();
    myChart.options.scales.x.time.unit = props.dateType;
    myChart.options.scales.y.max = undefined;
    myChart.options.scales.x.max = props.dateRange.endDate;
    myChart.options.scales.x.min = props.dateRange.startDate;
    myChart.update();
  }

  function togglePanMode() {
    panButton.current.classList.toggle("selected-chart-button");
    const panEnabled = myChart.options.plugins.zoom.pan.enabled;
    const zoomEnabled = myChart.options.plugins.zoom.zoom.drag.enabled;
    myChart.options.plugins.zoom.pan.enabled = !panEnabled;
    myChart.options.plugins.zoom.zoom.drag.enabled = !zoomEnabled;

    panEnabled ? setClassChart("crosshair") : setClassChart("grab");

    myChart.update();
  }

  function toggleFullScreen() {
    fullScreenButton.current.classList.toggle("selected-chart-button");
    setSize((prev) => (prev === "28vh" ? "82vh" : "28vh"));
  }

  function toggleModal() {
    setyAxisMin(myChart.scales.y.min);
    setyAxisMax(myChart.scales.y.max);
    setIsModalVisible(!isModalVisible);
  }

  function saveLimits() {
    myChart.zoomScale("y", { min: yAxisMin, max: yAxisMax }, "zoom");

    myChart.update();
    toggleModal();
  }

  function handleMetricAverage(value) {
    if (props.metricId === 1) {
      setVelocityAverage(value);
    } else {
      setAccelerationAverage(value);
    }
  }

  function getMetricAverage(periodOnList) {
    let axisSum1 = 0;
    let axisSum2 = 0;
    let axisSum3 = 0;

    let axisDivisor1 = 0;
    let axisDivisor2 = 0;
    let axisDivisor3 = 0;

    periodOnList.forEach((period) => {
      period.values.forEach((value) => {
        axisSum1 += value[0];
        axisSum2 += value[1];
        axisSum3 += value[2];

        axisDivisor1 += 1;
        axisDivisor2 += 1;
        axisDivisor3 += 1;
      });
    });

    let axisAverage1 = axisSum1 / axisDivisor1;
    let axisAverage2 = axisSum2 / axisDivisor2;
    let axisAverage3 = axisSum3 / axisDivisor3;

    return Math.max(axisAverage1, axisAverage2, axisAverage3);
  }

  useEffect(() => {
    if (
      props.onOffMetric &&
      chartDataBackup?.datasets?.length > 0 &&
      trainingPeriod &&
      limit !== null
    ) {
      if (limit > 0) {
        let trainingData = {};

        chartDataBackup.datasets.forEach((axis) => {
          let data =
            axis?._data?.length > axis.data.length ? axis._data : axis.data;
          data.forEach((dataItem) => {
            if (!trainingData[dataItem.x]) {
              trainingData[dataItem.x] = { timestamp: dataItem.x, values: [] };
            }
            trainingData[dataItem.x].values.push(dataItem.y);
          });
        });

        trainingData = Object.values(trainingData).filter(
          (data) =>
            data.timestamp >= trainingPeriod.startDate &&
            data.timestamp <= trainingPeriod.endDate
        );

        trainingData.sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0
        );

        let timeList = [];
        let valuesList = [];
        let addSel = null;
        let periodOnList = [];

        trainingData.forEach((data) => {
          let maxValue = Math.max(...data.values);

          if (maxValue > limit) {
            addSel = true;
            timeList.push(data.timestamp);
            valuesList.push(data.values);
          } else {
            if (addSel) {
              periodOnList.push({
                startTime: timeList[0],
                endTime: timeList[timeList.length - 1],
                values: [...valuesList],
              });
              timeList = [];
              valuesList = [];
              addSel = false;
            }
          }
        });

        if (timeList.length > 0) {
          periodOnList.push({
            startTime: timeList[0],
            endTime: timeList[timeList.length - 1],
            values: [...valuesList],
          });
        }

        let totalOnTime = 0;

        periodOnList.forEach((period) => {
          let difference = (period["endTime"] - period["startTime"]) / 3600000;
          totalOnTime += difference;
        });

        if (totalOnTime < 1) {
          setValidLimit(false);
          setPeriodOnList([]);
          handleMetricAverage(0);
        } else {
          setValidLimit(true);
          setPeriodOnList(periodOnList);
          handleMetricAverage(getMetricAverage(periodOnList));
        }
      } else {
        setValidLimit(false);
        setPeriodOnList([]);
        handleMetricAverage(0);
      }
    } else {
      if (props.onOffMetric) {
        setValidLimit(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartDataBackup, limit, setPeriodOnList, setValidLimit, trainingPeriod]);

  useEffect(() => {
    if (!props.onOffMetric && chartDataBackup?.datasets?.length > 0) {
      if (periodOnList.length > 0 && limit > 0) {
        let trainingData = {};
        let tempPeriodOnList = [];

        chartDataBackup.datasets.forEach((axis) => {
          let data =
            axis?._data?.length > axis.data.length ? axis._data : axis.data;
          data.forEach((dataItem) => {
            if (!trainingData[dataItem.x]) {
              trainingData[dataItem.x] = { timestamp: dataItem.x, values: [] };
            }
            trainingData[dataItem.x].values.push(dataItem.y);
          });
        });

        periodOnList.forEach((period) => {
          tempPeriodOnList.push({
            startTime: period.startTime,
            endTime: period.endTime,
            values: Object.values(trainingData)
              .filter(
                (data) =>
                  data.timestamp >= period.startTime &&
                  data.timestamp <= period.endTime
              )
              .map((data) => data.values),
          });
        });

        handleMetricAverage(getMetricAverage(tempPeriodOnList));
      } else {
        handleMetricAverage(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodOnList, chartDataBackup, limit, trainingPeriod]);

  useEffect(() => {
    setClassChart("crosshair");
    setLoading(true);
    setLoadingAutomatic(true);
    loadData(props.dateRange);
    addAnomObserver("vel", async (event) => {
      if (!!myChart) {
        for (let id in myChart.options.plugins.annotation.annotations) {
          if (id === "anom_" + event.anomId) {
            myChart.options.plugins.annotation.annotations[id].backgroundColor =
              event.hover
                ? typeColorOn[event.anomType]
                : typeColorOff[event.anomType];
          }
        }
        myChart.update();
      }
    });
    addTabObserver("vel", async (anomList) => {
      if (!!myChart) {
        for (let id in myChart.options.plugins.annotation.annotations) {
          myChart.options.plugins.annotation.annotations[id].display =
            anomList[id];
        }
        myChart.update();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!myChart) {
      myChart.options.plugins.annotation.annotations = {
        ...annotations,
      };

      myChart.update();
    }
  }, [myChart, annotations]);

  useEffect(() => {
    props?.startExpanded && toggleFullScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.startExpanded]);

  useEffect(() => {
    if (
      trainingPeriod &&
      trainingPeriod.startDate !== "" &&
      trainingPeriod.endDate !== ""
    ) {
      if (periodOnList?.length > 0) {
        let tempAnnotations = {
          trainingPeriod: {
            type: "box",
            scaleID: "x",
            xMax: trainingPeriod.endDate,
            xMin: trainingPeriod.startDate,
            borderDash: [5, 5],
            backgroundColor: "rgb(0,0,0,0)",
            borderColor: "#808080",
            drawTime: "afterDraw",
            borderWidth: 1,
            display: true,
          },
        };

        periodOnList.forEach((period, index) => {
          let name = "periodOn" + index;
          tempAnnotations = {
            ...tempAnnotations,
            [name]: {
              type: "box",
              scaleID: "x",
              xMax: period.endTime,
              xMin: period.startTime,
              backgroundColor: "rgba(117, 175, 201, 0.3)",
              borderColor: "#156284",
              drawTime: "afterDraw",
              borderWidth: 1,
              display: true,
            },
          };
        });

        setAnnotations(tempAnnotations);
      } else {
        setAnnotations({
          trainingPeriod: {
            type: "box",
            scaleID: "x",
            xMax: trainingPeriod.endDate,
            xMin: trainingPeriod.startDate,
            backgroundColor: "rgba(117, 175, 201, 0.3)",
            borderColor: "#156284",
            drawTime: "afterDraw",
            borderWidth: 1,
            display: true,
          },
        });
      }
    } else {
      setAnnotations({});
    }
  }, [periodOnList, trainingPeriod]);

  useEffect(() => {
    if (props.expanded) {
      setSize("82vh");
      fullScreenButton.current.classList.remove("selected-chart-button");
    } else {
      setSize("28vh");
      fullScreenButton.current.classList.add("selected-chart-button");
    }
  }, [props.expanded]);

  return {
    noData,
    isModalVisible,
    size,
    loading,
    onEnterPress,
    classChart,
    chartName,
    toggleResetMode,
    togglePanMode,
    toggleFullScreen,
    toggleModal,
    chartCSV,
    fullScreenButton,
    panButton,
    saveLimits,
    yAxisMax,
    yAxisMin,
    setyAxisMax,
    setyAxisMin,
  };
}
