import { AxiosInstance } from "./AxiosInstance";

export async function getAlarmInfo(chartId) {
  const api = new AxiosInstance(`/chart/${chartId}/alarm_info`);

  return api.axiosGet();
}
