import Axios from "axios";
import { getCurrentAccessToken, getCurrentTimezone, getSevenDaysAgoTimestamp } from "../utilities";

export async function plotGroupAlarmsTrend(spot_array, spot_group_id, cancelToken) {
  const plotGroupAlarmsTrendUrl = process.env.REACT_APP_HOST_ENDPOINT + "plotgrouptrendalarms";
  const accessToken = await getCurrentAccessToken();

  return Axios.put(
    plotGroupAlarmsTrendUrl,
    {
      timezone: getCurrentTimezone().toString(),
      start_date: (getSevenDaysAgoTimestamp() + getCurrentTimezone() * 3600).toString(),
      spot_array: spot_array,
      group_id: spot_group_id,
    },
    {
      headers: { Authorization: accessToken },
      cancelToken: cancelToken.token,
    }
  );
}
