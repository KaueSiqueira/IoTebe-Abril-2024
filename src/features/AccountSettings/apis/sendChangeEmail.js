import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function sendChangeEmail(payload) {
  const api = new AxiosInstance(`/user/email`);

  return api.axiosPost(payload);
}
