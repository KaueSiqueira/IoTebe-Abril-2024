import { AxiosInstance } from "./AxiosInstance";

export async function addUserGroup(group_id, payload) {
  const api = new AxiosInstance(`/group/${group_id}/user`);

  return api.axiosPost(payload);
}
