import { AxiosInstance } from "./AxiosInstance";

export async function updateChartAlarms(chartId, disableAlarm, alarmAlert, alarmCritical, triggerCondition) {
  const api = new AxiosInstance("updatechartalarms");
  const data = {
    custom_chart_id: chartId,
    disable_alarm: disableAlarm,
    alarm_alert: alarmAlert,
    alarm_critical: alarmCritical, 
    trigger_condition: triggerCondition
  };
  
  return api.axiosPut(data);
}