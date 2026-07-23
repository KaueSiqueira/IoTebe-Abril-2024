import { AxiosInstance } from "./AxiosInstance";

export async function readApiKey() {
  const api = new AxiosInstance("readapikey");
  return api.axiosPut();
}
