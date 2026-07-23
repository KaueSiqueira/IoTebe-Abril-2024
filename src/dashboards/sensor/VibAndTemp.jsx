import React, { useEffect, useState } from "react";
import ModelChart from "./vib_temp_cards/ModelChart"
import { getChartIds, createChart } from "../../apis"
import { IoTebeModal, ComponentLoader } from "../../components"
import { KeyboardArrowDown, Addchart } from "@mui/icons-material";
import GroupedCharts from "./GroupedCharts/GroupedCharts";
import { Allowed, NotAllowed, ProtectedFeature } from "../../components/ProtectedFeature/ProtectedFeature";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

const VibAndTemp = (props) => {
  const [modelChartLoading, setModelChartLoading] = useState(true);
  const [charts, setCharts] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(false);
  const [metric, setMetric] = useState(1);
  const [axis, setAxis] = useState([]);
  const [axisView, setAxisView] = useState([]);
  const [graphName, setGraphName] = useState("");
  const [verticalAxis, setVerticalAxis] = useState(false);
  const [horizontalAxis, setHorizontalAxis] = useState(false);
  const [axialAxis, setAxialAxis] = useState(false);
  const [axisSelect, setAxisSelect] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(0);
  const [newLoad, setNewLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [lock, setLock] = useState(0);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [hasAutomaticDiagnostic, setHasAutomaticDiagnostic] = useState(false);

  let tempCounter = 0;

  const loadChart = (chart) => {
    tempCounter++;
    if (newLoad === true) {
      setChartsLoaded(charts.length);
      setNewLoad(false);
    }
    else
      setChartsLoaded(tempCounter);
  }

  const newChart = async () => {
    /*props.*/setLoading(true);
    try {
      if (graphName === "") {
        window.alert("Preencha o nome do gráfico.");
        setCreateModal(true);
      } else if (parseInt(metric) !== 3 && axis.length === 0) {
        window.alert("Selecione um eixo ou altere a métrica para Temperatura.");
        setCreateModal(true);
      } else {
        setCreateModal(false);
        await createChart(props.spotId, graphName, axis, parseInt(metric));
        await loadData();
        setNewLoad(true);
        setGraphName("");
        setAxis([]);
        setAxisView([]);
        setVerticalAxis(false);
        setHorizontalAxis(false);
        setAxialAxis(false);
        setMetric(1);
        setAxisSelect(false);
        FeedbackToast.success();
      }
    }
    catch (error) {
      console.log(error);
      setCreateModal(false);
      setLoading(false);
      FeedbackToast.error();
    }
    finally {
      setLoading(false);
      setLock(0);
    }
  }

  const deleteChart = async (index) => {
    setShowGraph(false);
    try {
      await charts.splice(index, 1);
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setShowGraph(true);
    }
  }

  const setAxisArrayView = (e) => {
    let tempArray = axisView;
    if (tempArray.includes(e)) {
      tempArray.forEach((n, idx) => {
        if (n === e) {
          tempArray.splice(idx, 1);
        }
      })
    }
    else {
      tempArray = [...tempArray, e]
    }

    setAxisView(tempArray);
  }


  const setAxisArray = (e) => {
    let tempArray = axis;
    if (tempArray.includes(parseInt(e))) {
      tempArray.forEach((n, idx) => {
        if (n === parseInt(e)) {
          tempArray.splice(idx, 1)
        }
      })
    }
    else {
      tempArray = [...tempArray, parseInt(e)]
    }

    setAxis(tempArray);
  }


  const loadData = async () => {
    try {
      const res = await getChartIds(props.spotId);
      const charts = res.data
        .filter((chart) => chart.type === "GLOBAL" && chart.is_visible)
        .sort((a, b) => a.automatic_diag - b.automatic_diag);
      setHasAutomaticDiagnostic(charts.some(chart => chart.automatic_diag))
      setCharts(charts);
    }
    catch (error) {
      console.log(error);
    } finally {
      setSkeletonLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    props.setLoading(false);
    if (props.update === true) {
      setChartsLoaded(0);
    }
    if ((chartsLoaded === charts.length) || newLoad)
      setModelChartLoading(false);
    if (!modelChartLoading) {
      /*props.*/setLoading(false);
      setChartsLoaded(0);
    }
    return () => /*props.*/setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChartLoading, chartsLoaded, props.update]);

  useEffect(() => {
    props.whichButton(props.dateButton);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="row"
      style={
        loading ? { height: "120%", overflow: "hidden" } : { height: "100%", padding: 5 }
      }
    >
      {skeletonLoading && <ComponentLoader />}
      {createModal && <IoTebeModal
        showModal={createModal}
        toggleModal={() => setCreateModal(!createModal)}
        changeMarginBottom={"35px"}
        title="Novo Gráfico"
        onDismissTitle="Cancelar"
        onConfirm={() => {
          if (lock === 0) {
            setLock(1);
            setCreateModal(false);
            newChart();
          } else {
            setLock(1);
          }
        }}
        onConfirmTitle="Salvar"
        children={
          <div className="createGraphModal">
            <div style={{ display: "flex", flexFlow: "wrap" }}>
              <div className="optionsBox">
                <h3 className="label-add-graph">Nome:</h3>
                <input
                  onChange={(e) => setGraphName(e.target.value.toUpperCase())}
                  value={graphName}
                  className="createOptionsInput"
                  type="text"
                  id="graphName"
                  placeholder="Novo Gráfico"
                />
              </div>
              <div className="optionsBox">
                <h3 className="label-add-graph">Métrica:</h3>
                <div
                  className="createOptionsInput"
                  onMouseEnter={() => setSelectedMetric(true)}
                  onMouseLeave={() => setSelectedMetric(false)}
                  style={
                    window.innerWidth < 600
                      ? selectedMetric
                        ? {
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          width: "40%",
                          padding: 0,
                        }
                        : { cursor: "pointer", width: "40%" }
                      : selectedMetric
                        ? {
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          padding: 0,
                        }
                        : { cursor: "pointer" }
                  }
                >
                  {!selectedMetric &&
                    (metric === 1 ? (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Velocidade RMS{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    ) : metric === 2 ? (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Aceleração RMS{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    ) : metric === 5 ? (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Aceleração Pico{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    ) : metric === 3 ? (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Temperatura{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    ) :  metric === 12 ? (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Kurtosis{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    ) : (
                      <label
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Skewness{" "}
                        <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                      </label>
                    )
                  )}
                  {selectedMetric && (
                    <>
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                          borderRadius: "5px 5px 0 0",
                        }}
                        value={1}
                        onClick={() => {
                          setAxisSelect(false);
                          setMetric(1);
                        }}
                      >
                        Velocidade RMS
                      </label>
                      <hr style={{ margin: 0 }} />
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                        }}
                        value={2}
                        onClick={() => {
                          setAxisSelect(false);
                          setMetric(2);
                        }}
                      >
                        Aceleração RMS
                      </label>
                      <hr style={{ margin: 0 }} />
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                          borderRadius: "0 0 5px 5px",
                        }}
                        value={5}
                        onClick={() => {
                          setAxisSelect(false);
                          setMetric(5);
                        }}
                      >
                        Aceleração Pico
                      </label>
                      <hr style={{ margin: 0 }} />
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                          borderRadius: "0 0 5px 5px",
                        }}
                        value={3}
                        onClick={() => {
                          setMetric(3);
                          setAxis([]);
                          setAxisView([]);
                          setVerticalAxis(false);
                          setHorizontalAxis(false);
                          setAxialAxis(false);
                          setAxisSelect(true);
                        }}
                      >
                        Temperatura
                      </label>
                      <hr style={{ margin: 0 }} />
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                          borderRadius: "0 0 5px 5px",
                        }}
                        value={12}
                        onClick={() => {
                          setAxisSelect(false);
                          setMetric(12);
                        }}
                      >
                        Kurtosis
                      </label>
                      <hr style={{ margin: 0 }} />
                      <label
                        className="metricSelect"
                        style={{
                          cursor: "pointer",
                          margin: "0",
                          padding: "2%",
                          borderRadius: "0 0 5px 5px",
                        }}
                        value={13}
                        onClick={() => {
                          setAxisSelect(false);
                          setMetric(13);
                        }}
                      >
                        Skewness
                      </label>
                    </>
                  )}
                </div>
              </div>
              {!axisSelect && (
                <div
                  className="optionsBox"
                  style={
                    axisSelect
                      ? {}
                      : window.innerWidth < 600
                        ? { marginTop: "12%" }
                        : { marginTop: "8%" }
                  }
                  multiple
                >
                  <h3 className="label-add-graph">Eixo(s):</h3>
                  <div
                    className="createOptionsInput"
                    onMouseEnter={() => {
                      !axisSelect && setSelectedAxis(true);
                    }}
                    onMouseLeave={() => setSelectedAxis(false)}
                    style={
                      axisSelect
                        ? {}
                        : window.innerWidth < 600
                          ? selectedAxis
                            ? {
                              display: "flex",
                              flexDirection: "column",
                              cursor: "pointer",
                              width: "8rem",
                            }
                            : { cursor: "pointer" }
                          : selectedAxis
                            ? {
                              display: "flex",
                              flexDirection: "column",
                              cursor: "pointer",
                              width: "8rem",
                            }
                            : { cursor: "pointer" }
                    }
                  //onClick={(e) => {setAxisArray(e.target.value); setAxisArrayView(e.target.name)}}
                  >
                    {!selectedAxis &&
                      (axisView.length === 0 ? (
                        <label
                          style={{
                            margin: 0,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          Selecionar eixos
                          <KeyboardArrowDown style={{ fontSize: "1rem" }} />
                        </label>
                      ) : (
                        axisView.map((d, idx) =>
                          axisView.length === 1 ? (
                            <label style={{ margin: 0 }}>{d}</label>
                          ) : axisView.length === idx + 1 ? (
                            <label style={{ margin: 0 }}>{d}</label>
                          ) : (
                            <label style={{ margin: 0 }}>{d}, </label>
                          )
                        )
                      ))}
                    {selectedAxis && (
                      <>
                        <label key={1}>
                          <input
                            type="checkbox"
                            onClick={(e) => {
                              setAxisArray(e.target.value);
                              setAxisArrayView(e.target.name);
                              setVerticalAxis(!verticalAxis);
                            }}
                            name={"Vertical"}
                            checked={verticalAxis}
                            style={{ marginRight: "2%" }}
                            value={1}
                          />
                          Vertical
                        </label>
                        <label key={2}>
                          <input
                            type="checkbox"
                            onClick={(e) => {
                              setAxisArray(e.target.value);
                              setAxisArrayView(e.target.name);
                              setHorizontalAxis(!horizontalAxis);
                            }}
                            name={"Horizontal"}
                            checked={horizontalAxis}
                            style={{ marginRight: "2%" }}
                            value={2}
                          />
                          Horizontal
                        </label>
                        <label key={3}>
                          <input
                            type="checkbox"
                            onClick={(e) => {
                              setAxisArray(e.target.value);
                              setAxisArrayView(e.target.name);
                              setAxialAxis(!axialAxis);
                            }}
                            name={"Axial"}
                            checked={axialAxis}
                            style={{ marginRight: "2%" }}
                            value={3}
                          />
                          Axial
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      ></IoTebeModal>}
      {showGraph &&
        (hasAutomaticDiagnostic ? (
          <GroupedCharts
            chartType="GLOBAL"
            charts={charts}
            chartProps={{
              ...props,
              setModelChartLoading: setModelChartLoading,
              deleteChart: deleteChart,
              loadData: loadData,
              loadChart: loadChart,
            }}
            addChartButton={
              !skeletonLoading && (
                <ProtectedFeature requiredPermissions={["CONFIG_CHARTS"]}>
                  <div
                    style={{
                      margin: "20px auto 0px auto",
                      width: "fit-content",
                    }}
                  >
                    <button
                      className="rounded-button-with-icon"
                      onClick={() => setCreateModal(true)}
                    >
                      <Addchart style={{ color: "white", fontSize: 16 }} />{" "}
                      Adicionar Gráfico
                    </button>
                  </div>
                </ProtectedFeature>
              )
            }
          />
        ) : (
          charts.map((chart, idx) => (
            <ModelChart
              id={chart.chart_id}
              key={chart.chart_id}
              index={idx}
              labelString={idx + "Un"}
              chartId={chart.chart_id}
              dateRange={props.dateRange}
              setLoading={setModelChartLoading}
              remove={deleteChart}
              reload={loadData}
              onLoad={loadChart}
              dateType={props.dateType}
              filterAnnotations={props.filterAnnotations}
              saveAnnotation={props.saveAnnotation}
              setAnnotationSelected={props.setAnnotationSelected}
              setDescription={props.setDescription}
              setAnnotation={props.setAnnotation}
              alarmMode={props.alarmMode}
              update={props.update}
              setUpdate={props.setUpdate}
              cancel={props.cancel}
              setCancel={props.setCancel}
            />
          ))
        ))}
      {!skeletonLoading && !hasAutomaticDiagnostic && (
        <ProtectedFeature requiredPermissions={["CONFIG_CHARTS"]}>
          <Allowed>
            <div
              style={{
                margin: "2% auto",
                paddingBlockEnd: 5,
              }}
            >
              <button
                className="rounded-button-with-icon"
                onClick={() => setCreateModal(true)}
                style={{ marginBlockEnd: 5 }}
              >
                <Addchart style={{ color: "white", fontSize: 16 }} />
                Adicionar Gráfico
              </button>
            </div>
          </Allowed>
          <NotAllowed>
            <div style={{ height: "10px", width: "10px" }}></div>
          </NotAllowed>
        </ProtectedFeature>
      )}
    </div>
  );
};

export default VibAndTemp;
