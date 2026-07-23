import { useContext, useEffect, useState } from "react";
import { DiagnosticContext, WhichRenderContext } from "../../contexts";
import { getChartIds, getAlarmedPeriods } from "../../apis";

export default function useDiagnosticCharts(generalLoading) {
  const {
    diagnosticType,
    chartIds,
    setChartIds,
    chartFilter,
    setChartFilter,
    loading,
    setLoadingCharts,
    setLoadingAlarmedPeriods,
    cancelToken,
  } = useContext(DiagnosticContext);

  const { selectedNode } = useContext(WhichRenderContext);

  const noChartsToPlot = {
    GLOBAL: [],
    PROCESSED_RAW: [],
  };

  const [diagnosticChartIds, setDiagnosticChartIds] = useState([]);
  const [chartsToPlot, setChartsToPlot] = useState(noChartsToPlot);
  const [diagnosticChartFilter, setDiagnosticChartFilter] = useState([]);
  const [alarmedPeriods, setAlarmedPeriods] = useState([]);

  const handleReadChartIds = async (spotId) => {
    setLoadingCharts(true);
    setChartsToPlot(noChartsToPlot);
    const chartsToPlot = noChartsToPlot;
    try {
      let res = await getChartIds(spotId, cancelToken);
      res = res.data;
      res.forEach((item) => {
        diagnosticChartIds.find(
          (chart) =>
            chart.chart_id === item.chart_id &&
            chartsToPlot[item.type].push(chart)
        );
      });
      setChartsToPlot(chartsToPlot);
      setLoadingCharts(false);
    } catch (error) {
      console.error(error);
      setChartsToPlot(noChartsToPlot);
    }
  };

  const handleGetAlarmedPeriods = async (spotId) => {
    setLoadingAlarmedPeriods(true);
    try {
      const { data } = await getAlarmedPeriods(spotId, cancelToken);
      setAlarmedPeriods(data);
      handleReadChartIds(spotId);
      setLoadingAlarmedPeriods(false);
    } catch (error) {
      console.error(error);
      setAlarmedPeriods([]);
    }
  };

  const checkFilter = (chartFilter, chartId) => {
    if (chartFilter.length > 0) {
      return chartFilter.includes(chartId);
    }
    return true;
  };

  const getDateRange = (start_time, end_time) => {
    return {
      startDate: new Date(start_time * 1000),
      endDate: new Date(end_time * 1000),
    };
  };

  const getDateType = (start_time, end_time) => {
    const timeDifference = Math.abs(end_time * 1000 - start_time * 1000);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    if (timeDifference >= oneDay) {
      return "day";
    } else if (timeDifference < oneDay && timeDifference >= oneHour) {
      return "hour";
    } else {
      return "minute";
    }
  };

  const getAlarmedAnnotations = (chart) => {
    if (alarmedPeriods.length > 0) {
      const annotations = [];

      const filterChart =
        alarmedPeriods.find((item) => item.chart_id === chart.chart_id)
          ?.alarmed_periods || [];

      filterChart.forEach((element) => {
        annotations.push({
          type: "box",
          scaleID: "x",
          xMin: element.start_time * 1000,
          xMax: element.end_time
            ? element.end_time * 1000
            : chart.current_time * 1000,
          backgroundColor:
            element.alarm_color === "RED"
              ? "rgba(255, 0, 0, 0.2)"
              : "rgba(255, 224, 50, 0.2)",
          borderColor:
            element.alarm_color === "RED"
              ? "rgba(255, 0, 0, 0.2)"
              : "rgba(255, 224, 50, 0.2)",
        });
      });

      return annotations;
    }
    return [];
  };

  useEffect(() => {
    generalLoading(false);
  }, [generalLoading]);

  useEffect(() => {
    setDiagnosticChartFilter([]);
    setChartsToPlot(noChartsToPlot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticType]);

  useEffect(() => {
    setChartIds(null);
    if (chartIds) {
      if (
        JSON.stringify(chartIds?.sort()) !==
        JSON.stringify(diagnosticChartIds?.sort())
      ) {
        setDiagnosticChartIds(chartIds);
      }
    }
  }, [chartIds, setChartIds, diagnosticChartIds]);

  useEffect(() => {
    if (chartFilter) {
      setDiagnosticChartFilter(chartFilter);
      setChartFilter(false);
    }
  }, [chartFilter, setChartFilter]);

  useEffect(() => {
    if (diagnosticChartIds.length > 0) {
      handleGetAlarmedPeriods(selectedNode.id);
    } else {
      setChartsToPlot(noChartsToPlot);
      setAlarmedPeriods([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticChartIds]);

  return {
    diagnosticType,
    loading,
    chartsToPlot,
    diagnosticChartFilter,
    checkFilter,
    getAlarmedAnnotations,
    getDateRange,
    getDateType,
  };
}
