import { AxiosInstance } from "./AxiosInstance";

export async function readSpotCondition(spotId) {
  const api = new AxiosInstance("readspotcondition");
  const data = {
    spot_id: spotId,
  };

  return api.axiosPut(data);
}
