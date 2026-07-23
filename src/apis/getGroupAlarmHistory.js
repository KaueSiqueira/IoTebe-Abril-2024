import { AxiosInstance } from "./AxiosInstance";

export async function getGroupAlarmHistory(groupId, cardType) {
  const queryParams = cardType ? { diagnostic_type: cardType } : null;

  const api = new AxiosInstance(`/group/${groupId}/alarm_history`);

  return api.axiosGet(null, queryParams);
}
