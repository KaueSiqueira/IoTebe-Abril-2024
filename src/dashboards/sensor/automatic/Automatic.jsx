import React from "react";
import AutomaticChart from "../vib_temp_cards/AutomaticChart/AutomaticChart";
import "./Automatic.css";
import useAutomatic from "../../../hooks/Automatic/useAutomatic";

const Automatic = (props) => {
  const {
    loading,
    setModelChartLoading,
    traningPeriod,
    limit,
    metric,
    showAllCharts,
    isAutoEnabled,
    loadingAutomaticInfo,
  } = useAutomatic(props);

  return (
    <div
      className={`row ${loading || loadingAutomaticInfo ? "loading" : "done"}`}
    >
      <AutomaticChart
        id={"velChart"}
        index={1}
        labelString={1 + "Un"}
        spotId={props.spotId}
        metricId={1}
        dateRange={props.dateRange}
        setLoading={setModelChartLoading}
        dateType={props.dateType}
        filterAnnotations={props.filterAnnotations}
        saveAnnotation={props.saveAnnotation}
        setAnnotationSelected={props.setAnnotationSelected}
        setDescription={props.setDescription}
        setAnnotation={props.setAnnotation}
        traningPeriod={traningPeriod}
        limit={limit}
        onOffMetric={metric === 1}
        showChart={isAutoEnabled ? true : metric === 1 || showAllCharts}
        expanded={isAutoEnabled ? false : showAllCharts ? false : metric === 1}
      />
      <AutomaticChart
        id={"acelChart"}
        index={2}
        labelString={2 + "Un"}
        spotId={props.spotId}
        metricId={2}
        dateRange={props.dateRange}
        setLoading={setModelChartLoading}
        dateType={props.dateType}
        filterAnnotations={props.filterAnnotations}
        saveAnnotation={props.saveAnnotation}
        setAnnotationSelected={props.setAnnotationSelected}
        setDescription={props.setDescription}
        setAnnotation={props.setAnnotation}
        traningPeriod={traningPeriod}
        limit={limit}
        onOffMetric={metric === 2}
        showChart={isAutoEnabled ? true : metric === 2 || showAllCharts}
        expanded={isAutoEnabled ? false : showAllCharts ? false : metric === 2}
      />
    </div>
  );
};

export default Automatic;
