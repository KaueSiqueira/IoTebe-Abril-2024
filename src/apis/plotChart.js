import { AxiosInstance } from "./AxiosInstance";

export async function plotChart(chartId, dateRange) {
  const api = new AxiosInstance("plotchart");
  const data = {
    custom_chart_id: chartId,
    start_date: Math.floor(dateRange.startDate / 1000),
    end_date: Math.floor(dateRange.endDate / 1000),
  };

  return api.axiosPut(data);
}
