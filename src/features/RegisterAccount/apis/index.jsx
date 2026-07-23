import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function getEmailByToken(token, pendency_type) {
  const api = new AxiosInstance(`/user/${token}/${pendency_type}/email`);

  return api.axiosPublicGet();
}

export async function registerUser(payload, token) {
  const api = new AxiosInstance(`/user/register`);

  return api.axiosPublicPost(payload, token);
}

export async function sendVerificationCode(payload) {
  const api = new AxiosInstance(`/user/phone_number/verification_code`);

  return api.axiosPost(payload);
}

export async function confirmVerificationCode(payload) {
  const api = new AxiosInstance(`/user/phone_number`);

  return api.axiosPut(payload);
}
