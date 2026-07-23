import { AxiosInstance } from "./AxiosInstance";

export async function addAdmin(group_id, payload) {
  const api = new AxiosInstance(`/group/${group_id}/admin`);

  return api.axiosPost(payload);
}
