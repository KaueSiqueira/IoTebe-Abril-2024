import { AxiosInstance } from "./AxiosInstance";

export async function gatewaySpotsDatabase(gateway_id, username = "", cognito_identity_id = "") {
  const api = new AxiosInstance("gatewayspotsdatabase");
  const data = {
    gateway_id: gateway_id,
    username: username,
    cognito_identity_id: cognito_identity_id,
  };

  return api.axiosPut(data);
}
