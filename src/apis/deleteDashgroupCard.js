import { AxiosInstance } from "./AxiosInstance";

export async function deleteDashgroupCard(spot_id, in_progress) {
  const api = new AxiosInstance("deletedashgroupcard");
  const data = {
    spot_id: spot_id,
    in_progress: in_progress
  };

  return api.axiosPut(data);
}
