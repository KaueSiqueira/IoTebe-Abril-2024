import { AxiosInstance } from "./AxiosInstance";

export async function deleteSpectralChart(chartId, spotId) {
  const api = new AxiosInstance("deletespectralchart");
  const data = {
    custom_chart_id: chartId,
    spot_id: spotId
  };
  
  return api.axiosPut(data);
}

