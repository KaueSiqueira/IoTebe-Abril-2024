import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React from "react";
import "./GroupedCharts.css";
import useGroupedCharts from "../../../hooks/GroupedCharts/useGroupedCharts";
import ModelChart from "../vib_temp_cards/ModelChart";
import SpecChart from "../vib_temp_cards/SpecChart";

export default function GroupedCharts({
  chartType,
  charts,
  chartProps,
  addChartButton,
}) {
  const {
    manualChartFilter,
    automaticChartFilter,
    toggleManualFilter,
    toggleAutomaticFilter,
  } = useGroupedCharts();

  return (
    <div className="chart-filter-container">
      <div className="chart-filter-block">
        <div className="chart-filter-button" onClick={toggleManualFilter}>
          {manualChartFilter ? (
            <KeyboardArrowUpRounded />
          ) : (
            <KeyboardArrowDownRounded />
          )}

          <p>Gráficos Manuais</p>
        </div>
        <div
          className={`chart-filter-charts ${
            manualChartFilter ? "active-chart-filter" : ""
          }`}
        >
          {chartType === "GLOBAL"
            ? charts.map((chart, idx) =>
                !chart.automatic_diag ? (
                  <ModelChart
                    id={chart.chart_id}
                    key={chart.chart_id}
                    index={idx}
                    labelString={idx + "Un"}
                    chartId={chart.chart_id}
                    dateRange={chartProps.dateRange}
                    setLoading={chartProps.setModelChartLoading}
                    remove={chartProps.deleteChart}
                    reload={chartProps.loadData}
                    onLoad={chartProps.loadChart}
                    dateType={chartProps.dateType}
                    filterAnnotations={chartProps.filterAnnotations}
                    saveAnnotation={chartProps.saveAnnotation}
                    setAnnotationSelected={chartProps.setAnnotationSelected}
                    setDescription={chartProps.setDescription}
                    setAnnotation={chartProps.setAnnotation}
                    alarmMode={chartProps.alarmMode}
                    update={chartProps.update}
                    setUpdate={chartProps.setUpdate}
                    cancel={chartProps.cancel}
                    setCancel={chartProps.setCancel}
                  />
                ) : (
                  ""
                )
              )
            : charts.map((chart, idx) =>
                !chart.automatic_diag ? (
                  <SpecChart
                    id={chart.chart_id}
                    key={chart.chart_id}
                    index={idx}
                    labelString={idx + "Un"}
                    chartId={chart.chart_id}
                    dateRange={chartProps.dateRange}
                    setLoading={chartProps.setModelChartLoading}
                    remove={chartProps.deleteChart}
                    reload={chartProps.loadData}
                    onLoad={chartProps.loadChart}
                    dateType={chartProps.dateType}
                    filterAnnotations={chartProps.filterAnnotations}
                    saveAnnotation={chartProps.saveAnnotation}
                    setAnnotationSelected={chartProps.setAnnotationSelected}
                    setDescription={chartProps.setDescription}
                    setAnnotation={chartProps.setAnnotation}
                    alarmMode={chartProps.alarmMode}
                    update={chartProps.update}
                    setUpdate={chartProps.setUpdate}
                    cancel={chartProps.cancel}
                    setCancel={chartProps.setCancel}
                    spotId={chartProps.spotId}
                    dataId={chartProps.dataId}
                    spectrumType={chartProps.spectrumType}
                    loading={chartProps.loading}
                    lock={chartProps.specLock}
                    setLock={chartProps.setSpecLock}
                    setCascateAPI={chartProps.setCascateAPI}
                    rotation={chartProps.rotation}
                    close={chartProps.closeModal}
                    setClose={chartProps.setCloseModal}
                    windowSize={chartProps.windowSize}
                    rotationRef={chartProps.rotationRef}
                    spectrumListData={chartProps.spectrumListData}
                  />
                ) : (
                  ""
                )
              )}

          {addChartButton ? addChartButton : ""}
        </div>
      </div>
      <div className="chart-filter-block">
        <div className="chart-filter-button" onClick={toggleAutomaticFilter}>
          {automaticChartFilter ? (
            <KeyboardArrowUpRounded />
          ) : (
            <KeyboardArrowDownRounded />
          )}
          <p>Gráficos Automáticos</p>
        </div>
        <div
          className={`chart-filter-charts ${
            automaticChartFilter ? "active-chart-filter" : ""
          }`}
        >
          {chartType === "GLOBAL"
            ? charts.map((chart, idx) =>
                chart.automatic_diag ? (
                  <ModelChart
                    id={chart.chart_id}
                    key={chart.chart_id}
                    index={idx}
                    labelString={idx + "Un"}
                    chartId={chart.chart_id}
                    dateRange={chartProps.dateRange}
                    setLoading={chartProps.setModelChartLoading}
                    remove={chartProps.deleteChart}
                    reload={chartProps.loadData}
                    onLoad={chartProps.loadChart}
                    dateType={chartProps.dateType}
                    filterAnnotations={chartProps.filterAnnotations}
                    saveAnnotation={chartProps.saveAnnotation}
                    setAnnotationSelected={chartProps.setAnnotationSelected}
                    setDescription={chartProps.setDescription}
                    setAnnotation={chartProps.setAnnotation}
                    alarmMode={chartProps.alarmMode}
                    update={chartProps.update}
                    setUpdate={chartProps.setUpdate}
                    cancel={chartProps.cancel}
                    setCancel={chartProps.setCancel}
                    automaticDiagnosticChart={chart.automatic_diag}
                  />
                ) : (
                  ""
                )
              )
            : charts.map((chart, idx) =>
                chart.automatic_diag ? (
                  <SpecChart
                    id={chart.chart_id}
                    key={chart.chart_id}
                    index={idx}
                    labelString={idx + "Un"}
                    chartId={chart.chart_id}
                    dateRange={chartProps.dateRange}
                    setLoading={chartProps.setModelChartLoading}
                    remove={chartProps.deleteChart}
                    reload={chartProps.loadData}
                    onLoad={chartProps.loadChart}
                    dateType={chartProps.dateType}
                    filterAnnotations={chartProps.filterAnnotations}
                    saveAnnotation={chartProps.saveAnnotation}
                    setAnnotationSelected={chartProps.setAnnotationSelected}
                    setDescription={chartProps.setDescription}
                    setAnnotation={chartProps.setAnnotation}
                    alarmMode={chartProps.alarmMode}
                    update={chartProps.update}
                    setUpdate={chartProps.setUpdate}
                    cancel={chartProps.cancel}
                    setCancel={chartProps.setCancel}
                    spotId={chartProps.spotId}
                    dataId={chartProps.dataId}
                    spectrumType={chartProps.spectrumType}
                    loading={chartProps.loading}
                    lock={chartProps.specLock}
                    setLock={chartProps.setSpecLock}
                    setCascateAPI={chartProps.setCascateAPI}
                    rotation={chartProps.rotation}
                    close={chartProps.closeModal}
                    setClose={chartProps.setCloseModal}
                    windowSize={chartProps.windowSize}
                    rotationRef={chartProps.rotationRef}
                    automaticDiagnosticChart={chart.automatic_diag}
                    spectrumListData={chartProps.spectrumListData}
                  />
                ) : (
                  ""
                )
              )}
        </div>
      </div>
    </div>
  );
}
