import { getCurrentTimezone } from "../utilities";
import { AxiosInstance } from "./AxiosInstance";

export async function readSpotInfo(spotId) {
  const api = new AxiosInstance("readspotinfo");
  const data = {
    spot_id: spotId,
    timezone: getCurrentTimezone(),
  };

  return api.axiosPut(data);
}
