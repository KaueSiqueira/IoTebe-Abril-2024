import { AxiosInstance } from "./AxiosInstance";

export async function readUserInfo() {
  const api = new AxiosInstance("readuserinfo");

  return api.axiosPut();
}
