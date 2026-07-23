import { AxiosInstance } from "../../../apis/AxiosInstance";

export default async function updateForgottenPassword(payload, token) {
  const api = new AxiosInstance(`/user/forgot_password`);

  return api.axiosPublicPut(payload, token);
}
