import { AxiosInstance } from "./AxiosInstance";

export async function updateAssociationRequest(group_id) {
  const api = new AxiosInstance(`/group/${group_id}/user/association_request`);

  return api.axiosPut();
}
