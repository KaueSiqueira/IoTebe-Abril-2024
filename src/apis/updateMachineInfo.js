import { AxiosInstance } from "./AxiosInstance";

export async function updateMachineInfo(spot_id, payload) {
  const api = new AxiosInstance(`/spot/${spot_id}/machine_info`);

  return api.axiosPut(payload);
}
