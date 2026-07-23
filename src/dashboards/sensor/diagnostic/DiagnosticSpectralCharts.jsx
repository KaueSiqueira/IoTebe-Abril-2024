import React from "react";
import useDiagnosticSpectralCharts from "../../../hooks/Diagnostic/useDiagnosticSpectralCharts";
import SpecChart from "../vib_temp_cards/SpecChart";

const DiagnosticSpectralCharts = ({
  chartsToPlot,
  spectralProps,
  chartFilter,
  checkFilter,
  getAlarmedAnnotations,
  getDateRange,
  getDateType,
  onlyOne,
}) => {
  const {
    charts,
    loadChart,
    filterAnnotations,
    saveAnnotation,
    setAnnotationSelected,
    setDescription,
    setAnnotation,
    alarmMode,
    update,
    setUpdate,
    cancel,
    setCancel,
    spotId,
    dataId,
    setSpecLock,
    setCascateAPI,
    rotation,
    closeModal,
    setCloseModal,
    windowSize,
    spectrumListData,
  } = useDiagnosticSpectralCharts(chartsToPlot, spectralProps);

  return (
    <>
      {charts?.map((chart, idx) => {
        const filteredChart = checkFilter(chartFilter, chart.chart_id);
        const start_time = chart.start_diagnostic_time - 604800;
        const end_time = chart.end_diagnostic_time || chart.current_time;
        const dateType = getDateType(start_time, end_time);
        const dateRange = getDateRange(start_time, end_time);
        const alarmedAnnotations = getAlarmedAnnotations(chart);
        return (
          <div
            className={`col-12 diagnosticChartContainer ${
              !filteredChart ? "diagnosticHideChart" : ""
            }`}
          >
            <SpecChart
              id={chart.chart_id.toString() + "diagnostic"}
              key={chart.chart_id}
              index={idx}
              chartId={chart.chart_id}
              dateRange={dateRange}
              onLoad={loadChart}
              dateType={dateType}
              filterAnnotations={filterAnnotations}
              saveAnnotation={saveAnnotation}
              setAnnotationSelected={setAnnotationSelected}
              setDescription={setDescription}
              setAnnotation={setAnnotation}
              alarmMode={alarmMode}
              update={update}
              setUpdate={setUpdate}
              cancel={cancel}
              setCancel={setCancel}
              spotId={spotId}
              dataId={dataId}
              setLock={setSpecLock}
              setCascateAPI={setCascateAPI}
              rotation={rotation}
              close={closeModal}
              setClose={setCloseModal}
              windowSize={windowSize}
              alarmedAnnotations={alarmedAnnotations}
              showAlarmLegend={true}
              startExpanded={onlyOne}
              blockDelete={true}
              spectrumListData={spectrumListData}
            />
          </div>
        );
      })}
    </>
  );
};

export default DiagnosticSpectralCharts;
