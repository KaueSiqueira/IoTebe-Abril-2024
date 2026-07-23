import { AxiosInstance } from "./AxiosInstance";

export async function getOpenDiagnostic(spotId, cancelToken) {
  const api = new AxiosInstance(`/spot/${spotId}/open_diagnostic`);

  return api.axiosGet(cancelToken);
}
