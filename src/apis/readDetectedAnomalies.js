import { AxiosInstance } from "./AxiosInstance";

export const readAllDetectedAnomalies = async (spotId, startDate, endDate) => {
  const api = new AxiosInstance("readalldetectedanomalies");
  const data = {
    spot_id: spotId,
  };

  return api.axiosPut(data);
};
