import { AxiosInstance } from "./AxiosInstance";

export async function readNotification(groupId) {
  const api = new AxiosInstance("readnotification");
  const data = { group_id: groupId };

  return api.axiosPut(data);
}
