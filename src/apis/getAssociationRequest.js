import { AxiosInstance } from "./AxiosInstance";

export async function getAssociationRequest() {
  const api = new AxiosInstance(`/user/association_request`);

  return api.axiosGet();
}
