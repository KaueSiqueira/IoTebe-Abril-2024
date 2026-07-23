import { AxiosInstance } from "./AxiosInstance";

export async function getCollectInfo(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/collect_info`);

  return api.axiosGet(cancelToken);
}
