/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@material-ui/core";
import {
  PanTool,
  MoreVert,
  Settings,
  Delete,
  FiberManualRecord,
  CloseFullscreenRounded,
} from "@mui/icons-material";
import { Axis, Fullscreen, Refresh } from "../../../assets/customIcons";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import {
  automaticAlarm,
  spectrumTendencyPlotChart,
  configSpectralChart,
  getAlarmInfo,
  updateChartAlarms,
  readSpectrumDataTendency,
  deleteChart,
} from "../../../apis";
import axios from "axios";

import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";

import { Button, Card, NoDataLayer, IoTebeModal } from "../../../components";
import { CascateModal } from "../spectrum_cards/CascateModal";
import {
  MyCustomSliderAlarm,
  MyCustomSwitchAlarm,
  MyCustomSwitchAlarmMobile,
} from "./Customizations";
import { colors } from "../../../utilities";
import SpectrumChart from "../spectrum_cards/SpectrumChart";
import WaveFormCard from "../spectrum_cards/WaveFormCard";
import { RightSideMenuContext, WhichRenderContext } from "../../../contexts";
import SpectrumTendencyChartEditModal from "../spectrum_tendency_chart_modal/SpectrumTendencyChartEditModal";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import useVisibility from "../../../hooks/useVisibility";
import useWebSocket from "../../../hooks/useWebSocket";
import ProcessPastData from "./ProcessPastData/ProcessPastData";

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

