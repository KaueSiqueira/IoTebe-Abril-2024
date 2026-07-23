import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function sendPhoneCode(payload) {
  const api = new AxiosInstance(`/user/phone_number/verification_code`);

  return api.axiosPost(payload);
}
