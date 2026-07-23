import { AxiosInstance } from "./AxiosInstance";

export async function updateUserGroup(group_id, payload) {
  const api = new AxiosInstance(`/group/${group_id}/user`);

  return api.axiosPut(payload);
}