function SpecChart(props) {
  const [noData, setNoData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(0.33);
  const [specSize, setSpecSize] = useState("31.5%");

  const [yAxisMin, setyAxisMin] = useState(false);
  const [yAxisMax, setyAxisMax] = useState(false);

  const [classChart, setClassChart] = useState("crosshair");
  const [myChart, setMyChart] = useState();

  const [chartDatasets, setChartDatasets] = useState();
  const [chartAxis, setChartAxis] = useState();
  const [alarms, setAlarms] = useState({});
  const [disableAlarm, setDisableAlarm] = useState(0);
  const [disable, setDisable] = useState(0);
  const [alarmAlert, setAlarmAlert] = useState("0");
  const [alarmCritical, setAlarmCritical] = useState("0");
  const [triggerCondition, setTriggerCondition] = useState(1);
  const [disableAlarmBackup, setDisableAlarmBackup] = useState(0);
  const [alarmAlertBackup, setAlarmAlertBackup] = useState("0");
  const [alarmCriticalBackup, setAlarmCriticalBackup] = useState("0");
  const [triggerConditionBackup, setTriggerConditionBackup] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [chartName, setChartName] = useState(" ");
  const [changeModal, setChangeModal] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [autoAlarmModal, setAutoAlarmModal] = useState(null);
  const [graphName, setGraphName] = useState("");
  const [mobileMode, setMobileMode] = useState(false);
  const [autoClicked, setAutoClicked] = useState(false);
  const [alarmSize, setAlarmSize] = useState(false);
  const [cancelToken, setCancelToken] = useState();
  const [spectrumData, setSpectrumData] = useState(undefined);
  const [waveData, setWaveData] = useState(undefined);
  const [filter, setFilter] = useState({ min: 500, max: 6000 });
  const [time, setTime] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [specOn, setSpecOn] = useState(false);
  const [specType, setSpecType] = useState();
  const [amplitude, setAmplitude] = useState();
  const [amplitudeUit, setAmplitudeUnit] = useState();
  const [freq, setFreq] = useState({});
  const [values, setValues] = useState({});
  const [specLine, setSpecLine] = useState();
  const [smoothTransition, setSmoothTransition] = useState(false);
  const [range, setRange] = useState({});
  const [spectrumChartType, setSpectrumChartType] = useState();
  const [zoomScale, setZoomScale] = useState({});
  const [nonProcessedDataCount, setNonProcessedDataCount] = useState(0);
  const [processedDataCount, setProcessedDataCount] = useState(0);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [canProcessData, setCanProcessData] = useState(false);

  const [chartConfig, setChartConfig] = useState({});
  const [cascateAxis, setCascateAxis] = useState({
    type: "vertical",
    label: "Vertical",
  });
  const [cascateMetric, setCascateMetric] = useState({
    type: "envelope",
    label: "Envelope",
  });

  const { addAnomObserver, addTabObserver } = useContext(RightSideMenuContext);
  const {
    setAlarmYellow,
    setAlarmRed,
    warningAlarm,
    setWarningAlarm,
    setSpotPage,
    selectedNode,
  } = useContext(WhichRenderContext);

  const panButton = useRef(null);
  const fullScreenButton = useRef(null);
  const cRef = useRef();
  const sRef = useRef();
  const wRef = useRef();
  const mRef = useRef();

  const [plotData, setPlotData] = useState({});

  const [isFirstLoadData, setIsFirstLoadData] = useState(true);
  const chartDiv = useRef(null);
  const { isVisible } = useVisibility(chartDiv);

  const {
    createtWebSocketConnection,
    onReceiveMessage,
    sendWebSocketMessage,
    closeWebSocketConnection,
  } = useWebSocket();

  const onEnterPress = (target) => {
    target.charCode === 13 && saveLimits();
  };

  const handleTimeSlider = (event, time) => {
    setTriggerCondition(time);

    if (time === 0 || time == null) {
      setDisableAlarm(1);
    } else {
      setDisableAlarm(0);
    }
  };

  const deleteGraph = async () => {
    setLoading(true);
    try {
      await deleteChart(props.chartId);
      await props.reload();
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoading(false);
      setConfigModal(false);
    }
  };

  const updateGraph = async (chartName) => {
    setLoading(true);
    try {
      await configSpectralChart(props.chartId, chartName);
      await myChart.destroy();
      await loadData(props.chartId, props.dateRange);
      setChangeModal(false);
      FeedbackToast.success();
    } catch (error) {
      console.log(error);
      FeedbackToast.error();
    } finally {
      setLoading(false);
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
      console.log("Error", error);
    } finally {
      props.setUpdate(false);
      setLoading(false);
    }
  };

  const autoAlarm = async () => {
    try {
      const res = await automaticAlarm(
        props.chartId,
        props.dateRange,
        false,
        true
      );
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
        FeedbackToast.error();
      }
    } finally {
      setAutoClicked(false);
    }
  };

  const getChartSetup = (axis) => {
    switch (axis) {
      case "VERTICAL":
        return ["Vertical", colors.vRmsBackground, colors.vRmsIndicator];
      case "HORIZONTAL":
        return ["Horizontal", colors.hRmsBackground, colors.hRmsIndicator];
      case "AXIAL":
        return ["Axial", colors.aRmsBackground, colors.aRmsIndicator];
      case "RADIAL":
        return ["Radial", colors.rRmsBackground, colors.rRmsIndicator];
      case "TANGENCIAL":
        return ["Tangencial", colors.tempBackground, colors.tempIndicator];
      default:
        return ["Eixo", colors.tempBackground, colors.tempIndicator];
    }
  };

  const processChart = (receivedData) => {
    setPlotData(receivedData);
  };

  const processNewData = (receivedData) => {
    setPlotData((previousState) => {
      const prevData = { ...previousState };

      const newData = [
        {
          axis: receivedData.axis,
          data: [
            {
              x: receivedData.x * 1000,
              y: receivedData.y,
            },
          ],
        },
      ];

      const updatedData = (previousState?.data || []).reduce((acc, axis) => {
        const foundIndex = newData.findIndex(
          (newAxis) => newAxis.axis === axis.axis
        );

        if (foundIndex >= 0) {
          const updatedAxisData = [...axis.data, ...newData[foundIndex].data];

          acc.push({ axis: axis.axis, data: updatedAxisData });
          newData.splice(foundIndex, 1);
        } else {
          acc.push(axis);
        }
        return acc;
      }, []);

      if (newData.length > 0) {
        updatedData.push(...newData);
      }

      return { ...prevData, data: updatedData };
    });
  };

  const loadData = async (chartId, dateRange) => {
    try {
      setLoading(true);

      const { webSocketConnection, accessToken } =
        await createtWebSocketConnection();

      onReceiveMessage(webSocketConnection, (event) => {
        try {
          const receivedData = JSON.parse(event.data);

          setCanProcessData(receivedData.non_processed_data_count > 0);
          setNonProcessedDataCount(receivedData.non_processed_data_count);
          processChart(receivedData);

          closeWebSocketConnection(webSocketConnection);
        } catch (error) {
          console.log("Error:", error);
        }
      });

      const messageToSend = {
        action: "getchartdata",
        chart_id: chartId,
        access_token: accessToken,
        start_date: Math.floor(dateRange.startDate / 1000),
        end_date: Math.floor(dateRange.endDate / 1000),
        process_data: false,
      };

      sendWebSocketMessage(webSocketConnection, messageToSend);

      const alarm = await getAlarmInfo(chartId);
      const disable = alarm.data.disable_alarm;
      const alarmAnnot = alarmToAnnot(
        alarm.data.alarm_alert,
        alarm.data.alarm_critical
      );

      setAlarms(alarmAnnot);
      setDisable(disable);
      setDisableAlarm(alarm.data.disable_alarm);
      setAlarmAlert(alarm.data.alarm_alert);
      setAlarmCritical(alarm.data.alarm_critical);
      setTriggerCondition(alarm.data.trigger_condition);
      setDisableAlarmBackup(alarm.data.disable_alarm);
      setAlarmAlertBackup(alarm.data.alarm_alert);
      setAlarmCriticalBackup(alarm.data.alarm_critical);
      setTriggerConditionBackup(alarm.data.trigger_condition);
    } catch (error) {
      console.log("Error:", error);
      setNoData(true);
      setLoading(false);
    } finally {
      props.onLoad(true);
    }
  };

  const processPastData = async (chartId, dateRange) => {
    setIsProcessingData(true);
    try {
      const { webSocketConnection, accessToken } =
        await createtWebSocketConnection();

      onReceiveMessage(webSocketConnection, (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          setProcessedDataCount((prev) => {
            if (prev + 1 >= receivedData.non_processed_data_count) {
              setIsProcessingData(false);
              setNonProcessedDataCount(0);
              setTimeout(() => {
                closeWebSocketConnection(webSocketConnection);
                setCanProcessData(false);
              }, 1000);
            } else {
              setNonProcessedDataCount(receivedData.non_processed_data_count);
              setCanProcessData(true);
            }
            return prev + 1;
          });
          processNewData(receivedData);
        } catch (error) {
          console.log("Error:", error);
        }
      });

      const messageToSend = {
        action: "getchartdata",
        chart_id: chartId,
        access_token: accessToken,
        start_date: Math.floor(dateRange.startDate / 1000),
        end_date: Math.floor(dateRange.endDate / 1000),
        process_data: true,
      };

      sendWebSocketMessage(webSocketConnection, messageToSend);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if ("labels" in plotData) {
      let axis = [];
      let chartData = {
        datasets: [],
      };

      chartData.datasets = plotData.data.map((axisData) => {
        axis = [...axis, axisData.axis];
        let finalData = axisData.data;
        finalData.sort((a, b) => (a.x > b.x ? 1 : -1));

        const [chartLabel, chartBackgroundColor, chartBorderColor] =
          getChartSetup(axisData.axis);
        return {
          label: chartLabel,
          fill: true,
          backgroundColor: chartBackgroundColor,
          borderColor: chartBorderColor,
          data: finalData,
          pointRadius: 0,
          borderWidth: 0.5,
        };
      });

      const order = {
        Vertical: 1,
        Horizontal: 2,
        Axial: 3,
        Radial: 4,
        Tangencial: 5,
        Eixo: 6,
      };

      chartData.datasets.sort((a, b) => {
        return order[a.label] - order[b.label];
      });

      const largestDataset = chartData.datasets.reduce((prev, current) => {
        return prev.data && prev.data.length > current.data.length
          ? prev
          : current;
      }, {});

      let size = largestDataset.data || [];

      let range;

      if (size.length) {
        setNoData(false);
        if (size[0].x - props.dateRange.startDate.getTime() > 86400000) {
          range = {
            min: props.dateRange.startDate,
            max: size[size.length - 1].x + 1500000,
          };
        } else {
          range = {
            min: size[0].x - 100000,
            max: size[size.length - 1].x + 1500000,
          };
        }
      } else {
        if (plotData.non_processed_data_count === 0) {
          setNoData(true);
        }

        range = {
          min: props.dateRange.startDate,
          max: props.dateRange.endDate,
        };
      }

      setRange(range);

      if (!myChart) {
        setChartName(plotData.chart_name);
        setGraphName(plotData?.chart_name);
        setChartConfig(plotData?.chart_config);
        setChartDatasets(chartData.datasets[0]);
        setChartAxis(axis);
        const freqs = freqAnnot(plotData.chart_config);
        setFreq(freqs);
        const annot = madeAnnotation(plotData.annotations);
        setAnnotations(annot);
        plotChartGraph(
          chartData,
          alarms,
          annot,
          plotData.unit,
          disable,
          plotData.chart_config,
          range
        );
      } else {
        myChart.data.datasets = [...chartData.datasets];
        myChart.options.scales.x.max = zoomScale.xMax || range.max;
        myChart.options.scales.x.min = zoomScale.xMin || range.min;

        myChart.options.scales.x.time.unit =
          zoomScale.xTimeUnit || props.dateType;
        myChart.options.scales.y.max = zoomScale.yMax;
        myChart.update();
      }
    }
  }, [plotData]);

  const loadSpec = async (spotId, time, specType, filter, source) => {
    try {
      const { data } = await readSpectrumDataTendency(
        spotId,
        time,
        specType,
        filter,
        source
      );
      let tempArray = [];

      const MACHINE_TYPES_OPTIONS = [
        "Selecione",
        "Motor Elétrico",
        "Bomba Centrífuga",
        "Ventilador/Exaustor",
        "Turbina a Vapor",
        "Redutor",
        "Gerador",
        "Rotores em Geral",
        "Outros",
      ];

      if (data.grms_vertical) {
        const temp = { label: "V", value: data.grms_vertical.toFixed(3) };
        tempArray = [...tempArray, temp];
      }
      if (data.grms_horizontal) {
        const temp = { label: "H", value: data.grms_horizontal.toFixed(3) };
        tempArray = [...tempArray, temp];
      }
      if (data.grms_axial) {
        const temp = { label: "A", value: data.grms_axial.toFixed(3) };
        tempArray = [...tempArray, temp];
      }

      setValues(tempArray);

      setSpectrumData({
        dataAxial: data.spectrum_axial,
        dataHorizontal: data.spectrum_horizontal,
        dataVertical: data.spectrum_vertical,
        dataRadial: data.spectrum_radial,
        dataTangencial: data.spectrum_tangencial,
        rotation: data.rotation_speed,
        passingFrequency: data.passing_frequency,
        machineType: MACHINE_TYPES_OPTIONS[data.machine_type],
        bpfi: data.bpfi,
        bpfo: data.bpfo,
        bsf: data.bsf,
        ftf: data.ftf,
        bearingList: data.bearings_freq,
      });

      setWaveData({
        dataAxial: data.wave_axial,
        dataHorizontal: data.wave_horizontal,
        dataVertical: data.wave_vertical,
        dataRadial: data.wave_radial,
        dataTangencial: data.wave_tangencial,
      });
      setSize("auto");
      window.innerHeight > 500 ? setSpecSize("35vh") : setSpecSize("50vh");
      setShowChart(true);
      setSpecOn(true);
    } catch (error) {
      setSpectrumData({});
      setWaveData({});
    } finally {
      setLoading(false);
      props.setLock && props.setLock(false);
    }
  };

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

  const freqAnnot = (freqData) => {
    return {
      freq: {
        type: "line",
        scaleID: "x",
        value: freqData.max_freq,
        backgroundColor: "#FABB41",
        drawTime: "beforeDraw",
        borderWidth: 0,
        display: true,
        label: {
          font: {
            family: "Roboto",
            size: 10,
          },
          enabled: true,
          content: `${freqData.min_freq} Hz - ${freqData.max_freq} Hz`,
          position: "start",
          textAlign: "start",
          xAdjust: -12,
          rotation: 90,
          backgroundColor: "rgba(0,0,0,0)",
          color: "#FABB41",
        },
      },
      line: {
        type: "box",
        scaleID: "x",
        xMax: freqData.max_freq,
        xMin: freqData.min_freq,
        backgroundColor: "#FABB4132",
        borderColor: "#FABB41",
        drawTime: "beforeDraw",
        borderWidth: 1,
        display: true,
      },
    };
  };

  const specLineAnnot = (value) => {
    return {
      specLine: {
        type: "line",
        scaleID: "x",
        value: value,
        borderColor: "#FABB41",
        backgroundColor: "#FABB41",
        drawTime: "afterDraw",
        borderWidth: 1,
        display: true,
      },
    };
  };

  function plotChartGraph(
    chartData,
    alarmAnnot,
    annotationData,
    unit,
    disable,
    chartConfig,
    range
  ) {
    let ctx = document.getElementById(props.chartId);
    setLoading(true);
    let ampName;

    switch (chartConfig.amplitude) {
      case "PK":
        ampName = "pico";
        break;
      case "PKPK":
        ampName = "pico a pico";
        break;
      case "RMS":
        ampName = "rms";
        break;
      default:
        break;
    }

    !!ctx && (ctx = ctx.getContext("2d"));

    if (!!ctx) {
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

            beforeEvent: (chart, args, pluginOptions) => {
              const event = args.event;
              if (
                event.type === "mouseup" &&
                event.native.target.style.cursor !== "pointer"
              ) {
                handleSpec(
                  chart.tooltip.dataPoints[0].raw.x,
                  chart.tooltip.dataPoints
                );
                props.setClose(props.index);
              }
            },
          },
        ],

        options: {
          spanGaps: true,
          animation: false,
          parsing: false,
          maintainAspectRatio: false,
          responsive: true,

          events: [
            "mousemove",
            "mouseout",
            "click",
            "touchstart",
            "touchmove",
            "mousedown",
            "mouseup",
          ],

          interaction: {
            mode: "index",
            axis: "xy",
            intersect: false,
          },

          scales: {
            x: {
              type: "time",
              alignToPixels: true,
              min: range.min,
              max: range.max,

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
                text: `${unit} - ${ampName}`,
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

              onClick: (event, legendItem, legend) => {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                if (event.type === "click") {
                  if (ci.isDatasetVisible(index)) {
                    ci.hide(index);
                    legendItem.hidden = true;
                  } else {
                    ci.show(index);
                    legendItem.hidden = false;
                  }
                }
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
                  setZoomScale({
                    yMax: parseFloat(maxY),
                    xMin: scalesX.min,
                    xMax: scalesX.max,
                    xTimeUnit: chart.options.scales.x.time.unit,
                  });
                  chart.update();
                },
              },

              pan: {
                enabled: true,
                mode: "x",
              },

              limits: {
                x: { min: range.min, max: range.max },
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
      setLoading(false);
    }
  }

  function toggleResetMode() {
    setZoomScale({
      yMax: undefined,
      xMin: range.min,
      xMax: range.max,
      xTimeUnit: props.dateType,
    });
    myChart.options.scales.x.time.unit = props.dateType;
    myChart.options.scales.x.time.tooltipFormat = "DD/MM/YYYY HH:mm";
    myChart.options.scales.y.max = undefined;
    myChart.options.scales.y.min = 0;
    myChart.options.scales.x.max = range.max;
    myChart.options.scales.x.min = range.min;
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
    if (specOn) {
      window.innerHeight > 500
        ? setSpecSize((prev) => (prev === "35vh" ? "60vh" : "35vh"))
        : setSpecSize((prev) => (prev === "50vh" ? "70vh" : "50vh"));
    } else {
      setSize((prev) => (prev === 0.33 ? 1 : 0.33));
    }
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

  const handleSpec = async (timestamp, data) => {
    const line = specLineAnnot(timestamp);
    setSpectrumData({});
    setWaveData({});
    props.setLock && props.setLock(true);
    setTime(timestamp);
    let type = "";
    let amp = "RMS";
    let ampUnit;
    setLoading(true);
    const res = await spectrumTendencyPlotChart(props.chartId, props.dateRange);
    ampUnit = res.data.chart_config.amplitude;
    if (ampUnit === "PK") amp = "Pico";
    else if (ampUnit === "PKPK") amp = "Pico a pico";
    if (res.data.chart_config.metric === "VELOCIDADE") {
      type = "velocity";
    } else if (res.data.chart_config.metric === "ACELERACAO") {
      type = "acceleration";
    } else if (res.data.chart_config.metric === "ENVELOPE") {
      type = "envelope";
    }
    if (!fullScreenButton.current.classList?.contains("selected-chart-button"))
      toggleFullScreen();
    setSpecLine(line);
    setSpecType(type);
    setSpectrumChartType(type);
    setAmplitude(amp);
    setAmplitudeUnit(ampUnit);
    loadSpec(
      props.spotId,
      timestamp / 1000,
      type,
      filter,
      axios.CancelToken.source()
    );
  };

  const closeSpec = async () => {
    if (!fullScreenButton.current.classList.contains("selected-chart-button"))
      fullScreenButton.current.classList.toggle("selected-chart-button");
    setSpecLine({});
    setSize(0.33);
    setShowChart(false);
    setSpecOn(false);
    setSpectrumData({});
    setWaveData({});
  };

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      loadSpec(
        props.spotId,
        time / 1000,
        spectrumChartType,
        filter,
        axios.CancelToken.source()
      );
    }
  }, [filter]);

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
  }, [isVisible]);

  useEffect(() => {
    if (!!myChart) {
      const changeAlarm = alarmToAnnot(alarmAlert, alarmCritical);

      const alarm =
        props.filterAnnotations.includes("alarm") && disableAlarm === 0
          ? changeAlarm
          : {};
      const annot = props.filterAnnotations.includes("annot")
        ? annotations
        : {};
      const diagnosticAlarm =
        props?.alarmedAnnotations?.length > 0 ? props.alarmedAnnotations : {};

      let tmp = {
        ...alarm,
        ...annot,
        ...specLine,
        ...diagnosticAlarm,
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
  }, [
    props.filterAnnotations,
    alarmCritical,
    alarmAlert,
    disableAlarm,
    specLine,
  ]);

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
  }, [props.saveAnnotation]);

  useEffect(() => {
    setMobileMode(props.alarmMode && window.innerWidth < 992);
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
    if (props.update === true && !isFirstLoadData) updateAlarm();
    if (props.cancel === true) {
      setDisableAlarm(disableAlarmBackup);
      setAlarmAlert(alarmAlertBackup);
      setAlarmCritical(alarmCriticalBackup);
      setTriggerCondition(triggerConditionBackup);
      props.setCancel(false);
    }
  }, [props.update, props.cancel]);

  useEffect(() => {
    setLoading(true);
    setShowChart(false);
    if (!!cancelToken) {
      cancelToken.cancel("cancelado");
    }
    setCancelToken(axios.CancelToken.source());
    return () => setLoading(true);
  }, [props.dataId, specType]);

  const metricConfig = {
    VELOCIDADE: { label: "Velocidade", type: "velocity" },
    ACELERACAO: { label: "Aceleração", type: "acceleration" },
    ENVELOPE: { label: "Envelope", type: "envelope" },
  };

  useEffect(() => {
    if (chartAxis) {
      if (chartAxis.includes("VERTICAL"))
        setCascateAxis({ label: "Vertical", type: "vertical" });
      else if (chartAxis.includes("HORIZONTAL"))
        setCascateAxis({ label: "Horizontal", type: "horizontal" });
      else setCascateAxis({ label: "Axial", type: "axial" });
    }
    setCascateMetric(metricConfig[chartConfig.metric]);
  }, [chartAxis, chartConfig]);

  useEffect(() => {
    if (specOn) {
      const timeoutId = setTimeout(() => {
        setSmoothTransition(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setSmoothTransition(false);
    }
  }, [specOn]);

  useEffect(() => {
    props?.startExpanded && toggleFullScreen();
  }, [props?.startExpanded]);

  return (
    <Card
      isVisible={!isFirstLoadData}
      chartDivRef={chartDiv}
      className="col-12 transition_smooth chart-card"
      style={loading && !showChart && !specOn && { boxShadow: "none" }}
      ref={sRef}
      flexD="column"
      height={
        mobileMode
          ? "auto"
          : typeof size === "number"
          ? size * (props.windowSize - 120) + "px"
          : size
      }
      minHeight="200px"
    >
      {loading && (
        <div className="chart-loading">
          <div className="chart-loading-animation" />
        </div>
      )}
      {changeModal && (
        <SpectrumTendencyChartEditModal
          changeModal={changeModal}
          setChangeModal={setChangeModal}
          chartConfig={chartConfig}
          updateGraph={updateGraph}
          canEdit={selectedNode.permission !== "VIEW"}
        />
      )}
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
      {autoAlarmModal !== null && (
        <IoTebeModal
          showModal={true}
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
      )}
      <div
        ref={mRef}
        className={smoothTransition ? "transition_smooth" : ""}
        style={
          mobileMode
            ? specOn
              ? {
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }
              : {
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }
            : specOn
            ? {
                height: specSize,
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }
            : {
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                position: "relative",
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
            style={
              window.innerWidth > 912
                ? {
                    display: "flex",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    alignItems: "center",
                  }
                : {
                    display: "flex",
                    justifyContent: "space-between",
                    overflowX: "auto",
                    overflowY: "hidden",
                    alignItems: "center",
                  }
            }
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
                  marginTop: selectedNode.permission === "VIEW" ? "8%" : "",
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
                {selectedNode.permission !== "VIEW" && !props.blockDelete && (
                  <>
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
                  </>
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
                <CascateModal
                  metric={cascateMetric}
                  specAxis={cascateAxis}
                  time={time}
                  setPage={setSpotPage}
                  spotId={props.spotId}
                  spectrumListData={props.spectrumListData}
                  setCascateAPI={props.setCascateAPI}
                  specChart={true}
                />

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

                <Button
                  id="fullscreen"
                  small
                  style={{ fill: "#fff", backgroundColor: "#156284" }}
                  onClick={() => toggleFullScreen()}
                  className="selected-chart-button chart-button"
                  buttonRef={fullScreenButton}
                >
                  <Tooltip title="Tela cheia">
                    <Fullscreen />
                  </Tooltip>
                </Button>

                {specOn && (
                  <Button
                    id="close"
                    small
                    style={{
                      fill: "#fff",
                      backgroundColor: "#156284",
                      width: "25px",
                      height: "25px",
                    }}
                    onClick={() => closeSpec()}
                    className="selected-chart-button chart-button"
                  >
                    <Tooltip title="Fechar gráfico">
                      <CloseFullscreenRounded style={{ width: 16 }} />
                    </Tooltip>
                  </Button>
                )}
              </div>
            )}
          </div>

          <NoDataLayer noData={noData}>
            <canvas
              id={props.chartId}
              className={classChart}
              maxHeight="140px"
              role="canvas"
              aria-label="myCanvas"
            ></canvas>
            {props.showAlarmLegend && window.innerWidth > 700 && (
              <ul
                className="alarm-legend"
                style={{
                  gap: window.innerWidth < 700 && 12,
                  gridGap: window.innerWidth < 700 && 12,
                  bottom: window.innerWidth < 700 && "5.5px",
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
                className="rounded-button-outlined"
                cancel={true}
                onClick={() => toggleModal()}
              >
                Cancelar
              </Button>
              <Button className="rounded-button" onClick={() => saveLimits()}>
                Salvar
              </Button>
            </ModalFooter>
          </Modal>

          {!props.showAlarmLegend && (
            <ProcessPastData
              processedDataCount={processedDataCount}
              nonProcessedDataCount={nonProcessedDataCount}
              processPastDataFunction={() => {
                if (
                  nonProcessedDataCount > 0 &&
                  !isProcessingData &&
                  canProcessData
                ) {
                  processPastData(props.chartId, props.dateRange);
                }
              }}
              isProcessingData={isProcessingData}
              canProcessData={canProcessData}
            />
          )}
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
                      if (parseFloat(e.target.value) > alarmAlert)
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
                      ? triggerCondition +
                        (triggerCondition === 1 ? " dia" : " dias")
                      : 1 + " dia"}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {showChart && specOn && (
        <>
          <hr style={{ margin: "1% 0" }} />
          <SpectrumChart
            id={"Spectrum" + props.index}
            title={"Espectro"}
            SpectrumData={spectrumData}
            SpectrumType={specType}
            spotId={props.spotId}
            time={time / 1000}
            filter={filter}
            source={axios.CancelToken.source()}
            dataId={props.dataId}
            setFilter={setFilter}
            tendency={true}
            lockEffect={() => {}}
            freqData={freq}
            fRef={sRef}
            values={values}
            ampData={amplitude}
            ampUnit={amplitudeUit}
            chartDatasets={chartAxis}
            pageRotation={props.rotation}
            close={props.close}
            setClose={props.setClose}
            setWaveData={setWaveData}
            specType={spectrumChartType}
            setSpecType={setSpectrumChartType}
          />
          <hr style={{ margin: "1% 0" }} />
          <WaveFormCard
            id={"Wave" + props.index}
            title={"Forma de Onda"}
            WaveData={waveData}
            SpectrumType={spectrumChartType}
            spotId={props.spotId}
            dataId={props.dataId}
            tendency={true}
            lockEffect={() => {}}
            fRef={wRef}
            chartDatasets={chartAxis}
          />
        </>
      )}
    </Card>
  );
}

export default SpecChart;
