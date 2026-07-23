import React, { useContext } from "react";
import {
  CheckCircle,
  Error,
  WarningRounded,
  ArrowForward,
} from "@mui/icons-material";
import { DataAlarm } from "../../../assets/customIcons";
import { colors, timeText } from "../../../utilities";
import { RightSideMenuContext, WhichRenderContext } from "../../../contexts";

const WhichAlert = ({ alarm }) => {
  if (alarm === "RED")
    return <Error style={{ color: colors.alarmCritical, fontSize: 40 }} />;
  if (alarm === "GREEN")
    return <CheckCircle style={{ color: colors.alarmOk, fontSize: 40 }} />;
  if (alarm === "YELLOW")
    return (
      <WarningRounded style={{ color: colors.alarmAlert, fontSize: 40 }} />
    );
  return <DataAlarm style={{ color: colors.darkGrey, fontSize: 40 }} />;
};

const makeText = (alarm, in_progress, last_alarmed_time) => {
  const now = Date.now() / 1000;

  return (
    <p className="">
      <strong>{`Estado ${alarm === "RED" ? "crítico" : "de alerta"}`}</strong>{" "}
      {in_progress &&
      last_alarmed_time !== null &&
      last_alarmed_time !== undefined &&
      last_alarmed_time !== 0
        ? timeText(Math.floor(now - last_alarmed_time))
        : "em andamento"}
    </p>
  );
};

const TextAlert = ({ alarm, in_progress, last_alarmed_time }) => {
  return (
    <div className="textSize-12 text-center">
      {alarm !== null && alarm?.length > 0 ? (
        alarm !== "GREEN" ? (
          makeText(alarm, in_progress, last_alarmed_time)
        ) : (
          <p className="mt-2">
            <strong>Tudo certo</strong> no momento
          </p>
        )
      ) : (
        <p className="mt-2">
          Alarmes desativados ou <br /> sem dados nas últimas 3 horas
        </p>
      )}
    </div>
  );
};

const StatusCard = ({ alarm_status, spot_status, last_alarmed_time }) => {
  const { setSpotPage } = useContext(WhichRenderContext);

  const status = alarm_status !== null ? alarm_status : spot_status;

  const color = (alarm) => {
    if (alarm === "RED") return "#FFCED1";
    if (alarm === "GREEN") return "rgba(28, 191, 33, 0.25)";
    if (alarm === "YELLOW") return "#FFF3AD";
    return "rgba(145, 145, 145, 0.25)";
  };

  const redirect = (alarm) => {
    (alarm === "RED" || alarm === "YELLOW") && setSpotPage("diagnostic");
  };

  const hover = (alarm) => {
    if (alarm === "RED" || alarm === "YELLOW") return "activeHover";
    return "";
  }

  return (
    <div
      className={`statusCard ${hover(status)}`}
      style={{
        backgroundColor: color(status),
        height: "126px",
      }}
      onClick={() => {
        redirect(status);
      }}
    >
      <div className="icon-text-align-center">
        <WhichAlert alarm={status} />
        <TextAlert
          className="text-status-center"
          alarm={status}
          in_progress={alarm_status !== spot_status}
          last_alarmed_time={last_alarmed_time}
        />
      </div>
    </div>
  );
};

const SensorStatus = (props) => {
  const { toggleSidemenu, sidemenuContext } = useContext(RightSideMenuContext);

  return (
    <div className="width-100p flex-column-between">
      <div className="closeSummary">
        <p>Resumo</p>
        <div className="arrowClose">
          <ArrowForward
            onClick={() => {
              if (sidemenuContext !== "summary") {
                toggleSidemenu("summary");
              } else {
                toggleSidemenu(undefined);
              }
            }}
          />
        </div>
      </div>
      <div className="height-90p">
        <h6 className="summaryTitle">Condição</h6>
        <StatusCard
          alarm_status={props.data.alarm_status}
          spot_status={props.data.spot_status}
          last_alarmed_time={props.data.last_alarmed_time}
        />
      </div>
    </div>
  );
};

export default SensorStatus;
