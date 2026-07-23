import { AxiosInstance } from "./AxiosInstance";

export async function updateDiagnosticCard(spot_id, diagnostic_id, payload) {
  const api = new AxiosInstance(
    `/spot/${spot_id}/alarm_history/${diagnostic_id}`
  );

  return api.axiosPut(payload);
}
