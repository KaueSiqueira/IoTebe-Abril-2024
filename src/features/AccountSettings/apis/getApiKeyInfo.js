import { AxiosInstance } from "../../../apis/AxiosInstance";

export async function getApiKeyInfo(cancelToken) {
  const api = new AxiosInstance(`/user/api_key`);

  return api.axiosGet(cancelToken);
}
