import { AxiosInstance } from "./AxiosInstance";

export async function plotAutomaticChart(spotId, metricId, dateRange) {
  const data = {
    spot_id: spotId,
    metric_id: metricId,
    start_date: Math.floor(dateRange.startDate / 1000),
    end_date: Math.floor(dateRange.endDate / 1000),
  };
  const api = new AxiosInstance(`/spot/${data.spot_id}/plot_chart/metric/${data.metric_id}?start_date=${data.start_date}&end_date=${data.end_date}`);

  return api.axiosGet();
}
