import {
  PermScanWifi,
  SignalWifi1Bar,
  SignalWifi2Bar,
  SignalWifi3Bar,
  SignalWifi4Bar,
  SignalWifiOff,
} from "@mui/icons-material";
import React from "react";

import { colors } from "../utilities";

function SignalIcon(props) {
  if (props.signal === 0) return <SignalWifiOff style={{ color: colors.alarmCritical }} />;
  else if (props.signal <= 25) return <SignalWifi1Bar style={{ color: colors.alarmOk }} />;
  else if (props.signal <= 50) return <SignalWifi2Bar style={{ color: colors.alarmOk }} />;
  else if (props.signal <= 75) return <SignalWifi3Bar style={{ color: colors.alarmOk }} />;
  else if (props.signal <= 100) return <SignalWifi4Bar style={{ color: colors.alarmOk }} />;
  else return <PermScanWifi style={{ color: colors.darkGrey }} />;
}

export default SignalIcon;
