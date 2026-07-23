import { AxiosInstance } from "./AxiosInstance";

export async function deleteSelfUserGroup(group_id) {
  const api = new AxiosInstance(`/group/${group_id}/user`);

  return api.axiosDelete();
}
