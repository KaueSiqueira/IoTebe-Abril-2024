import { AxiosInstance } from "./AxiosInstance";

export async function getSpotSummary(spotId) {
  const api = new AxiosInstance(`/spot/${spotId}/summary`);

  return api.axiosGet();
}
