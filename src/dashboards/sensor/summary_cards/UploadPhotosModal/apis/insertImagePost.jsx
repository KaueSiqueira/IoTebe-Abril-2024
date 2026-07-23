import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export async function insertImagePost(spotId, payload) {
  const api = new AxiosInstance(`/spot/${spotId}/image `);

  return api.axiosPost(payload);
}
