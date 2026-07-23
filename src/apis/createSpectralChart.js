import { AxiosInstance } from "./AxiosInstance";

export async function createSpectralChart(data) {
  const api = new AxiosInstance("createspectralchart");
  return api.axiosPut(data);
}
