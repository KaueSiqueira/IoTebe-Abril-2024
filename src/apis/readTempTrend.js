import { getCurrentTimezone } from "../utilities";
import { AxiosInstance } from "./AxiosInstance";

export async function readTempTrend(spotId) {
  const api = new AxiosInstance("readtemptrend");
  const data = {
    spot_id: spotId,
    timezone: getCurrentTimezone(),
  };

  return api.axiosPut(data);
}
