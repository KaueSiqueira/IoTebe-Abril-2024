import { AxiosInstance } from "./AxiosInstance";

export async function getSoundAlarm() {
  const api = new AxiosInstance(`/management_view/sound_alarm`);

  return api.axiosGet();
}
