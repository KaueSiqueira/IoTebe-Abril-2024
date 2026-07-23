import { AxiosInstance } from "./AxiosInstance";

export async function updateCollectInfo(spot_id, payload) {
  const api = new AxiosInstance(`/spot/${spot_id}/collect_info`);

  return api.axiosPut(payload);
}
