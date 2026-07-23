import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function updatePassword(payload) {
  const api = new AxiosInstance(`/user/password`);

  return api.axiosPut(payload);
}
