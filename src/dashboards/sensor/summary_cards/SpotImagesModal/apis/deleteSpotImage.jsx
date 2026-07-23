import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export async function deleteSpotImage(spotId, imageId) {
  const api = new AxiosInstance(`/spot/${spotId}/image/${imageId}`);

  return api.axiosDelete();
}
