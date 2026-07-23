import React, { useState, useEffect, useCallback } from "react";
import { readTempTrend } from "../../../apis";
import Card from "../../../components/Card";
import { ColorAlert, Infos, DashToday } from "./TempVelAcelUtils";

// const res = {
//   dates: ["17/06", "18/06", "19/06", "20/06", "21/06", "22/06", "23/06"],
//   lastDate: "17/06 às 15h53",
//   redAlarm: 80.0,
//   temperature: {
//     alarms: [null, null, null, null, null, null, null],
//     instantTemp: 32.84,
//     maxTemp: 86.43,
//     minTemp: 24.43,
//   },
//   yellowAlarm: 30.0,
// };

const TemperatureStatus = (props) => {
  const [defaultData] = useState({
    dates: ["", "", "", "", "", "", ""],
    lastDate: "",
    redAlarm: null,
    disableAlarm: 1,
    temperature: {
      maxTempTrend: [null, null, null, null, null, null, null],
      instantTemp: null,
      maxTemp: null,
      minTemp: null,
    },
    yellowAlarm: null,
  });
  const [data, setData] = useState(defaultData);

  const loadData = useCallback(async (spotId) => {
    try {
      const { data } = await readTempTrend(spotId);
      setData(data);
    } catch (error) {
      // console.error(error);
    } finally {
      props.setLoading(false);
    }

    // readTempTrend(sensorId)
    //   .then((res) => {
    //     setData(res.data);
    //     props.setLoading(false);
    //   })
    //   .catch((err) => {
    //     // console.error(error);
    //     props.setLoading(false);
    //   });
  }, []);

  useEffect(() => {
    props.setLoading(true);
    loadData(props.spotId);
    return setData(defaultData);
  }, [props.spotId, loadData]);

  return (
    <Card className={props.className}>
      <div className="width-100p flex-column">
        <h6 className="cardTitle">TEMPERATURA</h6>
        <div className="parent-temp text-center">
          <span className="display-stack"></span>
          {data.dates.map((date, index) => (
            <p className={`textSize-14 flex-around Date${index}`} key={index}>
              {date}
            </p>
          ))}
          <p className="textSize-14 today flex-around">Hoje</p>
          <span className="background-table display-stack last-desktop1e4"></span>

          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[0]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary0 last-mobile2e3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[1]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary1"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[2]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary2"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[3]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[4]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary4"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[5]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary5"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"°C"}
            alarm={data.temperature.maxTempTrend[6]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary6"}
          />
          <DashToday
            max={data.temperature.maxTemp}
            min={data.temperature.minTemp}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            disableAlarm={data.disableAlarm}
            value={data.temperature.instantTemp}
            unity={"°C"}
            gridArea={"Temp last-desktop2e3"}
          />
        </div>
        <Infos
          yellowAlarm={data.yellowAlarm}
          redAlarm={data.redAlarm}
          lastDate={data.lastDate}
          disableAlarm={data.disableAlarm}
          unity={"°C"}
        />
      </div>
    </Card>
  );
};

export default TemperatureStatus;
