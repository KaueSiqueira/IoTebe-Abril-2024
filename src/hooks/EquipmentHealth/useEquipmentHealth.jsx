import { useContext, useEffect, useState } from "react";
import { RightSideMenuContext } from "../../contexts";

function useEquipmentHealth() {
  const {
    velocityAverage,
    accelerationAverage,
    standardSettings,
    keepAlarm,
    setKeepAlarm,
    isAutoEnabled,
  } = useContext(RightSideMenuContext);

  const [velocityAlarm, setVelocityAlarm] = useState(null);
  const [accelerationAlarm, setAccelerationAlarm] = useState(null);
  const [velocityValues, setVelocityValues] = useState(null);
  const [accelerationValues, setAccelerationValues] = useState(null);
  const [equipmentHealth, setEquipmentHealth] = useState("good");

  const getVelocityAlarmValues = (
    machineType,
    power,
    transmissionType,
    fixationType
  ) => {
    let defaultAlarms;

    if (machineType !== 2) {
      if (power > 300) {
        defaultAlarms =
          fixationType === 2
            ? { alert: 7.1, critical: 11 }
            : { alert: 4.5, critical: 7.1 };
      } else {
        defaultAlarms =
          fixationType === 2
            ? { alert: 4.5, critical: 7.1 }
            : { alert: 2.8, critical: 4.5 };
      }
    } else {
      if (power > 15 && transmissionType === 3) {
        defaultAlarms =
          fixationType === 2
            ? { alert: 4.5, critical: 7.1 }
            : { alert: 2.8, critical: 4.5 };
      } else {
        defaultAlarms =
          fixationType === 2
            ? { alert: 7.1, critical: 11 }
            : { alert: 4.5, critical: 7.1 };
      }
    }

    return defaultAlarms;
  };

  const getAccelerationAlarmValues = (maxRotation) => {
    let defaultAlarms;

    if (maxRotation <= 900) {
      defaultAlarms = { alert: 1, critical: 2 };
    } else if (maxRotation > 900 && maxRotation <= 4000) {
      defaultAlarms = { alert: 1.5, critical: 2.5 };
    } else {
      defaultAlarms = { alert: 2.5, critical: 4 };
    }

    return defaultAlarms;
  };

  const generateNumbersInRange = (start, end, totalNumbers) => {
    const interval = (end - start) / (totalNumbers - 1);
    const result = [];

    for (let i = 0; i < totalNumbers; i++) {
      result.push(start + interval * i);
    }

    return result;
  };

  const handleKeepAlarm = (e) => {
    setKeepAlarm(e.target.value);
  };

  useEffect(() => {
    if (velocityAverage > 0 && accelerationAverage > 0) {
      setVelocityAlarm(
        getVelocityAlarmValues(
          standardSettings.machineType,
          standardSettings.power,
          standardSettings.transmissionTypeId,
          standardSettings.fixationTypeId
        )
      );
      setAccelerationAlarm(
        getAccelerationAlarmValues(standardSettings.maxRotation)
      );
    } else {
      setVelocityAlarm(null);
      setAccelerationAlarm(null);
    }
  }, [accelerationAverage, standardSettings, velocityAverage]);

  useEffect(() => {
    const generateGaugeValues = (alert, critical, value) => {
      let numFirstGen = 7
      let numSecondGen = 4
      let numThirdGen = 7

      let maxGauge = alert + critical;
      if(maxGauge >= value) {}
      else if(alert + maxGauge >= value) {
        maxGauge = value;
        numFirstGen = 5;
        numSecondGen = 3;
      }
      else if(critical + maxGauge >= value) {
        maxGauge = value;
        numFirstGen = 4;
        numSecondGen = 3;
        numThirdGen = 8;
      }
      else if(critical * 3 + maxGauge >= value) {
        maxGauge = value;
        numFirstGen = 3;
        numSecondGen = 2;
        numThirdGen = 9;
      }
      else if(critical * 5 + maxGauge >= value) {
        maxGauge = value;
        numFirstGen = 2;
        numSecondGen = 2;
        numThirdGen = 9;
      }
      else {
        maxGauge = value;
        numFirstGen = 0;
        numSecondGen = 0;
        numThirdGen = 10;
      }
      const firstGen = generateNumbersInRange(0, alert, numFirstGen);
      const secondGen = generateNumbersInRange(alert, critical, numSecondGen);
      const thirdGen = generateNumbersInRange(critical, maxGauge, numThirdGen);
      const final = Array.from(
        new Set([...firstGen, ...secondGen, ...thirdGen])
      ).map((mapValue) => {
        return { value: Number(mapValue) };
      });

      return final;
    };

    if (velocityAlarm && accelerationAlarm) {
      setVelocityValues(
        generateGaugeValues(velocityAlarm.alert, velocityAlarm.critical, velocityAverage)
      );

      setAccelerationValues(
        generateGaugeValues(accelerationAlarm.alert, accelerationAlarm.critical, accelerationAverage)
      );

      if (
        velocityAverage >= velocityAlarm.critical ||
        accelerationAverage >= accelerationAlarm.critical
      ) {
        setEquipmentHealth("critical");
        setKeepAlarm("true");
      } else if (
        velocityAverage >= velocityAlarm.alert ||
        accelerationAverage >= accelerationAlarm.alert
      ) {
        setEquipmentHealth("alert");
        setKeepAlarm("true");
      } else {
        setEquipmentHealth("good");
        setKeepAlarm("false");
      }
    } else {
      setVelocityValues(null);
      setAccelerationValues(null);
      setEquipmentHealth("good");
      setKeepAlarm("false");
    }
  }, [
    accelerationAlarm,
    accelerationAverage,
    setKeepAlarm,
    velocityAlarm,
    velocityAverage,
  ]);

  return {
    velocityAverage,
    accelerationAverage,
    velocityAlarm,
    accelerationAlarm,
    velocityValues,
    accelerationValues,
    equipmentHealth,
    keepAlarm,
    handleKeepAlarm,
    isAutoEnabled,
  };
}

export default useEquipmentHealth;
