import { AxiosInstance } from "./AxiosInstance";

export async function configSpectralChart(chartId, chartName) {
  const api = new AxiosInstance("configspectralchart");
  const data = {
    custom_chart_id: chartId,
    chart_name: chartName
  };
  
  return api.axiosPut(data);
}