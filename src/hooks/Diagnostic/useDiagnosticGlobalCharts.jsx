import { useEffect, useState } from "react";

const useDiagnosticGlobalCharts = (
  charts,
  {
    update,
    filterAnnotations,
    saveAnnotation,
    setAnnotationSelected,
    setDescription,
    setAnnotation,
    alarmMode,
    setUpdate,
    cancel,
    setCancel,
  }
) => {
  const [modelChartLoading, setModelChartLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(0);
  const [newLoad, setNewLoad] = useState(false);
  let tempCounter = 0;

  const loadChart = () => {
    tempCounter++;
    if (newLoad === true) {
      setChartsLoaded(charts.length);
      setNewLoad(false);
    } else setChartsLoaded(tempCounter);
  };

  useEffect(() => {
    if (update === true) {
      setChartsLoaded(0);
    }
    if (chartsLoaded === charts.length || newLoad) setModelChartLoading(false);
    if (!modelChartLoading) {
      setChartsLoaded(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChartLoading, chartsLoaded, update]);

  return {
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
  };
};

export default useDiagnosticGlobalCharts;
