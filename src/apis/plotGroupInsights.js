import { AxiosInstance } from "./AxiosInstance";

export async function plotGroupInsights(spot_array, spot_group_id) {
  const api = new AxiosInstance("plotgroupinsights");
  const data = {
    spot_array: spot_array,
    group_id: spot_group_id,
  };

  return api.axiosPut(data);
}
