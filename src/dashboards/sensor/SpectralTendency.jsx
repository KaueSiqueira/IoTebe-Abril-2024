import React, { useEffect, useState } from "react";
import SpecChart from "./vib_temp_cards/SpecChart";
import { getChartIds } from "../../apis";
import { ComponentLoader } from "../../components";
import { Addchart } from "@mui/icons-material";
import SpectrumTendencyChartModal from "./spectrum_tendency_chart_modal/SpectrumTendencyChartModal";
import GroupedCharts from "./GroupedCharts/GroupedCharts";
import {
  Allowed,
  NotAllowed,
  ProtectedFeature,
} from "../../components/ProtectedFeature/ProtectedFeature";

const SpectralTendency = (props) => {
  const [modelChartLoading, setModelChartLoading] = useState(true);
  const [charts, setCharts] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(0);
  const [newLoad, setNewLoad] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [specLock, setSpecLock] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [closeModal, setCloseModal] = useState(1);
  const [windowSize, setWindowSize] = useState(window.innerHeight);
  const [hasAutomaticDiagnostic, setHasAutomaticDiagnostic] = useState(false);

  let tempCounter = 0;

  const loadChart = (chart) => {
    tempCounter++;
    if (newLoad === true) {
      setChartsLoaded(charts.length);
      setNewLoad(false);
    } else setChartsLoaded(tempCounter);
  };

  const deleteChart = async (index) => {
    setShowGraph(false);
    try {
      charts.splice(index, 1);
    } catch (error) {
      console.log(error);
    } finally {
      setShowGraph(true);
    }
  };

  const loadData = async () => {
    try {
      const res = await getChartIds(props.spotId);
      const charts = res.data
        .filter((chart) => chart.type === "PROCESSED_RAW" && chart.is_visible)
        .sort((a, b) => a.automatic_diag - b.automatic_diag);
      setHasAutomaticDiagnostic(charts.some((chart) => chart.automatic_diag));
      setCharts(charts);
    } catch (error) {
      console.error(error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.setLoading(false);
    if (props.update === true) {
      setChartsLoaded(0);
    }
    if (chartsLoaded === charts.length || newLoad) setModelChartLoading(false);
    setNewLoad(false);
    if (!modelChartLoading) {
      setChartsLoaded(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChartLoading, chartsLoaded, props.update, charts]);

  useEffect(() => {
    props.whichButton(props.dateButton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="row"
      style={specLock ? { pointerEvents: "none" } : { padding: 5 }}
    >
      {skeletonLoading && <ComponentLoader />}
      {createModal && (
        <SpectrumTendencyChartModal
          spotId={props.spotId}
          showModal={createModal}
          setCreateModal={setCreateModal}
          showSettings={props.showSettings}
          loadData={loadData}
          newLoad={setNewLoad}
        />
      )}
      {showGraph &&
        (hasAutomaticDiagnostic ? (
          <GroupedCharts
            chartType="SPECTRAL"
            charts={charts}
            chartProps={{
              ...props,
              setModelChartLoading: setModelChartLoading,
              deleteChart: deleteChart,
              loadData: loadData,
              loadChart: loadChart,
              specLock: specLock,
              setSpecLock: setSpecLock,
              closeModal: closeModal,
              setCloseModal: setCloseModal,
              windowSize: windowSize,
              spectrumListData: props.spectrumListData,
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
            <SpecChart
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
              spotId={props.spotId}
              dataId={props.dataId}
              spectrumType={props.spectrumType}
              loading={props.loading}
              lock={specLock}
              setLock={setSpecLock}
              setCascateAPI={props.setCascateAPI}
              rotation={props.rotation}
              close={closeModal}
              setClose={setCloseModal}
              windowSize={windowSize}
              rotationRef={props.rotationRef}
              spectrumListData={props.spectrumListData}
            />
          ))
        ))}
      {!skeletonLoading &&
        !hasAutomaticDiagnostic && (
        <ProtectedFeature requiredPermissions={["CONFIG_CHARTS"]}>
          <Allowed>
            <div
              style={{
                margin: "2% auto",
                paddingBlockEnd: 5,
                position: "relative",
              }}
            >
              <button
                className="rounded-button-with-icon"
                onClick={() => setCreateModal(true)}
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

export default SpectralTendency;
