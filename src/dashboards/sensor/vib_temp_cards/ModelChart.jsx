import { Tooltip } from "@material-ui/core";
import {
  PanTool,
  MoreVert,
  Settings,
  Delete,
  FiberManualRecord,
} from "@mui/icons-material";
import { Axis, Fullscreen, Refresh } from "../../../assets/customIcons";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import {
  automaticAlarm,
  plotChart,
  deleteChart,
  updateChart,
  getAlarmInfo,
  updateChartAlarms,
} from "../../../apis";

import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";

import {
  Button,
  Input,
  Card,
  NoDataLayer,
  IoTebeModal,
} from "../../../components";
import {
  MyCustomSliderAlarm,
  MyCustomSwitchAlarm,
  MyCustomSwitchAlarmMobile,
} from "./Customizations";
import { colors } from "../../../utilities";
import { DownloadButton } from "../../../components/DownloadButton";
import { makeCsv } from "../../../utilities";
import { RightSideMenuContext, WhichRenderContext } from "../../../contexts";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import useVisibility from "../../../hooks/useVisibility";
import {
  ProtectedFeature,
  hasPermission,
} from "../../../components/ProtectedFeature/ProtectedFeature";

var myChartId;

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

const metricConversion = {
  1: "rms",
  2: "rms",
  3: null,
  5: "pico",
  12: "kurtosis",
  13: "skewness",
};

