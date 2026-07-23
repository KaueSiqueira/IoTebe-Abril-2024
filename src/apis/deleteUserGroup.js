import { AxiosInstance } from "./AxiosInstance";

export async function deleteUserGroup(group_id, email) {
  const api = new AxiosInstance(`/group/${group_id}/user/${email}`);

  return api.axiosDelete();
}
