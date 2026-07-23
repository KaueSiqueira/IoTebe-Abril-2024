import { useContext } from "react";
import { useState, useEffect } from "react";
import { RightSideMenuContext } from "../../contexts";

export default function useAutomatic(props) {
  const [modelChartLoading, setModelChartLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    traningPeriod,
    limit,
    metric,
    showAllCharts,
    isAutoEnabled,
    loadingAutomaticInfo,
  } = useContext(RightSideMenuContext);

  useEffect(() => {
    props.setLoading(false);
    if (props.update === true) {
      setChartsLoaded(0);
    }
    if (chartsLoaded === 3) setModelChartLoading(false);
    if (!modelChartLoading) {
      setLoading(false);
      setChartsLoaded(0);
    }
    return () => setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelChartLoading, chartsLoaded, props.update]);

  useEffect(() => {
    props.whichButton(props.dateButton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    setModelChartLoading,
    loading,
    traningPeriod,
    limit,
    metric,
    showAllCharts,
    isAutoEnabled,
    loadingAutomaticInfo,
  };
}
