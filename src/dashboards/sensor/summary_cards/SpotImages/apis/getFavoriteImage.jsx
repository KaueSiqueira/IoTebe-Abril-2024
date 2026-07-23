import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export default async function getFavoriteImage(spotId) {
  const api = new AxiosInstance(`/spot/${spotId}/image/favorite`);

  return api.axiosGet();
}
