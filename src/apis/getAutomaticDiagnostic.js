import { AxiosInstance } from "./AxiosInstance";

export async function getAutomaticDiagnostic(spotId) {
  const api = new AxiosInstance(`/spot/${spotId}/automatic_diagnostic`);

  return api.axiosGet();
}
