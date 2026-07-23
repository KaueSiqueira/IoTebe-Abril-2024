import { AxiosInstance } from "./AxiosInstance";

export async function generateGatewaysList() {
  const api = new AxiosInstance("generategatewayslist");

  return api.axiosPut();
}
