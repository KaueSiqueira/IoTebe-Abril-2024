import { AxiosInstance } from "./AxiosInstance";

export async function getAlarmedPeriods(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/alarmed_periods`);

  return api.axiosGet(cancelToken);
}
