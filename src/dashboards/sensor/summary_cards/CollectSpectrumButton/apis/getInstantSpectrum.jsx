import { AxiosInstance } from "../../../../../apis/AxiosInstance";

export async function getInstantSpectrum(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/instant_spectrum`);

  return api.axiosGet(cancelToken);
}
