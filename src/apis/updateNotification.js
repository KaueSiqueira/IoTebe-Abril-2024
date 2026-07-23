import { AxiosInstance } from "./AxiosInstance";

export async function updateNotification(group_id, email, whatsapp) {
  const api = new AxiosInstance("updatenotification");
  const data = {
    group_id: group_id,
    email: email,
    whatsApp: whatsapp,
  };

  return api.axiosPut(data);
}
