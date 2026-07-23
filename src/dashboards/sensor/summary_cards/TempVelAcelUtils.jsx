import React, { useEffect, useState } from "react";
import { CheckCircle, Error, Help, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { colors, formatUnixTimestamp } from "../../../utilities";
import { ClickAwayListener, Tooltip } from "@material-ui/core";

const MakeAlarm = ({ children, className, middle, parentClass }) => {
  let ismiddle = " background-table";
  if (middle) ismiddle = "";
  return (
    <div className={`width-100p height-100p row-center${ismiddle} ${parentClass}`}>
      <div className={className}>{children}</div>
    </div>
  );
};

const ColorAlert = ({ alarm, yellowAlarm, redAlarm, disableAlarm, middle, parentClass, unity }) => {
  const fontSize = 28;
  const [alarmIcon, setAlarmIcon] = useState(<Help style={{ fontSize: fontSize }} />);
  const [alarmText, setAlarmText] = useState(<div>Alarme não encontrado</div>);
  const [alarmColor, setAlarmColor] = useState("gray");
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!!redAlarm && !!yellowAlarm && disableAlarm !== 1) {
      if (alarm > 0) {
        setAlarmIcon(<CheckCircle style={{ fontSize: fontSize }} />);
        setAlarmText(<p>Tudo certo!</p>);
        setAlarmColor("green");
      }
      if (alarm >= yellowAlarm) {
        setAlarmIcon(<Error style={{ fontSize: fontSize }} />);
        setAlarmText(<p>Alarme de Alerta!</p>);
        setAlarmColor("yellow");
      }
      if (alarm >= redAlarm) {
        setAlarmIcon(<Error style={{ fontSize: fontSize }} />);
        setAlarmText(<p>Alarme Crítico!</p>);
        setAlarmColor("red");
      }
    }
    return () => {
      setAlarmIcon(<Help style={{ fontSize: fontSize }} />);
      setAlarmText(<div>Alarme não encontrado</div>);
      setAlarmColor("gray");
    };
  }, [alarm]);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        onMouseEnter={handleTooltipOpen}
        onMouseLeave={handleTooltipClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <div>
            {alarmText}
            {!!alarm && (
              <p>
                Max do dia: {alarm} {unity}
              </p>
            )}
          </div>
        }
        placement="top"
        arrow
      >
        <div className={parentClass} onClick={handleTooltipOpen}>
          <MakeAlarm
            className={`${alarmColor}-alarm square-alarm pointer`}
            parentClass={parentClass}
            middle={middle}
          >
            {alarmIcon}
          </MakeAlarm>
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};

const WhichBackground = ({ children, className, yellowAlarm, redAlarm, value, disableAlarm }) => {
  let color = null;
  if (disableAlarm === 0) {
    if (value >= redAlarm) color = "red";
    else if (value >= yellowAlarm) color = "yellow";
    else if (value < yellowAlarm && value != null) color = "green";
  }

  return <div className={`${color}-background ${className}`}>{children}</div>;
};

const whichArrowColor = (yellowAlarm, redAlarm, disableAlarm, value) => {
  if (disableAlarm === 0) {
    if (value >= redAlarm) return colors.alarmCritical;
    else if (value >= yellowAlarm) return colors.alarmAlert;
    else if (value < yellowAlarm && value != null) return colors.alarmOk;
  }
  return "black";
};

const DashToday = ({ max, min, yellowAlarm, redAlarm, disableAlarm, value, unity, middle, gridArea }) => {
  let ismiddle = "background-table";
  if (middle) ismiddle = "";
  return (
    <div className={`row-evenly today${gridArea} ${ismiddle}`}>
      <div className="column height-dashtoday">
        <div className="row-center ">
          <ArrowUpward
            style={{ color: whichArrowColor(yellowAlarm, redAlarm, disableAlarm, max), fontSize: 12 }}
          />
          <span className="textSize-12">{max ? max.toFixed(2) : "--"}</span>
        </div>

        <div className="row-center ">
          <ArrowDownward
            style={{ color: whichArrowColor(yellowAlarm, redAlarm, disableAlarm, min), fontSize: 12 }}
          />
          <span className="textSize-12">{min ? min.toFixed(2) : "--"}</span>
        </div>
      </div>
      <WhichBackground
        className={"border-radius-10 px-1"}
        yellowAlarm={yellowAlarm}
        redAlarm={redAlarm}
        disableAlarm={disableAlarm}
        value={value}
      >
        <span>
          {value ? value.toFixed(2) : "--"}
          <span className="textSize-12">{unity}</span>
        </span>
      </WhichBackground>
    </div>
  );
};

const Infos = ({ yellowAlarm, redAlarm, disableAlarm, lastDate, unity }) => {
  return (
    <div className="flex-end-between pad-x-10 width-100p">
      {disableAlarm === 0 ? (
        <div className="flex">
          <div className="yellow-alarm-color mr-2 height-30">
            <Error style={{ fontSize: 24 }} />
            <span className="ml-1 textSize-12 alarm-color">{`Alerta: a partir de ${
              yellowAlarm ? yellowAlarm.toFixed(2) : 0
            } ${unity}`}</span>
          </div>
          <div className="red-alarm-color height-30">
            <Error style={{ fontSize: 24 }} />
            <span className="ml-1 textSize-12 alarm-color">{`Crítico: a partir de ${
              redAlarm ? redAlarm.toFixed(2) : 0
            } ${unity}`}</span>
          </div>
        </div>
      ) : (
        <div className="red-alarm-color textSize-12">Alarme desativado</div>
      )}
      <div className="textSize-8">{typeof lastDate === "number" ? formatUnixTimestamp(lastDate) : ""}</div>
    </div>
  );
};

export { ColorAlert, WhichBackground, MakeAlarm, DashToday, Infos };
