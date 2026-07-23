import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export default async function updateFavoriteImage(spotId, payload) {
  const api = new AxiosInstance(`/spot/${spotId}/image/favorite`);

  return api.axiosPut(payload);
}
