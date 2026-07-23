import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function updatePhone(payload) {
  const api = new AxiosInstance(`/user/phone_number`);

  return api.axiosPut(payload);
}
