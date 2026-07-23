import { getCurrentTimezone } from "../utilities";
import { AxiosInstance } from "./AxiosInstance";

export async function readAcelTrend(spotId) {
  const api = new AxiosInstance("readaceltrend");
  const data = {
    spot_id: spotId,
    timezone: getCurrentTimezone(),
  };

  return api.axiosPut(data);
}