function ModelChart(props) {
  const [noData, setNoData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [size, setSize] = useState("28vh");
  const [loading, setLoading] = useState(true);
  const [yAxisMin, setyAxisMin] = useState(false);
  const [yAxisMax, setyAxisMax] = useState(false);

  const [classChart, setClassChart] = useState("crosshair");
  const [myChart, setMyChart] = useState();

  const [chartDatasets, setChartDatasets] = useState();
  const [chartCSV, setChartCSV] = useState({ headers: [], data: [] });
  const [disableAlarm, setDisableAlarm] = useState(0);
  const [alarmAlert, setAlarmAlert] = useState("0");
  const [alarmCritical, setAlarmCritical] = useState("0");
  const [triggerCondition, setTriggerCondition] = useState(1);
  const [disableAlarmBackup, setDisableAlarmBackup] = useState(0);
  const [alarmAlertBackup, setAlarmAlertBackup] = useState("0");
  const [alarmCriticalBackup, setAlarmCriticalBackup] = useState("0");
  const [triggerConditionBackup, setTriggerConditionBackup] = useState(1);
  const [anomalies, setAnomalies] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [chartName, setChartName] = useState(" ");
  const [changeModal, setChangeModal] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [period, setPeriod] = useState(1);
  const [autoAlarmModal, setAutoAlarmModal] = useState(null);
  const [graphName, setGraphName] = useState("");
  const [axis, setAxis] = useState([]);
  const [mobileMode, setMobileMode] = useState(false);
  const [hideAxis, setHideAxis] = useState(false);
  const [autoClicked, setAutoClicked] = useState(false);
  const [alarmSize, setAlarmSize] = useState(false);
  const [lock, setLock] = useState(0);
  const { addAnomObserver, addTabObserver, tabOpen } =
    useContext(RightSideMenuContext);
  const {
    setAlarmYellow,
    setAlarmRed,
    warningAlarm,
    setWarningAlarm,
    selectedNode,
  } = useContext(WhichRenderContext);

  const panButton = useRef(null);
  const fullScreenButton = useRef(null);
  const cRef = useRef();

  const hasConfigChartPermission = hasPermission(
    ["CONFIG_CHARTS"],
    selectedNode.permission
  );

  const [isFirstLoadData, setIsFirstLoadData] = useState(true);
  const chartDiv = useRef(null);
  const { isVisible } = useVisibility(chartDiv);

  const onEnterPress = (target) => {
    target.charCode === 13 && saveLimits();
  };

  const handleTimeSlider = (event, time) => {
    setTriggerCondition(time);

    if (time === 0 || time === null) {
      setDisableAlarm(1);
    } else {
      setDisableAlarm(0);
    }
  };

  const deleteGraph = async () => {
    setLoading(true);
    try {
      await deleteChart(props.chartId);
      await props.remove(props.index);
      FeedbackToast.success();
    } catch (error) {
      setLoading(false);
      setConfigModal(false);
      FeedbackToast.error();
    } finally {
      setLoading(false);
      setConfigModal(false);
    }
  };

  const updateGraph = async () => {
    setLoading(true);
    try {
      if (graphName === "") {
        window.alert("Preencha o nome do gráfico.");
        setChangeModal(true);
      } else if (axis.length === 0 && hideAxis === false) {
        window.alert("Selecione pelo menos um eixo.");
        setChangeModal(true);
      } else {
        setChangeModal(false);
        await updateChart(props.chartId, graphName, axis);
        await myChart.destroy();
        await loadData(props.chartId, props.dateRange);
        FeedbackToast.success();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setChangeModal(false);
      FeedbackToast.error();
    } finally {
      setLoading(false);
      setLock(0);
    }
  };

  const updateAlarm = async () => {
    setLoading(true);
    try {
      await updateChartAlarms(
        props.chartId,
        disableAlarm,
        alarmAlert,
        alarmCritical,
        triggerCondition
      );
    } catch (error) {
      console.log(error);
    } finally {
      props.setUpdate(false);
      setLoading(false);
    }
  };

  const autoAlarm = async () => {
    try {
      const res = await automaticAlarm(props.chartId, props.dateRange, false);
      if (res.data.message.length > 0) {
        for (let msg of res.data.message) {
          if (msg[0] === "V") {
            setAutoAlarmModal("tmp");
          } else if (msg[0] === "I") {
            setAutoAlarmModal("stg");
          }
        }
      }
      setAlarmAlert(parseFloat(res.data.Alert.toFixed(2)));
      setAlarmCritical(parseFloat(res.data.Critical.toFixed(2)));
      setAlarmYellow(res.data.Alert.toFixed(2));
      setAlarmRed(res.data.Critical.toFixed(2));
      FeedbackToast.success();
    } catch (error) {
      if (error.response.data.erroType === "sample") {
        setAutoAlarmModal("sample");
      } else if (error.response.data.erroType === "data") {
        setAutoAlarmModal("sample");
      } else {
        setAutoAlarmModal("internal");
        FeedbackToast.error();
      }
    } finally {
      setAutoClicked(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(async (chartId, dateRange) => {
    setNoData(false);
    setLoading(true);
    try {
      const res = await plotChart(chartId, dateRange);
      const alarm = await getAlarmInfo(chartId);
      setChartName(res.data.chart_name);
      setGraphName(res.data.chart_name);
      res.data.data.map((axisData) =>
        axisData.axis === "TEMPERATURE" ? setHideAxis(true) : setHideAxis(false)
      );
      const unit =
        res.data.unit === "celsius"
          ? "°C"
          : res.data.unit === "non-dimensional"
          ? ""
          : res.data.unit;

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
                ? colors.aRmsBackground /* : axisData.axis === "RADIAL" ?
                      colors.tempBackground : axisData.axis === "TANGENCIAL" ?
                        colors.tempBackground*/
                : colors.tempBackground,
            borderColor:
              axisData.axis === "VERTICAL"
                ? colors.vRmsIndicator
                : axisData.axis === "HORIZONTAL"
                ? colors.hRmsIndicator
                : axisData.axis === "AXIAL"
                ? colors.aRmsIndicator /*: axisData.axis === "RADIAL" ?
                      colors.tempIndicator : axisData.axis === "TANGENCIAL" ?
                        colors.tempIndicator*/
                : colors.tempIndicator,
            data: axisData.data,
            pointRadius: 0,
            borderWidth: 0.5,
          };
        }),
      };

      chartData.datasets.reverse();

      let tempArray = [];
      let tempArrayAxis = [];
      await chartData.datasets.forEach((axisData) => {
        tempArray = [...tempArray, axisData.label];
        if (axisData.label === "Vertical") {
          if (!tempArrayAxis.includes(1)) tempArrayAxis = [...tempArrayAxis, 1];
        }
        if (axisData.label === "Horizontal") {
          if (!tempArrayAxis.includes(2)) tempArrayAxis = [...tempArrayAxis, 2];
        }
        if (axisData.label === "Axial") {
          if (!tempArrayAxis.includes(3)) tempArrayAxis = [...tempArrayAxis, 3];
        }
      });
      setAxis(tempArrayAxis);
      setChartCSV(makeCsv(chartData));
      setChartDatasets(chartData.datasets[0]);
      setDisableAlarm(alarm.data.disable_alarm);
      setAlarmAlert(alarm.data.alarm_alert);
      setAlarmCritical(alarm.data.alarm_critical);
      setTriggerCondition(alarm.data.trigger_condition);
      setDisableAlarmBackup(alarm.data.disable_alarm);
      setAlarmAlertBackup(alarm.data.alarm_alert);
      setAlarmCriticalBackup(alarm.data.alarm_critical);
      setTriggerConditionBackup(alarm.data.trigger_condition);
      setPeriod(alarm.data.sampling_period);
      const disable = alarm.data.disable_alarm;
      const alarmAnnot = alarmToAnnot(
        alarm.data.alarm_alert,
        alarm.data.alarm_critical
      );
      const anomalyAnnotations = anomToAnnot(res.data.anomalies, dateRange);
      setAnomalies(anomalyAnnotations);
      const annot = madeAnnotation(res.data.annotations);
      setAnnotations(annot);
      await plotChartGraph(
        chartData,
        alarmAnnot,
        anomalyAnnotations,
        annot,
        unit,
        res.data.metric_id,
        disable
      );
    } catch (error) {
      console.log(error);
      setNoData(true);
    } finally {
      props.onLoad(true);
      setLoading(false);
    }
  });

  const alarmToAnnot = (alarm1, alarm2) => {
    return {
      alarm1: {
        type: "line",
        scaleID: "y",
        value: alarm1,
        borderColor: colors.alarmAlert,
        borderWidth: 1,
      },

      alarm2: {
        type: "line",
        scaleID: "y",
        value: alarm2,
        borderColor: colors.alarmCritical,
        borderWidth: 1,
      },
    };
  };

  const anomToAnnot = (detected_anoms, vibTempDateRange) => {
    let annot = {};
    for (let anomaly of detected_anoms) {
      if (
        anomaly.start_timestamp <
        vibTempDateRange.startDate.getTime() / 1000
      ) {
        anomaly.start_timestamp = vibTempDateRange.startDate.getTime() / 1000;
      }
      if (anomaly.end_timestamp > vibTempDateRange.endDate.getTime() / 1000) {
        anomaly.end_timestamp = vibTempDateRange.endDate.getTime() / 1000;
      }
    }

    const show = tabOpen === "WAITING" ? true : false;

    detected_anoms.forEach((element) => {
      annot["anom_" + element.detected_anom_user_id] = {
        type: "box",
        scaleID: "x",
        xMax: element.end_timestamp * 1000,
        xMin: element.start_timestamp * 1000,
        backgroundColor: typeColorOff[element.anom_type],
        drawTime: "beforeDraw",
        borderWidth: 0,
        display: element.anom_type === "WAITING_FEEDBACK" ? show : !show,
      };
    });

    return annot;
  };

  const madeAnnotation = (object) => {
    let annot = {};

    object.forEach((element) => {
      let desc = element.description;
      annot[element.spot_annotation_id] = {
        type: "line",
        scaleID: "x",
        value: element.timestamp * 1000,
        borderColor: "rgba(255, 108, 0, 0.7)",
        borderWidth: 2,

        label: {
          enabled: false,
          content: element.title,
          position: "start",
          yAdjust: -10,
          backgroundColor: "rgba(255, 108, 0, 1)",
        },

        description: element.description,

        click: (element) => {
          props.setAnnotationSelected(element.element.options);
          props.setDescription(desc);
        },

        enter: (element) => {
          element.element.options.label.enabled = true;
          element.chart.canvas.style.cursor = "pointer";
        },

        leave: (element) => {
          element.element.options.label.enabled = false;
          element.chart.canvas.style.cursor = null;
        },
      };
    });

    return annot;
  };

  function plotChartGraph(
    chartData,
    alarmAnnot,
    anomaliesAnnotation,
    annotationData,
    unit,
    metricId,
    disable
  ) {
    var ctx = document.getElementById(props.id);
    setLoading(true);

    !!ctx && (ctx = ctx.getContext("2d"));

    if (myChartId === props.id) {
      //myChart.destroy();
    }

    if (!!ctx) {
      const anom = props.filterAnnotations.includes("anom")
        ? anomaliesAnnotation
        : {};
      const alarm =
        props.filterAnnotations.includes("alarm") && disable === 0
          ? alarmAnnot
          : {};
      const annot = props.filterAnnotations.includes("annot")
        ? annotationData
        : {};
      const diagnosticAlarm =
        props?.alarmedAnnotations?.length > 0 ? props.alarmedAnnotations : {};

      let annotations = {
        ...anom,
        ...alarm,
        ...annot,
        ...diagnosticAlarm,
      };

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
                  minute: "HH:mm",
                  second: "HH:mm:ss",
                },

                tooltipFormat: "DD/MM/YYYY HH:mm",
              },

              ticks: {
                source: "auto",
              },
            },

            y: {
              beginAtZero: true,

              title: {
                display: true,
                text:
                  (unit || "") +
                  (unit && metricConversion[metricId.toString()] ? " - " : "") +
                  (metricConversion[metricId.toString()]
                    ? metricConversion[metricId.toString()]
                    : ""),
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
                  `${label} = ${y.toFixed(3)} ${unit || ""}`,
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
                  const xDiff = Math.floor(scalesX.max - scalesX.min);
                  if (xDiff <= 60000) {
                    chart.options.scales.x.time.unit = "second";
                    chart.options.scales.x.time.tooltipFormat =
                      "DD/MM/YYYY HH:mm:ss";
                  } else if (xDiff <= 3600000) {
                    chart.options.scales.x.time.unit = "minute";
                    chart.options.scales.x.time.tooltipFormat =
                      "DD/MM/YYYY HH:mm:ss";
                  } else if (xDiff <= 86400000) {
                    chart.options.scales.x.time.unit = "hour";
                    chart.options.scales.x.time.tooltipFormat =
                      "DD/MM/YYYY HH:mm";
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
              annotations: {
                ...annotations,
              },
            },
          },
        },
      });
      setMyChart(myChartCreated);
    }
  }

  function toggleResetMode() {
    myChart.options.scales.x.time.unit = props.dateType;
    myChart.options.scales.x.time.tooltipFormat = "DD/MM/YYYY HH:mm";
    myChart.options.scales.y.max = undefined;
    myChart.options.scales.x.max = props.dateRange.endDate;
    myChart.options.scales.x.min = props.dateRange.startDate;
    myChart.resetZoom();
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
    setAlarmSize(!alarmSize);
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

  useEffect(() => {
    if (isVisible && isFirstLoadData) {
      setIsFirstLoadData(false);
      panButton.current.classList.add("selected-chart-button");
      setClassChart("crosshair");
      setLoading(true);
      loadData(props.chartId, props.dateRange);
      addAnomObserver("vel", async (event) => {
        if (!!myChart) {
          for (let id in myChart.options.plugins.annotation.annotations) {
            if (id === "anom_" + event.anomId) {
              myChart.options.plugins.annotation.annotations[
                id
              ].backgroundColor = event.hover
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (!!myChart) {
      const changeAlarm = alarmToAnnot(alarmAlert, alarmCritical);

      const anom = props.filterAnnotations.includes("anom") ? anomalies : {};
      const alarm =
        props.filterAnnotations.includes("alarm") && disableAlarm === 0
          ? changeAlarm
          : {};
      const annot = props.filterAnnotations.includes("annot")
        ? annotations
        : {};

      let tmp = {
        ...anom,
        ...alarm,
        ...annot,
      };

      myChart.options.plugins.annotation.annotations = {
        ...tmp,
      };
      myChart.update();
    }
    if (disableAlarm === 0) {
      setAlarmYellow(alarmAlert);
      setAlarmRed(alarmCritical);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filterAnnotations, alarmCritical, alarmAlert, disableAlarm]);

  useEffect(() => {
    if (!!myChart) {
      myChart.options.onClick = props.saveAnnotation
        ? (c, v) => {
            if (!!v.length) {
              props.setAnnotation(chartDatasets.data[v[0].index].x);
            }
          }
        : undefined;
      myChart.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.saveAnnotation]);

  useEffect(() => {
    if (props.alarmMode && window.innerWidth < 992) setMobileMode(true);
    else setMobileMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.alarmMode, window.innerWidth]);

  useEffect(() => {
    const handleClick = (event) => {
      if (cRef.current && !cRef.current.contains(event.target)) {
        setConfigModal(false);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  useEffect(() => {
    return () => {
      myChartId = props.id;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.update === true) updateAlarm();
    if (props.cancel === true) {
      setDisableAlarm(disableAlarmBackup);
      setAlarmAlert(alarmAlertBackup);
      setAlarmCritical(alarmCriticalBackup);
      setTriggerCondition(triggerConditionBackup);
      props.setCancel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.update, props.cancel]);

  useEffect(() => {
    props?.startExpanded && toggleFullScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.startExpanded]);

  return (
    <Card
      isVisible={!isFirstLoadData}
      chartDivRef={chartDiv}
      className="col-12 transition_smooth chart-card"
      style={loading && { boxShadow: "none" }}
      height={mobileMode ? "auto" : size}
      minHeight="200px"
    >
      {loading && (
        <div className="chart-loading">
          <div className="chart-loading-animation" />
        </div>
      )}
      <IoTebeModal
        showModal={changeModal}
        toggleModal={() => setChangeModal(!changeModal)}
        changeMarginBottom={"35px"}
        style={{ width: "35%" }}
        title="Configurações do gráfico"
        onDismissTitle="Cancelar"
        onConfirm={
          hasConfigChartPermission
            ? () => {
                if (lock === 0) {
                  setLock(1);
                  setChangeModal(false);
                  updateGraph();
                } else {
                  setLock(1);
                }
              }
            : false
        }
        onConfirmTitle="Salvar"
        children={
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="optionsBox">
              <h3 style={{ fontSize: "1rem" }}>Nome:</h3>
              <input
                className="createOptionsInput"
                type="text"
                placeholder="Nome do gráfico"
                id="graphName"
                value={graphName.toUpperCase()}
                onChange={(e) => setGraphName(e.target.value.toUpperCase())}
                style={
                  !hasConfigChartPermission
                    ? {
                        backgroundColor: "#F8F8F8",
                        borderColor: "#777",
                        width: "92%",
                      }
                    : { width: "92%" }
                }
                disabled={!hasConfigChartPermission}
              />
            </div>
          </div>
        }
      />
      <IoTebeModal
        showModal={confirmDelete}
        toggleModal={() => setConfirmDelete(!confirmDelete)}
        changeMarginBottom={"35px"}
        title="Excluir gráfico"
        dismissFunc={() => {
          setConfigModal(false);
          setConfirmDelete(false);
          deleteGraph();
        }}
        onDismissTitle="Sim"
        onConfirm={() => {
          setConfirmDelete(false);
        }}
        onConfirmTitle="Não"
        children={
          <>
            Você está excluindo o gráfico {graphName}
            <br />
            Tem certeza que deseja prosseguir?
          </>
        }
      />
      <IoTebeModal
        showModal={autoAlarmModal !== null}
        changeMarginBottom={"35px"}
        title="Erro ao gerar alarme automático"
        onConfirm={() => {
          setAutoAlarmModal(null);
        }}
        onConfirmTitle="Ok"
        children={
          <>
            {autoAlarmModal === "sample" && (
              <>
                O ponto de coleta deve possuir dados para todos os dias desta
                semana para poder gerar os alarmes
              </>
            )}
            {autoAlarmModal === "data" && (
              <>Não há nenhum ponto para ser analisado nesta semana</>
            )}
            {autoAlarmModal === "internal" && (
              <>Erro inesperado ao tentar gerar alarmes</>
            )}
            {autoAlarmModal === "stg" && (
              <>
                Intervalo de dados não é estacionario, é recomendado gerar
                novamente os alarmes com um intervalo diferente!
              </>
            )}
            {autoAlarmModal === "tmp" && (
              <>
                Valor sugerido para a temperatura excede o valor máximo do
                sensor, alarmes de temperatura limitados para 84 e 85 graus!
              </>
            )}
          </>
        }
      />
      <div
        style={
          mobileMode
            ? {
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }
            : {
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }
        }
      >
        <div
          style={
            !mobileMode
              ? props.alarmMode
                ? {
                    height: "100%",
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }
              : {
                  height: "145px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            <MoreVert
              style={{ cursor: "pointer" }}
              onClick={() => setConfigModal(!configModal)}
            />
            {configModal && (
              <div
                ref={cRef}
                className="chartConfigs"
                style={{
                  marginTop: !hasConfigChartPermission ? "8%" : "",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "0 3%",
                    color: "#777",
                    cursor: "pointer",
                  }}
                  onClick={() => setChangeModal(true)}
                >
                  <Settings />
                  <h4
                    style={{
                      padding: "0 1%",
                      fontSize: "1rem",
                      marginBottom: 0,
                      alignSelf: "center",
                    }}
                  >
                    Configurar
                  </h4>
                </div>
                {!props.blockDelete && (
                  <ProtectedFeature requiredPermissions={["CONFIG_CHARTS"]}>
                    <hr />
                    <div
                      style={{
                        display: "flex",
                        padding: "0 3%",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Delete />
                      <h4
                        style={{
                          padding: "0 1%",
                          fontSize: "1rem",
                          marginBottom: 0,
                          alignSelf: "center",
                        }}
                      >
                        Excluir
                      </h4>
                    </div>
                  </ProtectedFeature>
                )}
              </div>
            )}

            {props.automaticDiagnosticChart ? (
              <div className="cardTitle">
                <Tooltip
                  style={{ color: "gray" }}
                  className="info"
                  placement="top-start"
                  title={
                    <p style={{ textAlign: "center" }}>
                      Gráfico gerado pelo
                      <br />
                      Diagnóstico Automático
                    </p>
                  }
                >
                  <div
                    style={{
                      background: "#D6E8EF",
                      borderRadius: 4,
                      border: "1px rgba(117.42, 175.41, 201.01, 0.30) solid",
                      justifyContent: "center",
                      gap: 6,
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      padding: "2px 5px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_551_422)">
                        <path
                          d="M10.4746 2.25738C9.84403 1.83516 9.12571 1.53357 8.35803 1.37455C8.01806 1.30875 7.70003 1.56647 7.70003 1.91741C7.70003 2.16964 7.87001 2.39994 8.11676 2.44929C8.75832 2.57541 9.35601 2.83313 9.87693 3.18407C10.0908 3.32663 10.3704 3.28825 10.5514 3.1073C10.8036 2.86055 10.7652 2.44929 10.4746 2.25738ZM6.60335 1.91741C6.60335 1.56647 6.28532 1.30875 5.94535 1.37455C5.17767 1.53357 4.45935 1.83516 3.82876 2.25738C3.54363 2.44929 3.50524 2.86055 3.74651 3.10181C3.92746 3.28277 4.20712 3.32115 4.42097 3.17858C4.94737 2.82765 5.53958 2.57541 6.18113 2.44381C6.43337 2.39994 6.60335 2.16964 6.60335 1.91741ZM2.97336 3.88045C2.72661 3.6337 2.31535 3.67757 2.12892 3.96271C1.7067 4.59329 1.39963 5.30613 1.24609 6.07929C1.17481 6.41926 1.43801 6.73729 1.78346 6.73729C2.0357 6.73729 2.266 6.56731 2.31535 6.32056C2.44147 5.679 2.69919 5.08131 3.05012 4.55491C3.18721 4.34654 3.14883 4.06141 2.97336 3.88045ZM12.5199 6.73729C12.8654 6.73729 13.1286 6.41926 13.0573 6.07929C12.8983 5.31162 12.5967 4.59878 12.1745 3.96271C11.9825 3.67757 11.5713 3.6337 11.33 3.88045C11.1491 4.06141 11.1107 4.34106 11.2533 4.55491C11.6042 5.08131 11.8564 5.679 11.988 6.32056C12.0374 6.56731 12.2677 6.73729 12.5199 6.73729ZM4.95834 7.53787L6.29628 8.14652L6.89945 9.47898C6.99816 9.69283 7.29974 9.69283 7.39844 9.47898L8.0071 8.14104L9.34504 7.53787C9.55889 7.43917 9.55889 7.13758 9.34504 7.03888L8.0071 6.43022L7.40393 5.09228C7.30522 4.87843 7.00364 4.87843 6.90494 5.09228L6.29628 6.43022L4.95834 7.0334C4.74449 7.1321 4.74449 7.43917 4.95834 7.53787Z"
                          fill="#156284"
                        />
                        <path
                          d="M7.1489 12.2204C5.44357 12.2204 3.94113 11.3486 3.0583 10.0271H3.85888C4.16046 10.0271 4.40721 9.78034 4.40721 9.47876C4.40721 9.17717 4.16046 8.93042 3.85888 8.93042H1.66553C1.36394 8.93042 1.11719 9.17717 1.11719 9.47876V11.6721C1.11719 11.9737 1.36394 12.2204 1.66553 12.2204C1.96711 12.2204 2.21386 11.9737 2.21386 11.6721V10.7399C3.30505 12.2972 5.1036 13.3171 7.1489 13.3171C9.589 13.3171 11.6837 11.8695 12.6323 9.79131C12.7748 9.47876 12.5884 9.10589 12.2539 9.02912C12.0072 8.97429 11.744 9.08944 11.6398 9.32522C10.8611 11.0306 9.14485 12.2204 7.1489 12.2204Z"
                          fill="#156284"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_551_422">
                          <rect
                            width="13.1601"
                            height="13.1601"
                            fill="white"
                            transform="translate(0.570312 0.705322)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <span style={{ color: "#156284", fontSize: "12px" }}>
                      {chartName}
                    </span>
                  </div>
                </Tooltip>
              </div>
            ) : (
              <h6 className="cardTitle">{chartName}</h6>
            )}

            {!noData && (
              <div className="row-chart-buttons">
                <Button
                  id="reset-button"
                  small
                  style={{ padding: "auto", fill: "white" }}
                  onClick={() => toggleResetMode()}
                  className="selected-chart-button chart-button"
                >
                  <Tooltip title="Reset">
                    <Refresh />
                  </Tooltip>
                </Button>

                <Button
                  id="pan-button"
                  small
                  style={{ color: "#fff", backgroundColor: "#156284" }}
                  onClick={() => togglePanMode()}
                  className="selected-chart-button chart-button"
                  buttonRef={panButton}
                >
                  <Tooltip title="Arrastar">
                    <PanTool fontSize={"inherit"} style={{ fontSize: 12 }} />
                  </Tooltip>
                </Button>

                <Button
                  id="limit-button"
                  small
                  style={{ padding: "auto", fill: "white" }}
                  onClick={() => toggleModal()}
                  className="selected-chart-button chart-button"
                >
                  <Tooltip title="Limite eixo Y">
                    <Axis />
                  </Tooltip>
                </Button>

                <DownloadButton
                  id="download-button"
                  small
                  style={{
                    fill: "white",
                    width: "25px",
                    height: "25px",
                    borderRadius: "6px",
                    transition: ".3s",
                  }}
                  className="selected-chart-button chart-button"
                  filename={chartName + ".csv"}
                  headers={chartCSV.headers}
                  data={chartCSV.data}
                />

                <Button
                  id="fullscreen"
                  small
                  onClick={() => toggleFullScreen()}
                  style={{ fill: "#fff", backgroundColor: "#156284" }}
                  className="selected-chart-button chart-button"
                  buttonRef={fullScreenButton}
                >
                  <Tooltip title="Tela cheia">
                    <Fullscreen />
                  </Tooltip>
                </Button>
              </div>
            )}
          </div>

          <NoDataLayer noData={noData}>
            <canvas
              id={props.id}
              className={classChart}
              // eslint-disable-next-line jsx-a11y/aria-role
              role="canvas"
              aria-label="myCanvas"
            ></canvas>
            {props.showAlarmLegend && window.innerWidth > 700 && (
              <ul
                className="alarm-legend"
                style={{
                  gap: window.innerWidth < 700 && 12,
                  gridGap: window.innerWidth < 700 && 12,
                }}
              >
                <Tooltip
                  style={{ color: "#707070", fontSize: 12 }}
                  className="info"
                  title={"Alerta"}
                  arrow
                  placement="top"
                >
                  <li className="alarm-legend-alert">{alarmAlert}</li>
                </Tooltip>
                <Tooltip
                  style={{ color: "#707070", fontSize: 12 }}
                  className="info"
                  title={"Crítico"}
                  arrow
                  placement="top"
                >
                  <li className="alarm-legend-critical">{alarmCritical}</li>
                </Tooltip>
                <Tooltip
                  style={{ color: "#707070", fontSize: 12 }}
                  className="info"
                  title={"Condição de Disparo"}
                  arrow
                  placement="top"
                >
                  <li className="alarm-legend-trigger">
                    {triggerCondition}{" "}
                    {window.innerWidth > 700 &&
                      (triggerCondition === 1 ? "amostra" : "amostras")}
                  </li>
                </Tooltip>
              </ul>
            )}
          </NoDataLayer>

          <Modal isOpen={isModalVisible} toggle={() => toggleModal()} centered>
            <ModalHeader toggle={() => toggleModal()}>
              Alterar limite do gráfico
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label className="label-add-graph">Amplitude mínima</Label>
                <Input
                  className="iotebe-input"
                  type="number"
                  value={yAxisMin}
                  onChange={(e) => setyAxisMin(e.target.value)}
                  onKeyPress={onEnterPress}
                />
              </FormGroup>
              <FormGroup>
                <Label className="label-add-graph">Amplitude máxima</Label>
                <Input
                  className="iotebe-input"
                  type="number"
                  value={yAxisMax}
                  onChange={(e) => setyAxisMax(e.target.value)}
                  onKeyPress={onEnterPress}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter
              style={{
                height: 60,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                cancel={true}
                onClick={() => toggleModal()}
                buttonType="rounded-button-outlined"
              >
                Cancelar
              </Button>
              <Button onClick={() => saveLimits()} buttonType="rounded-button">
                Salvar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {!noData && props.alarmMode && (
          <>
            <div className="alarmBorder" />
            <div
              className="alarmDiv"
              style={
                mobileMode
                  ? { width: "100%", height: "100%", marginBottom: "3%" }
                  : alarmSize
                  ? {
                      width: "20%",
                      maxWidth: "26vw",
                      maxHeight: "200px",
                      height: "40%",
                    }
                  : {
                      width: "20%",
                      maxWidth: "26vw",
                      maxHeight: "200px",
                      height: "100%",
                    }
              }
            >
              {warningAlarm && alarmCritical < alarmAlert && (
                <div
                  className="errorAlarmText"
                  style={mobileMode ? { fontSize: 12, marginBottom: 5 } : {}}
                >
                  O alarme Crítico precisa ser maior que o de Alerta
                </div>
              )}
              <div
                className="redYellowSwitch"
                style={mobileMode ? { justifyContent: "space-between" } : {}}
              >
                <div className="alarmDisplay">
                  <Tooltip placement="top" title={"Alerta"} arrow>
                    <FiberManualRecord
                      style={
                        mobileMode
                          ? { color: "#FFE032", fontSize: "1.75rem" }
                          : { color: "#FFE032", fontSize: "1rem" }
                      }
                    />
                  </Tooltip>
                  <input
                    type="number"
                    value={alarmAlert}
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < alarmCritical)
                        setWarningAlarm(false);
                      setAlarmAlert(parseFloat(e.target.value));
                      setAutoClicked(false);
                    }}
                    placeholder="00.0"
                    step="0.1"
                    min={0}
                    max={99}
                    className="numberAlarm"
                    style={
                      mobileMode
                        ? { width: "65px", padding: "10px", marginLeft: "10%" }
                        : {}
                    }
                  />
                </div>
                <div className="alarmDisplay">
                  <Tooltip placement="top" title={"Crítico"} arrow>
                    <FiberManualRecord
                      style={
                        mobileMode
                          ? { color: "#FD0D1B", fontSize: "1.75rem" }
                          : { color: "#FD0D1B", fontSize: "1rem" }
                      }
                    />
                  </Tooltip>
                  <input
                    type="number"
                    value={alarmCritical}
                    onChange={(e) => {
                      if (parseFloat(e.target.value) > alarmAlert)
                        setWarningAlarm(false);
                      setAlarmCritical(parseFloat(e.target.value));
                      setAutoClicked(false);
                    }}
                    step="0.1"
                    min={0}
                    max={99}
                    className="numberAlarm"
                    style={
                      mobileMode
                        ? {
                            width: "65px",
                            padding: "10px",
                            marginLeft: "10%",
                            borderColor:
                              warningAlarm &&
                              alarmCritical < alarmAlert &&
                              "#DF1C27",
                          }
                        : {
                            borderColor:
                              warningAlarm &&
                              alarmCritical < alarmAlert &&
                              "#DF1C27",
                          }
                    }
                  />
                </div>
                {mobileMode ? (
                  <MyCustomSwitchAlarmMobile
                    name="disableAlarm"
                    onChange={() => {
                      disableAlarm === 0
                        ? setDisableAlarm(1)
                        : setDisableAlarm(0);
                    }}
                    checked={disableAlarm === 0 ? true : false}
                  />
                ) : (
                  <MyCustomSwitchAlarm
                    name="disableAlarm"
                    onChange={() => {
                      disableAlarm === 0
                        ? setDisableAlarm(1)
                        : setDisableAlarm(0);
                    }}
                    checked={disableAlarm === 0 ? true : false}
                  />
                )}
              </div>
              <div
                className={
                  autoClicked ? "automaticAlarmClicked" : "automaticAlarm"
                }
                onClick={() => {
                  autoAlarm();
                  setAutoClicked(true);
                }}
                style={
                  mobileMode
                    ? {
                        display: "flex",
                        width: "100%",
                        alignSelf: "center",
                        cursor: "pointer",
                      }
                    : {}
                }
              >
                <div
                  className="automaticAlarmText"
                  style={
                    mobileMode
                      ? {
                          padding: "8px 18vw",
                          margin: "auto",
                          fontSize: "0.8rem",
                        }
                      : { fontSize: "0.8rem" }
                  }
                >
                  Gerar alarme automático
                </div>
              </div>
              <div className="conditionsAlarm">
                <div className="boldAlarmText">Condição de disparo</div>
                <MyCustomSliderAlarm
                  valueLabelDisplay="off"
                  value={triggerCondition}
                  name="rmstempSamplingPeriod"
                  onChange={handleTimeSlider}
                  min={1}
                  max={10}
                />
                <div className="metricAlarm">
                  <div className="metricAlarm">
                    <input
                      type="number"
                      value={triggerCondition}
                      onChange={(e) => {
                        setTriggerCondition(
                          parseInt(e.target.value < 11 ? e.target.value : 1)
                        );
                        handleTimeSlider(
                          parseInt(e.target.value < 11 ? e.target.value : 1),
                          parseInt(e.target.value < 11 ? e.target.value : 1)
                        );
                      }}
                      step="1"
                      min={1}
                      max={10}
                      style={{ width: "30px", marginRight: "3%" }}
                      className="numberAlarm"
                    />
                    amostras
                  </div>
                  <div
                    className="numberAlarm"
                    style={{
                      width: "52px",
                      marginLeft: "3%",
                      color: "#A8A8A8",
                      borderColor: "#E5E5E5",
                    }}
                  >
                    {triggerCondition > 0
                      ? triggerCondition * period
                      : 1 * period}
                    min
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default ModelChart;
