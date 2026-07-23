import { AxiosInstance } from "./AxiosInstance";

export async function readBattery(spotId) {
  const api = new AxiosInstance("readbattery");
  const data = {
    spot_id: spotId,
  };

  return api.axiosPut(data);
}
