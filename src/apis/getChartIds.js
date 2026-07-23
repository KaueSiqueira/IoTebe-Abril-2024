import { AxiosInstance } from "./AxiosInstance";

export async function getChartIds(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/chartids`);

  return api.axiosGet(cancelToken);
}
