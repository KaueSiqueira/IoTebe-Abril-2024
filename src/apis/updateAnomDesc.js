import { AxiosInstance } from "./AxiosInstance";

export async function updateAnomDesc(spotId, anomId, anomDesc){
  const api = new AxiosInstance("updateanomdesc");
  const data = {
    "spot_id": spotId,
    "detected_anom_user_id": anomId,
    "anom_desc": anomDesc
  };

  return api.axiosPut(data);
};
