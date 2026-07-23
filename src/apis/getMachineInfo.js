import { AxiosInstance } from "./AxiosInstance";

export async function getMachineInfo(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/machine_info`);

  return api.axiosGet(cancelToken);
}
