import { AxiosInstance } from "./AxiosInstance";

export async function updateGatewayName(gateway_id, gateway_name) {
  const api = new AxiosInstance("updategatewayname");
  const data = {
    gateway_id: gateway_id,
    gateway_name: gateway_name,
  };

  return api.axiosPut(data);
}
