import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function updateEmail(token) {
  const api = new AxiosInstance(`/user/email`);

  return api.axiosPublicPut({}, token);
}
