import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function forgotPassword(payload) {
  const api = new AxiosInstance(`/user/forgot_password`);

  return api.axiosPublicPost(payload);
}
