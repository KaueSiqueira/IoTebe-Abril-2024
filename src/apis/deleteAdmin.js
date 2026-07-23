import { AxiosInstance } from "./AxiosInstance";

export async function deleteAdmin(group_id, email) {
  const api = new AxiosInstance(`/group/${group_id}/admin/${email}`);

  return api.axiosDelete();
}
