import { useEffect, useState } from "react";

const useDiagnosticSpectralCharts = (
  charts,
  {
    spotId,
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
    dataId,
    setCascateAPI,
    rotation,
    spectrumListData,
  }
) => {
  const [modelChartLoading, setModelChartLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(0);
  const [newLoad, setNewLoad] = useState(false);
  const [closeModal, setCloseModal] = useState(1);
  const [windowSize, setWindowSize] = useState(window.innerHeight);

  let tempCounter = 0;

  const loadChart = (chart) => {
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
    setNewLoad(false);
    if (!modelChartLoading) {
      setChartsLoaded(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChartLoading, chartsLoaded, update, charts]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    spotId,
    dataId,
    setCascateAPI,
    rotation,
    closeModal,
    setCloseModal,
    windowSize,
    spectrumListData
  };
};

export default useDiagnosticSpectralCharts;
