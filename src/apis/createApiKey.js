import { AxiosInstance } from "./AxiosInstance";

export async function createApiKey() {
  const api = new AxiosInstance("createapikey");
  return api.axiosPut();
}
