import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function createApiKey() {
  const api = new AxiosInstance(`/user/api_key`);

  return api.axiosPost();
}
