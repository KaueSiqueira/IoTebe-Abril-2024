import { AxiosInstance } from "./AxiosInstance";

export async function updateChart(chartId, chartName, axis) {
  const api = new AxiosInstance("updatechart");
  const data = {
    custom_chart_id: chartId,
    chart_name: chartName,
    axes: axis
  };
  
  return api.axiosPut(data);
}