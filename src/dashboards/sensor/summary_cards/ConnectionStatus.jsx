import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  Cloud,
  Error,
  Help,
  Router,
  RadioButtonChecked,
} from "@mui/icons-material";
import { colors } from "../../../utilities";
import { readSpotConnection } from "../../../apis";
import { IconConnection } from "../../../components";

const ConnectionStatus = (props) => {
  const [gatewayId, setGatewayId] = useState("");

  const loadData = useCallback(async (spotId) => {
    try {
      const { data } = await readSpotConnection(spotId);
      setGatewayId(data.gateway_id);

      if (data.gateway_connectivity === 1) {
        props.setGatewayConnection("connected");
      } else if (data.gateway_connectivity === 0) {
        props.setGatewayConnection("disconnected");
        props.setSensorConnection("unknow");
      } else {
        props.setGatewayConnection("unknow");
      }

      if (data.spot_connectivity === 1 && data.gateway_connectivity === 1) {
        props.setSensorConnection("connected");
      } else if (data.spot_connectivity === 0) {
        props.setSensorConnection("disconnected");
      } else {
        props.setSensorConnection("unknow");
      }
    } catch (error) {
      props.setGatewayConnection("unknow");
      props.setSensorConnection("unknow");
      setGatewayId("");
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
      <h6 className="summaryTitle">Status de Conexão</h6>
      <div className="width-100p column-connection height-70p">
        <div className="gateway row-center mx-2">
          {/* Sensor ICON */}
          <div className="contentAlignGateway">
            <div className="sizeIcon">
              <RadioButtonChecked style={{ fontSize: "25px" }} />
            </div>

            <span className="pStatusConnection">{props.sensorId}</span>
          </div>

          {/* StatusConnection 1 ICON */}
          <div className="connectionStatusIcon">
            <IconConnection
              tooltipTitle={
                props.sensorConnection == "connected" ? (
                  <p style={{ textAlign: "center" }}>
                    Bluetooth <br />
                    conectado
                  </p>
                ) : props.sensorConnection == "disconnected" ? (
                  <p style={{ textAlign: "center" }}>
                    Bluetooth <br />
                    desconectado
                  </p>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Bluetooth <br />
                    sem sinal
                  </p>
                )
              }
              icon={
                props.sensorConnection == "connected"
                  ? CheckCircle
                  : props.sensorConnection == "disconnected"
                  ? Error
                  : Help
              }
              colorIcon={
                props.sensorConnection == "connected"
                  ? colors.alarmOk
                  : props.sensorConnection == "disconnected"
                  ? colors.alarmCritical
                  : colors.darkGrey
              }
            />
          </div>

          {/* Gateway ICON */}
          <div className="contentAlignGateway">
            <div className="sizeIcon">
              <Router
                style={{
                  fontSize: "32px",
                }}
              />
            </div>
            <p className="pStatusConnection">
              {gatewayId != null ? gatewayId : "Não vinculado"}
            </p>
          </div>

          {/* StatusConnection 2 ICON */}
          <div className="connectionStatusIcon">
            <IconConnection
              tooltipTitle={
                props.gatewayConnection == "connected" ? (
                  <p style={{ textAlign: "center" }}>
                    Internet <br />
                    conectada
                  </p>
                ) : props.gatewayConnection == "disconnected" ? (
                  <p style={{ textAlign: "center" }}>
                    Internet <br />
                    desconectada
                  </p>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Internet <br />
                    sem sinal
                  </p>
                )
              }
              icon={
                props.gatewayConnection == "connected"
                  ? CheckCircle
                  : props.gatewayConnection == "disconnected"
                  ? Error
                  : Help
              }
              colorIcon={
                props.gatewayConnection == "connected"
                  ? colors.alarmOk
                  : props.gatewayConnection == "disconnected"
                  ? colors.alarmCritical
                  : colors.darkGrey
              }
            />
          </div>

          {/* Cloud ICON */}
          <div className="contentAlignGateway spaceCloud">
            <div className="sizeIcon">
              <Cloud style={{ fontSize: "32px" }} />
            </div>
            <p className="pStatusConnection">IoTebe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
