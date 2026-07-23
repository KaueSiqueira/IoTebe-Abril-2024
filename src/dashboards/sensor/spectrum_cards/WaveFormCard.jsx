import React, { useEffect, useRef, useState } from "react";

import { Tooltip } from "@material-ui/core";
import { PanTool } from "@mui/icons-material";
import { Axis, Fullscreen, Period, Refresh } from "../../../assets/customIcons/";
import Chart from "chart.js/auto";
import CrosshairPlugin from "chartjs-plugin-crosshair";

import { Button, Card, Input } from "../../../components";
import { CardData } from "../../../components/NoDataLayer";
import { colors } from "../../../utilities";
import { LimitsModal } from "../../cards_content/LimitsModal";
import { makeSpectrumCsv } from "../../../utilities";
import { DownloadButton } from "../../../components/DownloadButton";


function WaveFormCard({ SpectrumType, WaveData, id, spotId, dataId, title, tendency, fRef, lockEffect, chartDatasets}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [size, setSize] = useState("50%");
  const [specSize, setSpecSize] = useState(window.innerHeight > 500 ? "35vh" : "50vh");
  const [waveData, setwaveData] = useState(WaveData);
  const [unit, setUnit] = useState("g");
  const [loading, setLoading] = useState(false);
  const [annot, setAnnot] = useState({});
  const [ID, setId] = useState(id)

  const [yAxis, setYAxis] = useState({ max: null, min: null });
  const [xAxis, setXAxis] = useState({ max: null, min: null });

  const [classChart, setClassChart] = useState("crosshair");
  const [waveChart, setWaveChart] = useState();

  const [downloadData, setDownloadData] = useState({ headers: [], data: [] });

  const periodButton = useRef(null);
  const panButton = useRef(null);
  const fullScreenButton = useRef(null);

  let myChart;

  function plotSpectrumChart(waveData) {
    const yTicksLabel = SpectrumType === "envelope" ? "gE" : unit;

    const chartData = {
      datasets:
      tendency ?
        chartDatasets.map((axis) => 
      {if(axis === "VERTICAL") return {
          label: "Vertical",
          fill: false,
          backgroundColor: colors.vRmsBackground,
          borderColor: colors.vRmsIndicator,
          data: waveData.dataVertical,
          borderWidth: 0.5,
          pointRadius: 0,
        }
        else if(axis === "HORIZONTAL") return {
          label: "Horizontal",
          fill: false,
          backgroundColor: colors.hRmsBackground,
          borderColor: colors.hRmsIndicator,

          data: waveData.dataHorizontal,
          borderWidth: 0.5,
          pointRadius: 0,
        }
        else if(axis === "AXIAL") return {
          label: "Axial",
          fill: false,
          backgroundColor: colors.aRmsBackground,
          borderColor: colors.aRmsIndicator,
          data: waveData.dataAxial,
          borderWidth: 0.5,
          pointRadius: 0,
        }}) : [
        {
          label: "Vertical",
          fill: false,
          backgroundColor: colors.vRmsBackground,
          borderColor: colors.vRmsIndicator,
          data: waveData.dataVertical,
          borderWidth: 0.5,
          pointRadius: 0,
        },
        {
          label: "Horizontal",
          fill: false,
          backgroundColor: colors.hRmsBackground,
          borderColor: colors.hRmsIndicator,
          data: waveData.dataHorizontal,
          borderWidth: 0.5,
          pointRadius: 0,
        },
        {
          label: "Axial",
          fill: false,
          backgroundColor: colors.aRmsBackground,
          borderColor: colors.aRmsIndicator,
          data: waveData.dataAxial,
          borderWidth: 0.5,
          pointRadius: 0,
        },
      ],
    };

    chartData.datasets.reverse();

    var ctx = document.getElementById(ID);
    !!ctx && (ctx = ctx.getContext("2d"));

    if (myChart !== undefined) {
      myChart.destroy();
    }


    if(!!ctx){
      myChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        plugins: [
          CrosshairPlugin,
          {
            beforeInit: (chart) => {
              chart.options.plugins.zoom.pan.enabled = false;
            },

            afterEvent: (chart, args) => {
              const event = args.event;

              if (event.type === 'click' && tendency && event.native.target.style.cursor !== "pointer") {
                !periodButton.current.classList.contains("selected-chart-button") && setPeriod(parseFloat(chart.tooltip.dataPoints[0].raw.x))
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

          events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'mousedown', 'mouseup'],

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
              bounds: 'data',

              title: {
                display: true,
                text: "Tempo (s)",
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
                text: yTicksLabel,
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
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                if(event.type === 'click'){
                  if (ci.isDatasetVisible(index)) {
                      ci.hide(index);
                      legendItem.hidden = true;
                  } else {
                      ci.show(index);
                      legendItem.hidden = false;
                  }
                }
              }
            },

            tooltip: {
              backgroundColor: "rgba(0,0,0,0.4)",

              callbacks: {
                title: ([data]) => {
                  return `${data.label} s`;
                },

                label: ({ raw: { y }, dataset: { label } }) => `${label} = ${y.toFixed(4)} ${unit}`,
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
                  chart: {
                    scales: {
                      y: { max, min },
                    },
                  },
                }) => {
                  myChart.options.scales.y.max = parseFloat(max);
                  myChart.options.scales.y.min = parseFloat(min);
                  myChart.update();
                },
              },

              pan: {
                enabled: true,
                mode: "x",
              },

              limits: {
                x: { min: 0 },
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
              annotations: annot,
            },
          },
        },
      });
      setWaveChart(myChart);
    }
  }

  const makePeriodAnnotation = (value, space, first) => {
    return {
      type: "line",
      scaleID: "x",
      borderWidth: first ? 3 : 1,
      value: value,
      borderColor: "rgba(34, 219, 174, 0.8)",
      drawTime: "afterDatasetsDraw",
      display: true,
      label: {
        display: first,
        enabled: first,
        backgroundColor: "rgba(119, 119, 119, 0.8)",
        color: 'white',
        borderWidth: 0,
        font: {
          size: 17,
          weight: 600,
        },
        drawTime: 'afterDraw',
        content: [`Δt = ${(space + "").replace('.', ',')} s`,`f = ${((1/space).toFixed(3) + "").replace('.', ',')} Hz`],
        textAlign: 'center',
        xAdjust: -70,
        padding: {
          top: 7,
          left: 10,
          right: 10,
          bottom: 7,
        }
      },
      //enter: (ctx, event) => {toggleLabel(ctx, event, value);},
      //leave: (ctx, event) => {toggleLabel(ctx, event, value);},
    }
  };

  function toggleLabel(ctx, event, value) {
    const chart = ctx.chart;
    chart.options.plugins.tooltip.enabled = !chart.options.plugins.tooltip.enabled;
    const annotationOpts = chart.options.plugins.annotation.annotations.find( annot => annot.value === value);
    annotationOpts.borderWidth = annotationOpts.borderWidth === 1 ? 3 : 1;
    annotationOpts.label.enabled = !annotationOpts.label.enabled;
    annotationOpts.label.position = "center";
    chart.update();
  }

  function setPeriod(x) {
    if(myChart.options.plugins.annotation.annotations.firstLine?.value === undefined){
      myChart.options.plugins.annotation.annotations = {
          firstLine: {
            type: "line",
            scaleID: "x",
            borderWidth: 3,
            value: x,
            borderColor: "rgba(34, 219, 174, 0.8)",
            drawTime: "afterDraw",
            display: true,
          }
      }
      myChart.update();
    }
    else if(myChart.options.plugins.annotation.annotations.firstLine?.value !== undefined && (x !== myChart.options.plugins.annotation.annotations.firstLine?.value)){
      let space = 0;
      myChart.options.plugins.annotation.annotations.firstLine.value > x ? 
      space = (myChart.options.plugins.annotation.annotations.firstLine.value - x) :
      space = (x - myChart.options.plugins.annotation.annotations.firstLine.value);
      let postPeriod = [makePeriodAnnotation(myChart.options.plugins.annotation.annotations.firstLine.value, space.toFixed(6), true)];
      for(let i = 1; i < 26; i++){
        let value = myChart.options.plugins.annotation.annotations.firstLine.value + (space*i);
        if(value < 1.2)
          postPeriod = [...postPeriod, makePeriodAnnotation(value, space.toFixed(6), false)];
      }
      for(let i = 1; i < 26; i++){
        let value = myChart.options.plugins.annotation.annotations.firstLine.value - (space*i);
        if(value > 0)
          postPeriod = [...postPeriod, makePeriodAnnotation(value, space.toFixed(6), false)];
      }
      myChart.options.plugins.annotation.annotations = postPeriod;
      setAnnot(postPeriod);
      myChart.update();
    }
  }

  function togglePeriodMode() {
    periodButton.current.classList.toggle("selected-chart-button");
    if(periodButton.current.classList.contains("selected-chart-button")){
      waveChart.options.plugins.annotation.annotations  = {}
      setAnnot({});
      waveChart.update();
    }
  }

  function toggleResetMode() {
    waveChart.resetZoom();
    waveChart.options.scales.y.max = undefined;
    waveChart.options.scales.y.min = undefined;
    waveChart.options.scales.x.min = 0;
    waveChart.update();
  }

  function togglePanMode() {
    panButton.current.classList.toggle("selected-chart-button");
    // zoomButton.current.classList.add("selected-chart-button");
    const panEnabled = waveChart.options.plugins.zoom.pan.enabled;
    const zoomEnabled = waveChart.options.plugins.zoom.zoom.drag.enabled;
    waveChart.options.plugins.zoom.pan.enabled = !panEnabled;
    waveChart.options.plugins.zoom.zoom.drag.enabled = !zoomEnabled;

    panEnabled ? setClassChart("crosshair") : setClassChart("grab");

    waveChart.update();
  }

  function toggleFullScreen() {
    fullScreenButton.current.classList.toggle("selected-chart-button");
    !tendency ? setSize((prev) => (prev === "50%" ? "100%" : "50%")) :
    (window.innerHeight > 500 ? setSpecSize((prev) => prev === "35vh" ? "60vh" : "35vh") : setSpecSize((prev) => prev === "50vh" ? "70vh" : "50vh"));
  }

  function toggleModal() {
    const {
      scales: { y, x },
    } = waveChart;

    setYAxis({ min: y.min, max: y.max });
    setXAxis({ min: x.min, max: x.max });
    setIsModalVisible(!isModalVisible);
    if(lockEffect)
      lockEffect(!isModalVisible);
  }

  function saveLimits() {
    waveChart.zoomScale("x", { min: xAxis.min, max: xAxis.max }, "zoom");
    waveChart.zoomScale("y", { min: yAxis.min, max: yAxis.max }, "zoom");

    waveChart.update();
    toggleModal();
  }

  async function handleUnit(event) {
    let oldUnit = unit;
    let calculator = {value: 0, operator: "*"};
    switch(event.target.value){
      case "g":
        if(oldUnit === "mm/s²")
          calculator = {value: 0.00010197, operator: "*"}
        else if(oldUnit === "m/s²")
          calculator = {value: 0.10197, operator: "*"}
        else if(oldUnit === "in/s²")
          calculator = {value: 0.00259, operator: "*"}
        await setUnit("g");
        break;
      case "in/s²":
        if(oldUnit === "mm/s²")
          calculator = {value: 0.03937, operator: "*"}
        else if(oldUnit === "m/s²")
          calculator = {value: 39.37, operator: "*"}
        else if(oldUnit === "g")
          calculator = {value: 386.08858, operator: "*"}
        await setUnit("in/s²");
        break;
      case "m/s²":
        if(oldUnit === "mm/s²")
          calculator = {value: 0.001, operator: "*"}
        else if(oldUnit === "in/s²")
          calculator = {value: 0.0254, operator: "*"}
        else if(oldUnit === "g")
          calculator = {value: 9.80665, operator: "*"}
        await setUnit("m/s²");
        break;
      case "mm/s²":
        if(oldUnit === "m/s²")
          calculator = {value: 1000, operator: "*"}
        else if(oldUnit === "in/s²")
          calculator = {value: 25.4, operator: "*"}
        else if(oldUnit === "g")
          calculator = {value: 9806.65, operator: "*"}
        await setUnit("mm/s²");
        break;
      default:
        break;
    }
    let objVer = []
    let objHor = []
    let objAxi = []
    try {
      if(waveData?.dataVertical)
      await waveData.dataVertical.map((obj) => {
        objVer = [...objVer, {x: obj.x, y: obj.y*calculator.value}]
      })
      if(waveData?.dataHorizontal)
      await waveData.dataHorizontal.map((obj) => {
        objHor = [...objHor, {x: obj.x, y: obj.y*calculator.value}]
      })
      if(waveData?.dataAxial)
      await waveData.dataAxial.map((obj) => {
        objAxi = [...objAxi, {x: obj.x, y: obj.y*calculator.value}]
      })
      await setwaveData({
        dataAxial: objAxi !== [] ? objAxi : waveData.dataAxial,
        dataHorizontal: objHor !== [] ? objHor : waveData.dataHorizontal,
        dataVertical: objVer !== [] ? objVer : waveData.dataVertical,
        dataRadial: waveData.spectrum_radial,
        dataTangencial: waveData.spectrum_tangencial,
        rotation: waveData.rotation_speed,
        machineType: waveData.machine_type,
        bpfi: waveData.bpfi,
        bpfo: waveData.bpfo,
        bsf: waveData.bsf,
        ftf: waveData.ftf,
        bearingList: waveData.bearings_freq,
      });
    }
    catch(error){
      console.log(error)
    }
    lockEffect(false);
  }

  useEffect(() => {
    setSpecSize(window.innerHeight > 500 ? "35vh" : "50vh")
  }, [window.innerHeight])

  useEffect(() => {
    if (!!myChart) {
      let tmp = {
        ...annot,
      };

      myChart.options.plugins.annotation.annotations = {
        ...tmp,
      };
      myChart.update();
    }
  }, [annot]);

  useEffect(() => {
    if (waveChart !== undefined) {
      waveChart.destroy();
    }
    setUnit("g")
    setwaveData(WaveData)
  },[WaveData]);

  useEffect(() => {
    if (waveChart !== undefined) {
      waveChart.destroy();
    }
    if (waveData !== undefined) {
      if (waveData.dataVertical !== undefined) {
        plotSpectrumChart(waveData);
        setDownloadData(makeSpectrumCsv(waveData, "Tempo"));
      }
    }
  }, [waveData]);

  useEffect(() => {
    !!panButton.current && panButton.current.classList.add("selected-chart-button");
    setClassChart("crosshair");
  }, [spotId, SpectrumType, dataId]);

  useEffect(() => {
    setWaveChart(myChart);
  }, [myChart])

  return (
    tendency ?
    <div className={"transition_smooth"} ref={fRef} style={{ height: specSize, width: "100%", display: "flex", flexDirection: "column" }}>
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
          <h6 className="cardTitle" style={{marginLeft: "1.5em", width: "auto", display: "flex"}}>{title}
          <div style={{marginLeft: "0.5em"}}>{SpectrumType !== "envelope" && 
          <Input  
            name="unit"
            options={["g", "m/s²", "mm/s²", "in/s²"]}
            value={unit}
            onChange={handleUnit}
            selectStyle={{
              boxShadow: "none",
              fontSize: "0.7rem",
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
          />}</div>
          </h6>

          <div className="row-chart-buttons">
            <Button
                id="period-button"
                small
                style={{ fill: "#fff", backgroundColor: "#156284" }}
                onClick={() => togglePeriodMode()}
                className="selected-chart-button chart-button"
                buttonRef={periodButton}
              >
              <Tooltip title="Período">
                <Period />
              </Tooltip>
            </Button>


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
              <Tooltip title="Limites eixo X e Y">
                <Axis />
              </Tooltip>
            </Button>

            <DownloadButton
              id="download-button"
              small
              style={{ fill: "white", width: "25px", height: "25px", borderRadius: "6px", transition: ".3s" }}
              className="selected-chart-button chart-button"
              filename="FormaOnda.csv"
              headers={downloadData.headers}
              data={downloadData.data}
            />

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
          </div>
        </div>

        <div className="overflow-hidden width-100p height-100p">
          {!!waveData && Object.keys(waveData).length === 0 ? (
            <CardData title="NÃO HÁ DADOS" />
          ) : (
            <canvas id={ID} className={classChart}></canvas>
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
          freqOrTime={"Tempo"}
          toggle={() => toggleModal()}
          onSave={() => saveLimits()}
        />
      </div>
    :
    <Card className={tendency ? "" : "col-12 transition_smooth"} height={size} minHeight="230px">
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
              <Tooltip title="Limites eixo X e Y">
                <Axis />
              </Tooltip>
            </Button>

            <DownloadButton
              id="download-button"
              small
              style={{ fill: "white", width: "25px", height: "25px", borderRadius: "6px", transition: ".3s" }}
              className="selected-chart-button"
              filename="FormaOnda.csv"
              headers={downloadData.headers}
              data={downloadData.data}
            />

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
          </div>
        </div>

        <div className="overflow-hidden width-100p height-100p">
          {!!waveData && Object.keys(waveData).length === 0 ? (
            <CardData title="NÃO HÁ DADOS" />
          ) : (
            <canvas id={id} className={classChart}></canvas>
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
          freqOrTime={"Tempo"}
          toggle={() => toggleModal()}
          onSave={() => saveLimits()}
        />
      </div>
    </Card>
  );
}

export default WaveFormCard;
