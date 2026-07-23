import React, { useEffect, useState, useContext, useCallback } from "react";

import { WhichRenderContext } from "../../contexts";

import SensorStatus from "./summary_cards/SensorStatus";
import ConfigStatus from "./summary_cards/ConfigStatus/ConfigStatus";
import ConnectionStatus from "./summary_cards/ConnectionStatus";
import BatteryCard from "./summary_cards/BatteryCard";
import { AssociationModal, ComponentLoader } from "../../components";
import { Inbox, AddCircleOutline } from "@mui/icons-material";
import { getSpotSummary } from "../../apis";
import { ProtectedFeature } from "../../components/ProtectedFeature/ProtectedFeature";

const Summary = (props) => {
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [ConfigStatusIsLoading, setConfigStatusLoading] = useState(true);
  const [connectionCardIsLoading, setConnectionCardLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [batteryCardIsLoading, setBatteryCardLoading] = useState(true);
  const [hasSensor, setHasSensor] = useState(true);
  const [modalSpot, setModalSpot] = useState(false);
  const { selectedNode } = useContext(WhichRenderContext);
  const [defaultData] = useState({
    alarm_status: null,
    last_alarmed_time: null,
    spot_status: null,
  });
  const [summary, setSummary] = useState(defaultData);
  const [sensorConnection, setSensorConnection] = useState("unknow");
  const [gatewayConnection, setGatewayConnection] = useState("unknow");

  const loadData = useCallback(async (spotId) => {
    setSummaryLoading(true);
    try {
      const { data } = await getSpotSummary(spotId);
      if (JSON.stringify(data) !== "{}") {
        setSummary(data);
      } else {
        setSummary({
          alarm_status: null,
          last_alarmed_time: null,
          spot_status: null,
        });
      }
    } catch (error) {
      console.error(error);
      setSummary({
        alarm_status: null,
        last_alarmed_time: null,
        spot_status: null,
      });
    } finally {
      setSummaryLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData(props.spotId);
  }, [props.spotId, loadData]);

  useEffect(() => {
    setLoading(true);
    if (selectedNode.sensor_id === "" || selectedNode.sensor_id === null) {
      setHasSensor(false);
    } else setHasSensor(true);
    if (
      (!summaryLoading &&
        !ConfigStatusIsLoading &&
        !connectionCardIsLoading &&
        !batteryCardIsLoading) ||
      !hasSensor
    ) {
      setLoading(false);
    }
    return () => setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    summaryLoading,
    ConfigStatusIsLoading,
    connectionCardIsLoading,
    batteryCardIsLoading,
    setHasSensor,
    selectedNode.sensor_id,
  ]);

  return (
    <div className="parent">
      {modalSpot && (
        <AssociationModal
          showModal={modalSpot}
          className="modalSpot"
          toggleModal={() => setModalSpot(!modalSpot)}
          dismissFunc={() => setModalSpot(!modalSpot)}
          isOnTree={false}
          sensorId={selectedNode.sensor_id}
          newSpotId={selectedNode.id}
          style={
            window.screen.width < 992 ? { width: "95%" } : { width: "45vw" }
          }
        ></AssociationModal>
      )}
      {hasSensor ? (
        <>
          <SensorStatus
            className="SensorStatus"
            spotId={props.spotId}
            data={summary}
            setData={setSummary}
          />

          <ConfigStatus
            className="ConfigStatus"
            spotId={props.spotId}
            data={summary}
            setLoading={setConfigStatusLoading}
            setSummaryLoading={setSummaryLoading}
            summaryLoading={summaryLoading}
            loadData={loadData}
            sensorConnection={sensorConnection}
            sensorVersion={props.sensorVersion}
          />

          <ConnectionStatus
            className="ConectionStatus"
            spotId={props.spotId}
            setLoading={setConnectionCardLoading}
            sensorId={selectedNode.sensor_id}
            sensorConnection={sensorConnection}
            setSensorConnection={setSensorConnection}
            gatewayConnection={gatewayConnection}
            setGatewayConnection={setGatewayConnection}
          />
          <BatteryCard
            className="BatteryStatus"
            spotId={props.spotId}
            setLoading={setBatteryCardLoading}
          />
        </>
      ) : (
        <div className="noSensorDiv">
          <Inbox className="noSensorDivIcon" />
          <h3 style={{ fontSize: "1rem", marginTop: 10, marginBottom: 20 }}>
            Nenhum sensor associado no momento
          </h3>
          <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
            <button
              className="rounded-button-with-icon"
              onClick={() => setModalSpot(true)}
            >
              <AddCircleOutline style={{ color: "white", fontSize: 16 }} />
              Associar Sensor
            </button>
          </ProtectedFeature>
        </div>
      )}
      {loading && <ComponentLoader />}
    </div>
  );
};

export default Summary;
