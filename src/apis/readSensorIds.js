import { AxiosInstance } from "./AxiosInstance";

export async function readSensorIds() {
  const api = new AxiosInstance("readsensorids");

  return api.axiosPut();
}
