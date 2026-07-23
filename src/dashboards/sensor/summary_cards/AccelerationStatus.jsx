import React, { useCallback, useEffect, useState } from "react";
import { readAcelTrend } from "../../../apis";
import Card from "../../../components/Card";
import { ColorAlert, MakeAlarm, Infos, DashToday } from "./TempVelAcelUtils";

const AcelerationStatus = (props) => {
  const [defaultData] = useState({
    yellowAlarm: null,
    redAlarm: null,
    lastDate: null,
    disableAlarm: 1,
    dates: ["", "", "", "", "", "", ""],
    vertical: {
      instantAcel: null,
      maxAcel: null,
      minAcel: null,
      alarmsValues: [null, null, null, null, null, null, null],
    },
    horizontal: {
      instantAcel: null,
      maxAcel: null,
      minAcel: null,
      alarmsValues: [null, null, null, null, null, null, null],
    },
    axial: {
      instantAcel: null,
      maxAcel: null,
      minAcel: null,
      alarmsValues: [null, null, null, null, null, null, null],
    },
  });
  const [data, setData] = useState(defaultData);

  const loadData = useCallback(async (spotId) => {
    try {
      const { data } = await readAcelTrend(spotId);
      setData(data);
    } catch (error) {
      // console.error(error)
    } finally {
      props.setLoading(false);
    }

    // readAcelTrend(sensorId)
    //   .then((res) => {
    //     // console.log(res);
    //     setData(res.data);
    //     props.setLoading(false);
    //   })
    //   .catch((err) => {
    //     // console.log(err);
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
        <h6 className="cardTitle">Aceleração</h6>
        <div className="parent-VelAcel text-center">
          <span></span>

          {data.dates.map((date, index) => (
            <p className={`textSize-14 flex-around Date${index}`} key={index}>
              {date}
            </p>
          ))}
          <p className="textSize-14 today flex-around">Hoje</p>

          {/* -----------------------------VERTICAL--------------------------------------------------------------------------------- */}
          <MakeAlarm className="ml-1" parentClass="last-desktop1">
            <p className="full-text">Vertical:</p>
            <p className="short-text">Vert:</p>
          </MakeAlarm>

          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[0]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary0 last-mobile4"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[1]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary1"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[2]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary2"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[3]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[4]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary4"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[5]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary5"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.vertical.alarmsValues[6]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"primary6"}
          />

          <DashToday
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            disableAlarm={data.disableAlarm}
            max={data.vertical.maxAcel}
            min={data.vertical.minAcel}
            value={data.vertical.instantAcel}
            unity={"g"}
            gridArea={"Vert last-desktop2"}
          />
          {/* -------------------------HORIZONTAL------------------------------------------------------------------------------------- */}
          <MakeAlarm className="ml-1" middle>
            <p className="full-text">Horizontal:</p>
            <p className="short-text">Hori:</p>
          </MakeAlarm>

          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[0]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second0"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[1]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second1"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[2]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second2"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[3]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[4]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second4"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[5]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second5"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.horizontal.alarmsValues[6]}
            middle
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"second6"}
          />

          <DashToday
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            disableAlarm={data.disableAlarm}
            max={data.horizontal.maxAcel}
            min={data.horizontal.minAcel}
            value={data.horizontal.instantAcel}
            unity={"g"}
            gridArea={"Hor"}
            middle
          />
          {/* -----------------------AXIAL--------------------------------------------------------------------------------------- */}
          <MakeAlarm className="ml-1" parentClass="last-desktop4">
            <p className="full-text">Axial:</p>
            <p className="short-text">Axi:</p>
          </MakeAlarm>

          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[0]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third0 last-mobile3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[1]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third1"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[2]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third2"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[3]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third3"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[4]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third4"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[5]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third5"}
          />
          <ColorAlert
            disableAlarm={data.disableAlarm}
            unity={"g"}
            alarm={data.axial.alarmsValues[6]}
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            parentClass={"third6"}
          />

          <DashToday
            yellowAlarm={data.yellowAlarm}
            redAlarm={data.redAlarm}
            disableAlarm={data.disableAlarm}
            max={data.axial.maxAcel}
            min={data.axial.minAcel}
            value={data.axial.instantAcel}
            unity={"g"}
            gridArea={"Axi last-desktop3"}
          />
        </div>
        <Infos
          yellowAlarm={data.yellowAlarm}
          redAlarm={data.redAlarm}
          lastDate={data.lastDate}
          disableAlarm={data.disableAlarm}
          unity={"g"}
        />
      </div>
    </Card>
  );
};

export default AcelerationStatus;
