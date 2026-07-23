import axios from "axios";
import { getCurrentAccessToken } from "../utilities";

export async function plotGroupCriticalSpots(spot_array, dateRange, spot_group_id, cancelToken) {
  const plotGroupCriticalspotsUrl = process.env.REACT_APP_HOST_ENDPOINT + "plotgroupcriticalspots";
  const accessToken = await getCurrentAccessToken();

  // const secondsTimezone = getCurrentTimezone() * 3600;
  // const start_date = (dateRange.startDate.getTime() / 1000 + secondsTimezone).toFixed();
  // const end_date = (dateRange.endDate.getTime() / 1000 + secondsTimezone).toFixed();
  const start_date = (dateRange.startDate.getTime()/1000).toFixed();
  const end_date = (dateRange.endDate.getTime()/1000).toFixed();

  return axios.put(
    plotGroupCriticalspotsUrl,
    {
      start_date: start_date.toString(),
      now_date: end_date.toString(),
      spot_array: spot_array,
      group_id: spot_group_id,
    },
    {
      headers: { Authorization: accessToken },
      cancelToken: cancelToken.token,
    }
  );
}
