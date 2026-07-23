import { useState } from "react";

export default function useGroupedCharts() {
  const [manualChartFilter, setManualChartFilter] = useState(true);
  const [automaticChartFilter, setAutomaticChartFilter] = useState(false);

  const toggleManualFilter = () => {
    setManualChartFilter((prev) => !prev);
  };

  const toggleAutomaticFilter = () => {
    setAutomaticChartFilter((prev) => !prev);
  };

  return {
    manualChartFilter,
    automaticChartFilter,
    toggleManualFilter,
    toggleAutomaticFilter,
  };
}
