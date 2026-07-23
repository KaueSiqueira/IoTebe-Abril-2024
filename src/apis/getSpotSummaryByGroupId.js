import { AxiosInstance } from "./AxiosInstance";

export async function getSpotSummaryByGroupId(groupId) {
  const api = new AxiosInstance(`/group/${groupId}/spots/summary`);
  return api.axiosGet();
}
