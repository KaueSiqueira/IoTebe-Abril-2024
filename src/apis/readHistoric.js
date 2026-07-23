import { AxiosInstance } from "./AxiosInstance";

export async function readHistoric(spotId, dateRange) {
  const api = new AxiosInstance("readhistoric");
  const data = {
    spot_id: spotId,
    start_date: Math.floor(dateRange.startDate / 1000),
    end_date: Math.floor(dateRange.endDate / 1000),
  };

  return api.axiosPut(data);
}
