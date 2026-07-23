import axios from "axios";
import { getCurrentAccessToken } from "../utilities";

export async function readSpectrumData(spotId, dataId, spectrumType, filter, cancelToken) {
  const readSpectrumDataUrl = process.env.REACT_APP_HOST_ENDPOINT + "readspectrumdata";
  const accessToken = await getCurrentAccessToken();

  return axios.put(
    readSpectrumDataUrl,
    {
      spot_id: spotId,
      raw_data_id: dataId,
      type: spectrumType,
      envelope_freq_min: filter.min,
      envelope_freq_max: filter.max,
    },
    {
      headers: {
        Authorization: accessToken,
      },
      cancelToken: cancelToken.token,
    }
  );
}
