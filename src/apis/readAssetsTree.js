import { AxiosInstance } from "./AxiosInstance";

export async function readAssetsTree() {
  const api = new AxiosInstance("readassetstree");

  return api.axiosPut();
}
