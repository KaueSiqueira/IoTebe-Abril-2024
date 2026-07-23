import React, { useCallback, useEffect, useState } from "react";
import { readBattery } from "../../../apis";
import { colors } from "../../../utilities";

const colorLevel = (level) => {
  if (level > 50) return colors.alarmOk;
  if (level > 15) return colors.alarmAlert;
  return colors.alarmCritical;
};

function BatteryStatus(props) {
  const [batteryLevel, setBatteryLevel] = useState(0);

  const loadData = useCallback(async (spotId) => {
    try {
      const res = await readBattery(spotId);

      !res.data.battery_level ||
      res.data.battery_level <= 0 ||
      res.data.battery_level > 100
        ? setBatteryLevel(0)
        : setBatteryLevel(res.data.battery_level);
    } catch (error) {
      setBatteryLevel(0);
    } finally {
      props.setLoading(false);
    }
  }, []);

  useEffect(() => {
    props.setLoading(true);
    loadData(props.spotId);
  }, [props.spotId, loadData]);

  return (
    <div className="width-100p">
      <h6 className="summaryTitle display-title">Bateria</h6>
      <div
        className="batteryCard"
        style={{
          color: colorLevel(batteryLevel),
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: 10,
            backgroundColor: colors.lightGray,
          }}
          className="display-title"
        >
          <div
            style={{
              width: `${batteryLevel}%`,
              borderRadius: 10,
              backgroundColor: colorLevel(batteryLevel),
            }}
            className="batteryStatusBar"
          ></div>
        </div>

        <div>
          <span className="text-battery">
            {batteryLevel ? batteryLevel.toFixed(0) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default BatteryStatus;
