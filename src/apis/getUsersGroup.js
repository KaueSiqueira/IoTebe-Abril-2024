import { AxiosInstance } from "./AxiosInstance";

export async function getUsersGroup(group_id) {
  const api = new AxiosInstance(`/group/${group_id}/users`);

  return api.axiosGet();
}
