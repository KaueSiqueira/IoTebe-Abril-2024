import { AxiosInstance } from "./AxiosInstance";

export async function updateSoundAlarm(payload) {
  const api = new AxiosInstance(`/management_view/sound_alarm`);

  return api.axiosPut(payload);
}
