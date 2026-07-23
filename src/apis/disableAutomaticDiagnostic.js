import { AxiosInstance } from "./AxiosInstance";

export async function disableAutomaticDiagnostic(spot_id) {
  const api = new AxiosInstance(
    `/spot/${spot_id}/automatic_diagnostic/disable`
  );

  return api.axiosPut();
}
