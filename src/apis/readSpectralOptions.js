import { AxiosInstance } from "./AxiosInstance";

export async function readSpectralOptions(spot_id) {
  const api = new AxiosInstance("readspectraloptions");

  return api.axiosPut({spot_id});
};
