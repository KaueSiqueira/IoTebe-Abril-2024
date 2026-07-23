import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export default async function getSpotImage(spotId, imageId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/image/${imageId}`);

  return api.axiosGet(cancelToken);
}
