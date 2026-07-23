import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export async function updateInstantSpectrum(spotId, payload) {
  const api = new AxiosInstance(`/spot/${spotId}/instant_spectrum`);

  return api.axiosPut(payload);
}
