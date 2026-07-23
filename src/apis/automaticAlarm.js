import { AxiosInstance } from "./AxiosInstance";

export const automaticAlarm = async (chartId, dateRange, advOpts, spectral = false) => {
  const api = new AxiosInstance("automaticalarm");
  const data = {
    custom_chart_id: chartId,
    start_date: Math.floor(dateRange.startDate / 1000),
    end_date: Math.floor(dateRange.endDate / 1000),
    adv_opts: advOpts,
    spectral: spectral
  };

  return api.axiosPut(data);
};
