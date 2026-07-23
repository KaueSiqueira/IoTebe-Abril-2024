import { AxiosInstance } from "./AxiosInstance";

export async function readManagmentView(plantId) {
  const api = new AxiosInstance("readmanagmentview");
  const data = {
    plant_id: plantId,
  };

  return api.axiosPut(data);
}
