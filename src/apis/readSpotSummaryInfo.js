import { getCurrentTimezone } from "../utilities";
import { AxiosInstance } from "./AxiosInstance";

export async function readSpotSummaryInfo(spotId) {
  const api = new AxiosInstance("readspotsummaryinfo");
  const data = {
    spot_id: spotId,
    timezone: getCurrentTimezone(),
  };

  return api.axiosPut(data);
}
