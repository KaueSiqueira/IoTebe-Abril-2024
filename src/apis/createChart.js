import { AxiosInstance } from "./AxiosInstance";

export async function createChart(spotId, chartName, axis, metric) {
  const api = new AxiosInstance("createchart");
  const data = {
    spot_id: spotId,
    chart_name: chartName,
    axes: axis,
    metric_id: metric
  };

  return api.axiosPut(data);
}
