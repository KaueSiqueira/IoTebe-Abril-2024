import { AxiosInstance } from "./AxiosInstance";

export async function deleteChart(chartId) {
  const api = new AxiosInstance(`/chart/${chartId}`);

  return api.axiosDelete();
}
