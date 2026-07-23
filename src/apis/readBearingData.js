import { AxiosInstance } from "./AxiosInstance";

export async function readBearingData(page, search) {
  const api = new AxiosInstance("readbearingdata");
  const data = {
    page: page.toString(),
    search: search,
  };

  return api.axiosPut(data);
}
