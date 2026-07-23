import { AxiosInstance } from "./AxiosInstance";

export const toggleAnomDetection = async (spotId, setActive) => {
  const api = new AxiosInstance("toggleanomdetection");
  const data = {
    spot_id: spotId,
    setActive: setActive,
  };

  return api.axiosPut(data);
};
