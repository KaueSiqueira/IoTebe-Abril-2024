import { AxiosInstance } from "./AxiosInstance";

export async function readSpectrumWaterfall(requestBody) {
  const api = new AxiosInstance("readspectrumwaterfall");
  const data = { ...requestBody };

  return api.axiosPut(data);
}
