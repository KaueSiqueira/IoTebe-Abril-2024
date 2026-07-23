import { AxiosInstance } from "./AxiosInstance";

export async function activateAutomaticDiagnostic(spot_id, payload) {
  const api = new AxiosInstance(
    `/spot/${spot_id}/automatic_diagnostic/activate`
  );

  return api.axiosPut(payload);
}
