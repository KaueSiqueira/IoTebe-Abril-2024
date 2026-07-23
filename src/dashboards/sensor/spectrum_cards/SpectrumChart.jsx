import React, { useEffect, useRef, useState } from "react";

import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";

import { readSpectrumDataTendency } from "../../../apis";

import { Tooltip } from "@material-ui/core";
import { PanTool } from "@mui/icons-material";
import { FreqHarm, SideBand, Axis, Fullscreen, Refresh } from "../../../assets/customIcons/";

import { Button, Card, Input, SpecTable } from "../../../components";
import { colors, makeSpectrumCsv } from "../../../utilities";
import { CardData } from "../../../components/NoDataLayer";
import { SelectFreqButton } from "./SelectFreqButton";
import { FilterFreqButton } from "./FilterFreqButton";
import { LimitsModal } from "../../cards_content/LimitsModal";

import { DownloadButton } from "../../../components/DownloadButton";

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

function SpectrumChart({
  SpectrumType,
  SpectrumData,
  id,
  spotId,
  time,
  filter,
  source,
  dataId,
  title,
  setFilter,
  tendency,
  fRef,
  freqData,
  lockEffect,
  chartDatasets,
  ampData,
  ampUnit,
  values,
  pageRotation,
  close = false,
  setClose = false,
  setWaveData,
  specType,
  setSpecType
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [size, setSize] = useState("50%");
  const [specSize, setSpecSize] = useState(window.innerHeight > 500 ? "35vh" : "50vh");
  const [loading, setLoading] = useState(false);

  const [yAxis, setYAxis] = useState({ max: null, min: null });
  const [xAxis, setXAxis] = useState({ max: null, min: null });
  const [defaultRotation, setDefautRotaion] = useState({frequency_value: SpectrumData.rotation, type: "rpm"})

  const [classChart, setClassChart] = useState("crosshair");
  const [freqAnnotations, setFreqAnnotations] = useState();
  const [harmAnnotations, setHarmAnnotations] = useState({});
  const [sideBandAnnotations, setSideBandAnnotations] = useState({});
  const [btnState, setBtnState] = useState({ func: undefined, pan: false });
  const [downloadData, setDownloadData] = useState({ headers: [], data: [] });
  const [spectrumData, setSpectrumData] = useState(SpectrumData);
  const [freqFilter, setFreqFilter] = useState(freqData);
  const [globalValues, setGlobalValues] = useState(values);
  const [ID, setID] = useState(id);
  const [mySpectrumChart, setMySpectrumChart] = useState();

  const [amplitude, setAmplitude] = useState(ampData);
  const [amplitudeUnit, setAmplitudeUnit] = useState(ampUnit);
  const [unit, setUnit] = useState("unit");
  const [frequency, setFrequency] = useState("Hz");
  const [legendItems, setLegendItems] = useState([]);

  const fullScreenButton = useRef(null);
  const panButton = useRef(null);
  const harmButtonRef = useRef(null);
  const sideBandButtonRef = useRef(null);
  let sideBandPos = undefined;

  const [open, setOpen] = useState(false);

  const handleTooltip = () => {
    setOpen(!open);
  };


  function fixSpectrumValue(parentSpec = undefined) {
    let tempSpec;
    let value = 0;

    switch(specType){
      case "velocity":
        setUnit("mm/s");
        break
      case "acceleration":
        setUnit("g");
        break
      case "envelope":
        setUnit("gE");
        break
    }

    switch(ampUnit){
      case "RMS":
        value = 1;
        setAmplitude("rms");
        setAmplitudeUnit("RMS");
        break;
      case "PK":
        value = 1.414;
        setAmplitude("pico");
        setAmplitudeUnit("PK");
        break;
      case "PKPK":
        value = 2.828;
        setAmplitude("pico a pico");
        setAmplitudeUnit("PKPK");
        break;
    }
    let objVer = []
    let objHor = []
    let objAxi = []

    if(parentSpec){
      if(SpectrumData?.dataVertical)
        SpectrumData.dataVertical.map((obj) => {
          objVer = [...objVer, {x: obj.x, y: obj.y * value}]
        })
      if(SpectrumData?.dataHorizontal)
        SpectrumData.dataHorizontal.map((obj) => {
          objHor = [...objHor, {x: obj.x, y: obj.y * value}]
        })
      if(SpectrumData?.dataAxial)
        SpectrumData.dataAxial.map((obj) => {
          objAxi = [...objAxi, {x: obj.x, y: obj.y * value}]
        })
      tempSpec = {
        dataAxial: objAxi.length !== 0 ? objAxi : SpectrumData.dataAxial,
        dataHorizontal: objHor.length !== 0 ? objHor : SpectrumData.dataHorizontal,
        dataVertical: objVer.length !== 0 ? objVer : SpectrumData.dataVertical,
        dataRadial: SpectrumData.dataRadial,
        dataTangencial: SpectrumData.dataTangencial,
        rotation: SpectrumData.rotation,
        machineType: SpectrumData.machineType,
        bpfi: SpectrumData.bpfi,
        bpfo: SpectrumData.bpfo,
        bsf: SpectrumData.bsf,
        ftf: SpectrumData.ftf,
        bearingList: SpectrumData.bearingList,
        gmfList: SpectrumData.gmfList,
        divisionCount: SpectrumData.divisionCount
      };
    }
    else {
      if(spectrumData?.dataVertical)
        spectrumData.dataVertical.map((obj) => {
          objVer = [...objVer, {x: obj.x, y: obj.y * value}]
        })
      if(spectrumData?.dataHorizontal)
        spectrumData.dataHorizontal.map((obj) => {
          objHor = [...objHor, {x: obj.x, y: obj.y * value}]
        })
      if(spectrumData?.dataAxial)
        spectrumData.dataAxial.map((obj) => {
          objAxi = [...objAxi, {x: obj.x, y: obj.y * value}]
        })
      tempSpec = {
        dataAxial: objAxi.length !== 0 ? objAxi : spectrumData.dataAxial,
        dataHorizontal: objHor.length !== 0 ? objHor : spectrumData.dataHorizontal,
        dataVertical: objVer.length !== 0 ? objVer : spectrumData.dataVertical,
        dataRadial: spectrumData.dataRadial,
        dataTangencial: spectrumData.dataTangencial,
        rotation: spectrumData.rotation,
        machineType: spectrumData.machineType,
        bpfi: spectrumData.bpfi,
        bpfo: spectrumData.bpfo,
        bsf: spectrumData.bsf,
        ftf: spectrumData.ftf,
        bearingList: spectrumData.bearingList,
        gmfList: spectrumData.gmfList,
        divisionCount: spectrumData.divisionCount
      };
    }
    setSpectrumData(tempSpec);
  }

  function plotSpectrumChart(specData) {
    let yTicksLabel

    yTicksLabel = `${unit} - ${amplitude.toLowerCase()}`;

    const chartData = {
      datasets: tendency ?
        chartDatasets.map((axis) => 
      {if(axis === "VERTICAL") return {
            label: "Vertical",
            fill: false,
            backgroundColor: colors.vRmsBackground,
            borderColor: colors.vRmsIndicator,
            data: spectrumData.dataVertical,
            borderWidth: 0.5,
            pointRadius: 0,
          }
          else if(axis === "HORIZONTAL") return {
            label: "Horizontal",
            fill: false,
            backgroundColor: colors.hRmsBackground,
            borderColor: colors.hRmsIndicator,

            data: spectrumData.dataHorizontal,
            borderWidth: 0.5,
            pointRadius: 0,
          }
          else if(axis === "AXIAL") return {
            label: "Axial",
            fill: false,
            backgroundColor: colors.aRmsBackground,
            borderColor: colors.aRmsIndicator,
            data: spectrumData.dataAxial,
            borderWidth: 0.5,
            pointRadius: 0,
          }}) :
        [
          {
            label: "Vertical",
            fill: false,
            backgroundColor: colors.vRmsBackground,
            borderColor: colors.vRmsIndicator,
            data: spectrumData.dataVertical,
            borderWidth: 0.5,
            pointRadius: 0,
          },
          {
            label: "Horizontal",
            fill: false,
            backgroundColor: colors.hRmsBackground,
            borderColor: colors.hRmsIndicator,

            data: spectrumData.dataHorizontal,
            borderWidth: 0.5,
            pointRadius: 0,
          },
          {
            label: "Axial",
            fill: false,
            backgroundColor: colors.aRmsBackground,
            borderColor: colors.aRmsIndicator,
            data: spectrumData.dataAxial,
            borderWidth: 0.5,
            pointRadius: 0,
          },
        ],
    };

    chartData.datasets.reverse();

    let ctx = document.getElementById(ID);
    !!ctx && (ctx = ctx.getContext("2d"));

    if (mySpectrumChart) {
      mySpectrumChart.destroy();
    }

    let annotations = specType === SpectrumType ? {
      ...freqFilter
    } : {};


    setDownloadData(makeSpectrumCsv(specData));

    if(!!ctx){
      let myChart = new Chart(ctx, {
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

          onClick: undefined,

          interaction: {
            mode: "index",
            axis: "x",
            intersect: false,
          },

          scales: {
            x: {
              type: "linear",
              alignToPixels: true,
              min: 0,
              //max: 6000,
              title: {
                display: true,
                text: `Frequência ${(frequency)}`,
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
              },
            },

            y: {
              type: "linear",
              min: 0,
              beginAtZero: true,

              title: {
                display: true,
                text: yTicksLabel,
              },

              ticks: {
                source: "auto",
              },
            },
          },

          plugins: {
            legend: {
              position: "bottom",
              align: "end",
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
                Chart.defaults.plugins.legend.onClick(event, legendItem, legend);
                refreshLegendItems();
              }
            },

            tooltip: {
              backgroundColor: "rgba(0,0,0,0.4)",
              callbacks: {
                title: ([data]) => {
                  return `${data.label} ${frequency}`;
                },

                label: ({ raw: { y }, dataset: { label } }) => `${label} = ${y.toFixed(4)} ${yTicksLabel}`,
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
                      y: { max },
                    },
                  },
                }) => {
                  if(tendency && chart.options.plugins.annotation.annotations.freq.label)
                    chart.options.plugins.annotation.annotations.freq.label.xAdjust = 11;
                  chart.options.scales.y.max = parseFloat(max);
                  chart.update();
                },

                onZoomStart: e => e.point.x > e.chart.chartArea.left && e.point.x < e.chart.chartArea.right && e.point.y > e.chart.chartArea.top && e.point.y < e.chart.chartArea.bottom
              },


              pan: {
                enabled: true,
                mode: "x",
                onPanStart: e => e.point.x > e.chart.chartArea.left && e.point.x < e.chart.chartArea.right && e.point.y > e.chart.chartArea.top && e.point.y < e.chart.chartArea.bottom
              },

              limits: {
                x: { min: 0, max: "original" },
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

            annotation: {
              annotations: {
                ...annotations,
              },
            },
          },
        },
      });
      setMySpectrumChart(myChart);
      refreshLegendItems(myChart);
    }
  }

  const refreshLegendItems = (myChart) => {
    const legendStates = myChart.legend.legendItems.map((legendItem) => {
      return {
        text: legendItem.text,
        hidden: legendItem.hidden
      };
    });
    setLegendItems(legendStates);
  }

  function toggleResetMode() {
    mySpectrumChart.resetZoom();
    mySpectrumChart.options.scales.y.max = undefined;
    mySpectrumChart.options.scales.y.min = 0;
    mySpectrumChart.options.scales.x.max = undefined;
    mySpectrumChart.options.scales.x.min = 0;
    if(tendency)
      mySpectrumChart.options.plugins.annotation.annotations.freq.label.xAdjust = -12;
    mySpectrumChart.update();
  }

  function togglePanMode() {
    panButton.current.classList.toggle("selected-chart-button");
    const panEnabled = mySpectrumChart.options.plugins.zoom.pan.enabled;
    const zoomEnabled = mySpectrumChart.options.plugins.zoom.zoom.drag.enabled;
    mySpectrumChart.options.plugins.zoom.pan.enabled = !panEnabled;
    mySpectrumChart.options.plugins.zoom.zoom.drag.enabled = !zoomEnabled;

    setBtnState({ func: btnState.func, pan: !panEnabled });

    mySpectrumChart.update();
  }

  function getClickEventPos(e) {
    const points = mySpectrumChart.getElementsAtEventForMode(
      e,
      "index",
      { axis: "xy", intersect: false },
      true
    );
    if (points[0] === undefined) return undefined;
    return spectrumData.dataHorizontal[points[0].index].x;
  }

  function harmonicsHandler(e) {
    const value = getClickEventPos(e);
    if (!value) return;

    const annots = [];
    for (let i = 1; i <= 50; i++) {
      if (value * i <= spectrumData.dataHorizontal[spectrumData.dataHorizontal.length - 1].x) {
        annots.push(
          {
            type: "line",
            scaleID: "x",
            value: value * i - 0.5,
            borderColor: "rgba(0,0,0,0)",
            label: {
              enabled: true,
              content: `${i}X`,
              rotation: -90,
              position: "start",
              textAlign: "start",
              xAdjust: -6,
              backgroundColor: "rgba(0,0,0,0)",
              color: "rgba(24, 185, 185)",
            },
          },
          {
            type: "box",
            scaleID: "x",
            xMin: value * i - 0.5,
            xMax: value * i + 0.5,
            borderColor: "rgba(24, 185, 185, 0.2)",
            backgroundColor: "rgba(24, 185, 185, 0.2)",
          }
        );
      }
    }

    setHarmAnnotations(annots);
  }

  function toggleHarmonics() {
    let f = !mySpectrumChart.options.onClick
      ? (e) => {
        harmonicsHandler(e);
      }
      : undefined;
    mySpectrumChart.options.onClick = f;
    setBtnState({ pan: btnState.pan, func: btnState.func === "harm" ? undefined : "harm" });
    harmButtonRef.current.classList.toggle("selected-chart-button");
    setHarmAnnotations({});
    setSideBandAnnotations({});
  }

  function sideBandHandler(e) {
    const clickPos = getClickEventPos(e);
    if (!clickPos) return;

    if (sideBandPos === undefined) {
      sideBandPos = clickPos;
      setClassChart("sideBandActive");
      setSideBandAnnotations([
        {
          type: "line",
          scaleID: "x",
          value: clickPos - 0.5,
          borderColor: "rgba(0,0,0,0)",
          label: {
            enabled: true,
            content: `0`,
            rotation: -90,
            position: "start",
            textAlign: "start",
            xAdjust: -6,
            backgroundColor: "rgba(0,0,0,0)",
            color: "rgba(24, 185, 185)",
          },
        },
        {
          type: "box",
          scaleID: "x",
          xMin: clickPos - 0.5,
          xMax: clickPos + 0.5,
          borderColor: "rgba(24, 185, 185, 0.2)",
          backgroundColor: "rgba(24, 185, 185, 0.2)",
        },
      ]);
    } else {
      const value = Math.abs(clickPos - sideBandPos);
      const annots = [];
      for (let i = -3; i <= 3; i++) {
        if (
          sideBandPos + value * i <= spectrumData.dataHorizontal[spectrumData.dataHorizontal.length - 1].x &&
          sideBandPos + value * i >= spectrumData.dataHorizontal[0].x
        ) {
          annots.push(
            {
              type: "line",
              scaleID: "x",
              value: sideBandPos + value * i - 0.5,
              borderColor: "rgba(0,0,0,0)",
              label: {
                enabled: true,
                content: `${i}`,
                rotation: -90,
                position: "start",
                textAlign: "start",
                xAdjust: -6,
                backgroundColor: "rgba(0,0,0,0)",
                color: "rgba(24, 185, 185)",
              },
            },
            {
              type: "box",
              scaleID: "x",
              xMin: sideBandPos + value * i - 0.5,
              xMax: sideBandPos + value * i + 0.5,
              borderColor: "rgba(24, 185, 185, 0.2)",
              backgroundColor: "rgba(24, 185, 185, 0.2)",
            }
          );
        }
      }
      sideBandPos = undefined;
      setClassChart("sideBand");
      setSideBandAnnotations(annots);
    }
  }

  function toggleSideBand() {
    let f = !mySpectrumChart.options.onClick
      ? (e) => {
        sideBandHandler(e);
      }
      : undefined;
    mySpectrumChart.options.onClick = f;
    setBtnState({ pan: btnState.pan, func: btnState.func === "side" ? undefined : "side" });
    sideBandButtonRef.current.classList.toggle("selected-chart-button");
    setSideBandAnnotations({});
    setHarmAnnotations({});
  }

  function toggleFullScreen() {
    fullScreenButton.current.classList.toggle("selected-chart-button");
    tendency ? (window.innerHeight > 500 ? setSpecSize((prev) => prev === "35vh" ? "60vh" : "35vh") : setSpecSize((prev) => prev === "50vh" ? "70vh" : "50vh")):
      setSize((prev) => (prev === "50%" ? "100%" : "50%"));
  }

  function toggleModal() {
    const {
      scales: { y, x },
    } = mySpectrumChart;

    setYAxis({ min: y.min, max: y.max });
    setXAxis({ min: x.min, max: x.max });
    setIsModalVisible(!isModalVisible);
    tendency && lockEffect(!isModalVisible);
  }

  function saveLimits() {
    mySpectrumChart.zoomScale("x", { min: xAxis.min, max: xAxis.max }, "zoom");
    mySpectrumChart.zoomScale("y", { min: yAxis.min, max: yAxis.max }, "zoom");

    mySpectrumChart.update();
    toggleModal();
  }

  function ToggleFunc(value) {
    const oper = {
      harm: {
        func: toggleHarmonics,
        ref: harmButtonRef,
      },
      side: {
        func: toggleSideBand,
        ref: sideBandButtonRef,
      },
    };

    let pass = false;
    if (!!btnState.func && btnState.func !== value) {
      //oper[btnState.func].ref.current.classList.toggle("selected-chart-button");
      oper[btnState.func].func();
      pass = true;
    }

    if (btnState.func === undefined || btnState.func === value || pass) {
      //oper[value].ref.current.classList.toggle("selected-chart-button");
      oper[value].func();
      setBtnState({ pan: btnState.pan, func: btnState.func === value ? undefined : value });
    }
  }

  async function handleMetric (event) {
    if(mySpectrumChart.options.plugins.zoom.pan.enabled)
      togglePanMode();
    if(btnState.func === "harm")
      ToggleFunc("harm");
    if(btnState.func === "side")
      ToggleFunc("side");
    setLoading(true);
    let type;
    switch(event.target.value){
      case "Velocidade":
        setSpecType("velocity");
        setUnit("mm/s");
        type = "velocity";
        break;
      case "Aceleração":
        setSpecType("acceleration");
        setUnit("g");
        type = "acceleration";
        break;
      case "Envelope":
        setSpecType("envelope");
        setUnit("gE");
        type = "envelope";
        break;
      default:
        break;
    }
    try {
      const {data} = await readSpectrumDataTendency(spotId, time, type, filter, source);
      let tempData = {
        dataAxial: data.spectrum_axial,
        dataHorizontal: data.spectrum_horizontal,
        dataVertical: data.spectrum_vertical,
        dataRadial: data.spectrum_radial,
        dataTangencial: data.spectrum_tangencial,
        rotation: data.rotation_speed,
        bpfi: data.bpfi,
        bpfo: data.bpfo,
        bsf: data.bsf,
        ftf: data.ftf,
        bearingList: data.bearings_freq,
        gmfList: data.gear_box_gmf_list,
        divisionCount: data.division_count,
        machineType: MACHINE_TYPES_OPTIONS[data.machine_type],
      }

      let tempArray = [];

      if(frequency === "CPM"){
        let objVer = []
        let objHor = []
        let objAxi = []
        if(tempData?.dataVertical){
          tempData.dataVertical.map((obj) => {
            objVer = [...objVer, {x: obj.x*60, y: obj.y}]
          })
          tempData.dataVertical = objVer;
        }
        if(tempData?.dataHorizontal){
          tempData.dataHorizontal.map((obj) => {
            objHor = [...objHor, {x: obj.x*60, y: obj.y}]
          })
          tempData.dataHorizontal = objHor;
        }
        if(tempData?.dataAxial){
          tempData.dataAxial.map((obj) => {
            objAxi = [...objAxi, {x: obj.x*60, y: obj.y}]
          })
          tempData.dataAxial = objAxi;
        }
      }

      if(data.grms_vertical){
        const temp = { label: "V", value: data.grms_vertical.toFixed(3)};
        tempArray = [...tempArray, temp];
      }
      if(data.grms_horizontal){
        const temp = { label: "H", value: data.grms_horizontal.toFixed(3)};
        tempArray = [...tempArray, temp];
      }
      if(data.grms_axial){
        const temp = { label: "A", value: data.grms_axial.toFixed(3)};
        tempArray = [...tempArray, temp];
      }

      setGlobalValues(tempArray);
      setSpectrumData(tempData);
      setWaveData({
        dataAxial: data.wave_axial,
        dataHorizontal: data.wave_horizontal,
        dataVertical: data.wave_vertical,
        dataRadial: data.wave_radial,
        dataTangencial: data.wave_tangencial,
      })
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false);
    }
    lockEffect(false);
  }

  async function handleAmplitude(event) {
    setLoading(true);
    if(!sideBandButtonRef.current.classList.contains("selected-chart-button")){
      sideBandButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    if(!harmButtonRef.current.classList.contains("selected-chart-button")){
      harmButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    let oldUnit = amplitudeUnit;
    let value = 0;
    switch(event.target.value){
      case "RMS":
        if(oldUnit === "PK")
          value = 0.707;
        else if(oldUnit === "PKPK")
          value = 0.3535;
        setAmplitude("RMS");
        setAmplitudeUnit("RMS");
        break;
      case "Pico":
        if(oldUnit === "RMS")
          value = 1.414;
        else if(oldUnit === "PKPK")
          value = 0.5;
        setAmplitude("Pico");
        setAmplitudeUnit("PK");
        break;
      case "Pico a pico":
        if(oldUnit === "PK")
          value = 2;
        else if (oldUnit === "RMS")
          value = 2.828;
        setAmplitude("Pico a pico");
        setAmplitudeUnit("PKPK");
        break;
    }
    let objVer = []
    let objHor = []
    let objAxi = []
    try {
      if(spectrumData?.dataVertical)
        await spectrumData.dataVertical.map((obj) => {
          objVer = [...objVer, {x: obj.x, y: obj.y*value}]
        })
      if(spectrumData?.dataHorizontal)
        await spectrumData.dataHorizontal.map((obj) => {
          objHor = [...objHor, {x: obj.x, y: obj.y*value}]
        })
      if(spectrumData?.dataAxial)
        await spectrumData.dataAxial.map((obj) => {
          objAxi = [...objAxi, {x: obj.x, y: obj.y*value}]
        })
      let tempData = {
        dataAxial: objAxi.length !== 0 ? objAxi : spectrumData.dataAxial,
        dataHorizontal: objHor.length !== 0 ? objHor : spectrumData.dataHorizontal,
        dataVertical: objVer.length !== 0 ? objVer : spectrumData.dataVertical,
        dataRadial: spectrumData.dataRadial,
        dataTangencial: spectrumData.dataTangencial,
        rotation: spectrumData.rotation,
        bpfi: spectrumData.bpfi,
        bpfo: spectrumData.bpfo,
        bsf: spectrumData.bsf,
        ftf: spectrumData.ftf,
        bearingList: spectrumData.bearingList,
        gmfList: spectrumData.gmfList,
        divisionCount: spectrumData.divisionCount,
        machineType: spectrumData.machineType,
      }
      setSpectrumData(tempData);
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false);
    }
    lockEffect(false);
  }

  async function handleUnit(event) {
    setLoading(true);
    if(!sideBandButtonRef.current.classList.contains("selected-chart-button")){
      sideBandButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    if(!harmButtonRef.current.classList.contains("selected-chart-button")){
      harmButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    let freq;
    if(specType === "velocity"){
      switch(event.target.value){
        case "mm/s":
          setUnit("mm/s");
          freq = "mm/s";
          break;
        case "in/s":
          setUnit("in/s");
          freq = "in/s";
          break;
      }
      let objVer = []
      let objHor = []
      let objAxi = []
      let tempGlobal = []
      try {
        if (freq === "mm/s"){
          if(spectrumData?.dataVertical)
            spectrumData.dataVertical.map((obj) => {
              objVer = [...objVer, {x: obj.x, y: obj.y*25.4}]
            })
          if(spectrumData?.dataHorizontal)
            spectrumData.dataHorizontal.map((obj) => {
              objHor = [...objHor, {x: obj.x, y: obj.y*25.4}]
            })
          if(spectrumData?.dataAxial)
            spectrumData.dataAxial.map((obj) => {
              objAxi = [...objAxi, {x: obj.x, y: obj.y*25.4}]
            })
          globalValues.map((obj) => {
            tempGlobal = [...tempGlobal, {label: obj.label, value: (obj.value*25.4).toFixed(3)}]
          })
        }
        else if (freq === "in/s"){
          if(spectrumData?.dataVertical)
            spectrumData.dataVertical.map((obj) => {
              objVer = [...objVer, {x: obj.x, y: obj.y/25.4}]
            })
          if(spectrumData?.dataHorizontal)
            spectrumData.dataHorizontal.map((obj) => {
              objHor = [...objHor, {x: obj.x, y: obj.y/25.4}]
            })
          if(spectrumData?.dataAxial)
            spectrumData.dataAxial.map((obj) => {
              objAxi = [...objAxi, {x: obj.x, y: obj.y/25.4}]
            })
          globalValues.map((obj) => {
            tempGlobal = [...tempGlobal, {label: obj.label, value: (obj.value/25.4).toFixed(3)}]
          })
        }
        let tempData = {
          dataAxial: objAxi?.length > 0 ? objAxi : spectrumData.dataAxial,
          dataHorizontal: objHor?.length > 0 ? objHor : spectrumData.dataHorizontal,
          dataVertical: objVer?.length > 0 ? objVer : spectrumData.dataVertical,
          dataRadial: spectrumData.dataRadial,
          dataTangencial: spectrumData.dataTangencial,
          rotation: spectrumData.rotation,
          bpfi: spectrumData.bpfi,
          bpfo: spectrumData.bpfo,
          bsf: spectrumData.bsf,
          ftf: spectrumData.ftf,
          bearingList: spectrumData.bearingList,
          gmfList: spectrumData.gmfList,
          divisionCount: spectrumData.divisionCount,
          machineType: spectrumData.machineType,
        }
        setGlobalValues(tempGlobal);
        setSpectrumData(tempData);
      }
      catch(error){
        console.log(error)
      }
      finally{
        setLoading(false);
      }
    }
    else if(specType === "acceleration"){
      let oldUnit = unit;
      let value =  0;
      switch(event.target.value){
        case "g":
          if(oldUnit === "mm/s²")
            value = 0.00010197;
          else if(oldUnit === "m/s²")
            value = 0.10197;
          else if(oldUnit === "in/s²")
            value = 0.00259;
          setUnit("g");
          break;
        case "in/s²":
          if(oldUnit === "mm/s²")
            value = 0.03937;
          else if(oldUnit === "m/s²")
            value = 39.37;
          else if(oldUnit === "g")
            value = 386.088582677165;
          setUnit("in/s²");
          break;
        case "m/s²":
          if(oldUnit === "mm/s²")
            value = 0.001;
          else if(oldUnit === "in/s²")
            value = 0.0254;
          else if(oldUnit === "g")
            value = 9.80665;
          setUnit("m/s²");
          break;
        case "mm/s²":
          if(oldUnit === "m/s²")
            value = 1000;
          else if(oldUnit === "in/s²")
            value = 25.4;
          else if(oldUnit === "g")
            value = 9806.65;
          setUnit("mm/s²");
          break;
        default:
          break;
      }
      let objVer = []
      let objHor = []
      let objAxi = []
      let tempGlobal = []
      try {
        if(spectrumData?.dataVertical)
          spectrumData.dataVertical.map((obj) => {
            objVer = [...objVer, {x: obj.x, y: obj.y*value}]
          })
        if(spectrumData?.dataHorizontal)
          spectrumData.dataHorizontal.map((obj) => {
            objHor = [...objHor, {x: obj.x, y: obj.y*value}]
          })
        if(spectrumData?.dataAxial)
          spectrumData.dataAxial.map((obj) => {
            objAxi = [...objAxi, {x: obj.x, y: obj.y*value}]
          })
        globalValues.map((obj) => {
          tempGlobal = [...tempGlobal, {label: obj.label, value: (obj.value*value).toFixed(3)}]
        })
        let tempData = {
          dataAxial: objAxi?.length > 0 ? objAxi : spectrumData.dataAxial,
          dataHorizontal: objHor?.length > 0 ? objHor : spectrumData.dataHorizontal,
          dataVertical: objVer?.length > 0 ? objVer : spectrumData.dataVertical,
          dataRadial: spectrumData.dataRadial,
          dataTangencial: spectrumData.dataTangencial,
          rotation: spectrumData.rotation,
          bpfi: spectrumData.bpfi,
          bpfo: spectrumData.bpfo,
          bsf: spectrumData.bsf,
          ftf: spectrumData.ftf,
          bearingList: spectrumData.bearingList,
          gmfList: spectrumData.gmfList,
          divisionCount: spectrumData.divisionCount,
          machineType: spectrumData.machineType,
        };
        setGlobalValues(tempGlobal);
        setSpectrumData(tempData);
      }
      catch(error){
        console.log(error)
      }
      finally{
        setLoading(false);
      }
    }
    lockEffect(false);
  }

  async function handleFrequency(event) {
    setLoading(true);
    if(!sideBandButtonRef.current.classList.contains("selected-chart-button")){
      sideBandButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    if(!harmButtonRef.current.classList.contains("selected-chart-button")){
      harmButtonRef.current.classList.toggle("selected-chart-button");
      setBtnState({ pan: btnState.pan, func: undefined});
    }
    let freq;
    const sideBandOrHarm =
      sideBandAnnotations.length > 0
        ? {
          annotations: [...sideBandAnnotations],
          refreshAnnotations: setSideBandAnnotations,
        }
        : harmAnnotations.length > 0
          ? {
            annotations: [...harmAnnotations],
            refreshAnnotations: setHarmAnnotations,
          }
          : false;
    switch(event.target.value){
      case "Hz":
        setFrequency("Hz");
        freq = "Hz";
        break;
      case "CPM":
        setFrequency("CPM");
        freq = "CPM";
        break;
      default:
        break;
    }
    let objVer = []
    let objHor = []
    let objAxi = []
    try {
      if (freq === "CPM"){
        if(spectrumData?.dataVertical)
          spectrumData.dataVertical.map((obj) => {
            objVer = [...objVer, {x: obj.x*60, y: obj.y}]
          })
        if(spectrumData?.dataHorizontal)
          spectrumData.dataHorizontal.map((obj) => {
            objHor = [...objHor, {x: obj.x*60, y: obj.y}]
          })
        if(spectrumData?.dataAxial)
          spectrumData.dataAxial.map((obj) => {
            objAxi = [...objAxi, {x: obj.x*60, y: obj.y}]
          })
        setFreqFilter({freq: {
            type: "line",
            scaleID: "x",
            value: freqData.line.xMax*60,
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
              content: `${freqData.line.xMin*60} CPM - ${freqData.line.xMax*60} CPM`,
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
            xMax: freqData.line.xMax*60,
            xMin: freqData.line.xMin*60,
            backgroundColor: "#FABB4132",
            borderColor: "#FABB41",
            drawTime: "beforeDraw",
            borderWidth: 1,
            display: true,
          },});

        if (sideBandOrHarm) {
          for (let i = 0; i < sideBandOrHarm.annotations.length; i++) {
            const objeto = sideBandOrHarm.annotations[i];
            if (objeto.hasOwnProperty("value")) {
              objeto.value = objeto.value * 60;
            }
            if (objeto.hasOwnProperty("xMax")) {
              objeto.xMax = objeto.xMax * 60;
            }
            if (objeto.hasOwnProperty("xMin")) {
              objeto.xMin = objeto.xMin * 60;
            }
          }
        }
      }
      else if (freq === "Hz"){
        if(spectrumData?.dataVertical)
          spectrumData.dataVertical.map((obj) => {
            objVer = [...objVer, {x: obj.x/60, y: obj.y}]
          })
        if(spectrumData?.dataHorizontal)
          spectrumData.dataHorizontal.map((obj) => {
            objHor = [...objHor, {x: obj.x/60, y: obj.y}]
          })
        if(spectrumData?.dataAxial)
          spectrumData.dataAxial.map((obj) => {
            objAxi = [...objAxi, {x: obj.x/60, y: obj.y}]
          })
        setFreqFilter({freq: {
            type: "line",
            scaleID: "x",
            value: freqData.line.xMax,
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
              content: `${freqData.line.xMin} Hz - ${freqData.line.xMax} Hz`,
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
            xMax: freqData.line.xMax,
            xMin: freqData.line.xMin,
            backgroundColor: "#FABB4132",
            borderColor: "#FABB41",
            drawTime: "beforeDraw",
            borderWidth: 1,
            display: true,
          },});

        if (sideBandOrHarm) {
          for (let i = 0; i < sideBandOrHarm.annotations.length; i++) {
            const objeto = sideBandOrHarm.annotations[i];
            if (objeto.hasOwnProperty("value")) {
              objeto.value = objeto.value / 60;
            }
            if (objeto.hasOwnProperty("xMax")) {
              objeto.xMax = objeto.xMax / 60;
            }
            if (objeto.hasOwnProperty("xMin")) {
              objeto.xMin = objeto.xMin / 60;
            }
          }
        }
      }
      let tempData = {
        dataAxial: objAxi?.length > 0 ? objAxi : spectrumData.dataAxial,
        dataHorizontal: objHor?.length > 0 ? objHor : spectrumData.dataHorizontal,
        dataVertical: objVer?.length > 0 ? objVer : spectrumData.dataVertical,
        dataRadial: spectrumData.dataRadial,
        dataTangencial: spectrumData.dataTangencial,
        rotation: spectrumData.rotation,
        bpfi: spectrumData.bpfi,
        bpfo: spectrumData.bpfo,
        bsf: spectrumData.bsf,
        ftf: spectrumData.ftf,
        bearingList: spectrumData.bearingList,
        gmfList: spectrumData.gmfList,
        divisionCount: spectrumData.divisionCount,
        machineType: spectrumData.machineType,
      };
      setSpectrumData(tempData);
      sideBandOrHarm && sideBandOrHarm.refreshAnnotations(sideBandOrHarm.annotations)
    }
    catch(error){
      console.log(error)
    }
    finally{
      setLoading(false);
    }
    lockEffect(false);
  }

  useEffect(() => {
    setSpecSize(window.innerHeight > 500 ? "35vh" : "50vh")
  }, [window.innerHeight])

  useEffect(() => {
    const opts = {
      side: "sideBand",
      harm: "harm",
    };
    let native = "crosshair";
    if (btnState.pan) native = "grab";
    setClassChart(btnState.func !== undefined ? opts[btnState.func] : native);
  }, [btnState]);

  useEffect(() => {
    if (!!spectrumData && !!spectrumData.dataVertical) {
      fixSpectrumValue();
    }
  }, []);

  useEffect(() => {
    setGlobalValues(values);
  }, [values]);

  useEffect(() => {
    if (!!spectrumData && !!spectrumData.dataVertical) {
      plotSpectrumChart(spectrumData);
    }
  }, [spectrumData]);

  useEffect(() => {
    if (mySpectrumChart) {
      fixSpectrumValue(SpectrumData);
    }
    if(btnState.func === "harm")
      ToggleFunc("harm");
    if(btnState.func === "side")
      ToggleFunc("side");
    if(frequency === "CPM"){
      const event = {target: {value: "Hz"}}
      handleFrequency(event);
    }
  }, [SpectrumData]);

  useEffect(() => {
    setHarmAnnotations({});
    harmButtonRef.current.classList.add("selected-chart-button");
    sideBandButtonRef.current.classList.add("selected-chart-button");
    [panButton].forEach((e) => {
      !!e.current && e.current.classList.add("selected-chart-button");
    });
  }, [spotId, SpectrumType, dataId]);

  useEffect(() => {
    if (!!mySpectrumChart && (!!freqAnnotations || !!harmAnnotations || !!sideBandAnnotations)) {
      let filter = specType === SpectrumType ? freqFilter : {};

      mySpectrumChart.options.plugins.annotation.annotations = {
        ...freqAnnotations,
        ...harmAnnotations,
        ...sideBandAnnotations,
        ...filter,
      };
      if(mySpectrumChart._responsiveListeners !== undefined){
        mySpectrumChart.update();
      }
    }
  }, [freqAnnotations, harmAnnotations, sideBandAnnotations, freqFilter, specType]);



  return (
    <>
      {
        tendency ?
          <div className={"transition_smooth"} ref={fRef} style={{ height: specSize, width: "100%", display: "flex", flexDirection: "column" }}>
            {loading && <div className="chart-loading"><div className="chart-loading-animation" /></div>}
            <div
              style={window.innerWidth > 912 ? {
                display: "flex",
                justifyContent: "space-between",
                overflow: "hidden",
                alignItems: "center",
              } :
                {
                  display: "flex",
                  justifyContent: "space-between",
                  overflowX: "auto",
                  overflowY: "hidden",
                  alignItems: "center",
                }
              }
            >
              <h6 className="cardTitle" style={{marginLeft: "1.5em", width: "auto", paddingRight: 15}}>{title}</h6>
              <div className="spectrumOptions" style={{width: "100%", display: "flex", flexDirection: "row", zIndex: 2}}>
                <Input
                  name="metric"
                  options={["Velocidade", "Aceleração", "Envelope"]}
                  value={specType === "velocity" ? "Velocidade" : specType === "acceleration" ? "Aceleração" : "Envelope" }
                  onChange={handleMetric}
                  selectStyle={{
                    boxShadow: "none",
                    fontSize: "0.8rem",
                    fontFamily: "roboto",
                    paddingBlock: 2,
                    borderRadius: 8,
                    paddingLeft: 6,
                    paddingRight: 15,
                    width: "auto",
                    backgroundColor: "#F7F7F7",
                    color: "#000",
                    cursor: "pointer"
                  }}
                />
                <Input
                  name="amplitude"
                  options={["RMS", "Pico", "Pico a pico"]}
                  value={amplitude}
                  onChange={handleAmplitude}
                  selectStyle={{
                    boxShadow: "none",
                    fontSize: "0.8rem",
                    fontFamily: "roboto",
                    paddingBlock: 2,
                    borderRadius: 8,
                    paddingLeft: 6,
                    paddingRight: 15,
                    width: "auto",
                    backgroundColor: "#F7F7F7",
                    color: "#000",
                    cursor: "pointer"
                  }}
                />
                {specType !== "envelope" &&
                  <Input
                    name="unit"
                    options={specType === "velocity" ? ["mm/s", "in/s"] : ["g", "m/s²", "mm/s²", "in/s²"]}
                    value={unit}
                    onChange={handleUnit}
                    selectStyle={{
                      boxShadow: "none",
                      fontSize: "0.8rem",
                      fontFamily: "roboto",
                      paddingBlock: 2,
                      borderRadius: 8,
                      paddingLeft: 6,
                      paddingRight: 15,
                      width: "auto",
                      backgroundColor: "#F7F7F7",
                      color: "#000",
                      cursor: "pointer"
                    }}
                  />}
                <Input
                  name="frequency"
                  options={["Hz", "CPM"]}
                  value={frequency}
                  onChange={handleFrequency}
                  selectStyle={{
                    boxShadow: "none",
                    fontSize: "0.8rem",
                    fontFamily: "roboto",
                    paddingBlock: 2,
                    borderRadius: 8,
                    paddingLeft: 6,
                    paddingRight: 15,
                    width: "auto",
                    backgroundColor: "#F7F7F7",
                    color: "#000",
                    cursor: "pointer"
                  }}
                />
              </div>

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
                  id="harmonics-button"
                  small
                  style={{ padding: "auto", fill: "#fff", backgroundColor: "#156284" }}
                  onClick={() => ToggleFunc("harm")}
                  className="selected-chart-button chart-button"
                  buttonRef={harmButtonRef}
                >
                  <Tooltip title="Harmônicas">
                    <span>
                      <FreqHarm color="white" />
                    </span>
                  </Tooltip>
                </Button>

                <Button
                  id="side-band-button"
                  small
                  style={{ padding: "auto", fill: "white", backgroundColor: "#156284" }}
                  onClick={() => {
                    ToggleFunc("side");
                  }}
                  className="selected-chart-button chart-button"
                  buttonRef={sideBandButtonRef}
                >
                  <Tooltip title="Frequências Laterais">
                    <span>
                      <SideBand />
                    </span>
                  </Tooltip>
                </Button>

                <Button
                  id="limit-button"
                  small
                  style={{ padding: "auto", fill: "white" }}
                  onClick={() => toggleModal()}
                  className="selected-chart-button chart-button"
                >
                  <Tooltip title="Limite eixo X e Y">
                    <span>
                      <Axis />
                    </span>
                  </Tooltip>
                </Button>

                <SelectFreqButton
                  spectrumType={specType}
                  spectrumData={spectrumData}
                  specFrequency={frequency}
                  setFreqAnnotations={setFreqAnnotations}
                  lockEffect={lockEffect}
                  pageRotation={pageRotation}
                  close={close}
                  setClose={setClose}
                />

                {specType === "envelope" && <FilterFreqButton lockEffect={lockEffect} setFilter={setFilter} />}

                <DownloadButton
                  id="download-button"
                  small
                  style={{ fill: "white", width: "25px", height: "25px", borderRadius: "6px", transition: ".3s" }}
                  className="selected-chart-button chart-button"
                  filename="Espectro.csv"
                  headers={downloadData.headers}
                  data={downloadData.data}
                />

                <Button
                  id="fullscreen"
                  small
                  style={{ marginRight: "5px", padding: "auto", fill: "white" , backgroundColor: "#156284" }}
                  onClick={() => toggleFullScreen()}
                  className="selected-chart-button chart-button"
                  buttonRef={fullScreenButton}
                >
                  <Tooltip title="Tela cheia">
                    <Fullscreen />
                  </Tooltip>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden width-100p height-100p" style={{zIndex: 2}}>
              {!!spectrumData && Object.keys(spectrumData).length === 0 ? (
                <CardData title="NÃO HÁ DADOS" />
              ) : (
                <canvas id={ID} className={classChart}></canvas>
              )}
            </div>

            <div className={"transition_smooth"}
              style={specSize === "35vh" ? {zIndex: 2, position: "absolute", marginTop: `${window.innerWidth > 914 ? "31vh" : "31.5vh"}`, width: "60%", marginLeft: `${window.innerWidth > 914 ? "1.5em" : "0"}`, fontFamily: "roboto"} :
                {zIndex: 2, position: "absolute", marginTop: `${window.innerHeight > 500 ? (window.innerWidth > 914 ? "56vh" : "56.5vh") : `calc(${specSize} - 7vh)`}`, width: "60%", fontFamily: "roboto"}}>
              {window.innerWidth < 700 ? <>
                <Tooltip onClose={handleTooltip} open={open} title={<><p style={{ textAlign: "center", fontSize: "12px" }}>Estes valores representam o RMS global do<br />espectro na faixa de 0 a {specType === "envelope" ? "1000" : "6000"}Hz.</p>
                  <br />{globalValues && globalValues.map((gValue, idx) => (<h7 key={idx} style={{ textAlign: "center", fontSize: "12px" }}>{gValue.label}: {gValue.value + unit}</h7>))}</>} placement="top" arrow>
                  <h7 onClick={handleTooltip} style={window.innerWidth > 914 ? { fontSize: "0.85rem", fontWeight: "550", } : { fontSize: "0.55rem", fontWeight: "550" }}>Global (RMS)</h7>
                </Tooltip>
              </> :
                <><Tooltip title={<p style={{ textAlign: "center", fontSize: "12px" }}>Estes valores representam o RMS global do<br/>espectro na faixa de 0 a {specType === "envelope" ? "1000" : "6000"}Hz.</p>} placement="top" arrow>
                    <h7 style={window.innerWidth > 914  ? {fontSize: "0.85rem", fontWeight: "550",} : {fontSize: "0.55rem", fontWeight: "550"}}>Global (RMS): </h7>
                  </Tooltip>
                  {globalValues && globalValues.map((gValue, idx) => (<h7 key={idx} style={window.innerWidth > 914 ? { fontSize: "0.8rem", marginLeft: "1%" } : { fontSize: "0.5rem", marginLeft: "1%" }}>{gValue.label}: {gValue.value + unit}</h7>)
                  )}
                </>}
            </div>

            <LimitsModal
              thereIsX
              thereIsY
              isModalVisible={isModalVisible}
              yAxis={yAxis}
              setYAxis={setYAxis}
              xAxis={xAxis}
              setXAxis={setXAxis}
              freqOrTime={"Frequência"}
              toggle={() => toggleModal()}
              onSave={() => saveLimits()}
            />
          </div>
          :
          <Card className="col-12 transition_smooth" height={size} minHeight="230px">
            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  alignItems: "center",
                }}
              >
                <h6 className="cardTitle">{title}</h6>

                <div className="row-chart-buttons">
                  <Button
                    id="reset-button"
                    small
                    style={{ padding: "auto", fill: "white" }}
                    onClick={() => toggleResetMode()}
                    className="selected-chart-button chart-button"
                    buttonType="chart-button"
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
                    className="selected-chart-button"
                    buttonType="chart-button"
                    buttonRef={panButton}
                  >
                    <Tooltip title="Arrastar">
                      <PanTool fontSize={"inherit"} style={{ fontSize: 12 }} />
                    </Tooltip>
                  </Button>

                  <Button
                    id="harmonics-button"
                    small
                    style={{ padding: "auto", fill: "#fff", backgroundColor: "#156284" }}
                    onClick={() => ToggleFunc("harm")}
                    className="selected-chart-button chart-button"
                    buttonType="chart-button"
                    buttonRef={harmButtonRef}
                  >
                    <Tooltip title="Harmônicas">
                      <span>
                        <FreqHarm />
                      </span>
                    </Tooltip>
                  </Button>

                  <Button
                    id="side-band-button"
                    small
                    style={{ padding: "auto", fill: "#fff", backgroundColor: "#156284" }}
                    onClick={() => {
                      ToggleFunc("side");
                    }}
                    className="selected-chart-button chart-button"
                    buttonType="chart-button"
                    buttonRef={sideBandButtonRef}
                  >
                    <Tooltip title="Frequências Laterais">
                      <span>
                        <SideBand />
                      </span>
                    </Tooltip>
                  </Button>

                  <Button
                    id="limit-button"
                    small
                    style={{ adding: "auto", fill: "#fff" }}
                    onClick={() => toggleModal()}
                    className="selected-chart-button"
                    buttonType="chart-button"
                  >
                    <Tooltip title="Limite eixo X e Y">
                      <span>
                        <Axis />
                      </span>
                    </Tooltip>
                  </Button>

                  <SelectFreqButton
                    spectrumType={SpectrumType}
                    spectrumData={spectrumData}
                    pageRotation={defaultRotation}
                    setFreqAnnotations={setFreqAnnotations}
                    specFrequency={"Hz"}
                  />

                  {SpectrumType === "envelope" && <FilterFreqButton setFilter={setFilter} />}

                  <DownloadButton
                    id="download-button"
                    small
                    style={{ fill: "white", width: "25px", height: "25px", borderRadius: "6px", transition: ".3s" }}
                    className="selected-chart-button"
                    filename="Espectro.csv"
                    headers={downloadData.headers}
                    data={downloadData.data}
                  />

                  <Button
                    id="fullscreen"
                    small
                    style={{ fill: "#fff", backgroundColor: "#156284" }}
                    onClick={() => toggleFullScreen()}
                    className="selected-chart-button"
                    buttonType="chart-button"
                    buttonRef={fullScreenButton}
                  >
                    <Tooltip title="Tela cheia">
                      <Fullscreen />
                    </Tooltip>
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden width-100p height-100p">
                {!!spectrumData && Object.keys(spectrumData).length === 0 ? (
                  <CardData title="NÃO HÁ DADOS" />
                ) : (
                  <canvas id={id} className={classChart} role="canvas" aria-label="MySpectrum"></canvas>
                )}
              </div>

              <LimitsModal
                thereIsX
                thereIsY
                isModalVisible={isModalVisible}
                yAxis={yAxis}
                setYAxis={setYAxis}
                xAxis={xAxis}
                setXAxis={setXAxis}
                freqOrTime={"Frequência"}
                toggle={() => toggleModal()}
                onSave={() => saveLimits()}
              />
            </div>
          </Card>
      }
      <SpecTable
        id={"SpectrumTable"}
        spectrumData={spectrumData}
        sideBandAnnotations={sideBandAnnotations}
        setSideBandAnnotations={setSideBandAnnotations}
        harmAnnotations={harmAnnotations}
        setHarmAnnotations={setHarmAnnotations}
        axis = {legendItems}
        unit={unit}
        amplitude={amplitude}
        specType={specType}
        frequency={frequency}
      />
    </>
  );
}

export default SpectrumChart;
