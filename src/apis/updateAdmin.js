import { AxiosInstance } from "./AxiosInstance";

export async function updateAdmin(group_id, payload) {
  const api = new AxiosInstance(`/group/${group_id}/admin`);

  return api.axiosPut(payload);
}
