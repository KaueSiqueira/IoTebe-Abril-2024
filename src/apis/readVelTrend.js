import { getCurrentTimezone } from "../utilities";
import { AxiosInstance } from "./AxiosInstance";

export async function readVelTrend(spotId) {
  const api = new AxiosInstance("readveltrend");
  const data = {
    spot_id: spotId,
    timezone: getCurrentTimezone(),
  };

  return api.axiosPut(data);
}
