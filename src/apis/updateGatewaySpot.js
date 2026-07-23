import { AxiosInstance } from "./AxiosInstance";

export async function updateGatewaySpot(spot_id, gateway_id) {
  const api = new AxiosInstance("updategatewayspot");
  const data = {
    spot_id: spot_id,
    gateway_id: gateway_id,
  };

  return api.axiosPut(data);
}
