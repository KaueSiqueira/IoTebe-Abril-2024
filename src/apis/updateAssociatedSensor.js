import { AxiosInstance } from "./AxiosInstance";

export async function updateAssociatedSensor(
  new_spot_id = null,
  sensor_id = null,
) {
  const api = new AxiosInstance("updateassociatedsensor");
  const data = { new_spot_id, sensor_id};

  return api.axiosPut(data);
}
