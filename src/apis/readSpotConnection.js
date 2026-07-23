import { AxiosInstance } from "./AxiosInstance";

export async function readSpotConnection(spotId) {
  const api = new AxiosInstance("readspotconnection");
  const data = {
    spot_id: spotId,
  };

  return api.axiosPut(data);
}
