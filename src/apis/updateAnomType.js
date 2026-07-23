import { AxiosInstance } from "./AxiosInstance";

export async function updateAnomType(spotId, anomId, anomType){
  const api = new AxiosInstance("updateanomtype");
  const data = {
    "spot_id": spotId,
    "detected_anom_user_id": anomId,
    "anom_type": anomType
  };

  return api.axiosPut(data);
};
