import { AxiosInstance } from "./AxiosInstance";

export async function readSpectrumList(spotId) {
  const api = new AxiosInstance(`spot/${spotId}/spectrum_info`);

  return api.axiosGet();
}
