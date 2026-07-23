import { AxiosInstance } from "./AxiosInstance";

export async function getClosedDiagnostic(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/closed_diagnostic`);

  return api.axiosGet(cancelToken);
}
