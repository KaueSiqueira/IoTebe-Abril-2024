import { AxiosInstance } from "./AxiosInstance";

export async function updateAutomaticDiagnostic(spot_id, payload) {
  const api = new AxiosInstance(`/spot/${spot_id}/automatic_diagnostic`);

  return api.axiosPut(payload);
}
