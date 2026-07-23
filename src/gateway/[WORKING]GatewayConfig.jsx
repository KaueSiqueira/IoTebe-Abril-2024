import React, { useEffect, useState } from "react";

import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";
import { Auth } from "aws-amplify";
import Amplify from "aws-amplify";

import { ArrowBack, Check, Edit, Refresh  } from "@mui/icons-material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, CustomInput, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Card, ComponentLoader, LabeledCard } from "../components";
import styled from "styled-components";

import { withRouter } from "react-router-dom";
import { checkNetworkError } from "../utilities";

import SensorCard from "./SensorCard";

import "./Gateway.css";
import { gatewayCommandSend, gatewaySensorsDatabase, updateGatewayName, updateGatewaySensor } from "../apis";

const SensorList = styled.div`
  height: 180px;
  overflow-y: auto;
  height: 410px;
  margin: 20px;
  background-color: ${(props) => (props.isDraggingOver ? "#FBFDFC" : "white")};
`;

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "us-east-2",
    aws_pubsub_endpoint: `wss://a2zvr3bz3xo7zj-ats.iot.us-east-2.amazonaws.com/mqtt`,
  })
);

function GatewayConfig(props, { gatewayId, backToList, className }) {
  const [username, setUsername] = useState("");
  const [gateway_name, setGateway_name] = useState("");
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [changeColor, setChangeColor] = useState(false);
  const [listData, setListData] = useState({});
  const [availableSensors, setAvailableSensors] = useState([]);
  const [registeredSensors, setRegisteredSensors] = useState([]);
  const [rmstempCollectPeriod, setRmstempCollectPeriod] = useState("");
  const [rmstempCollectPeriod_range, setRmstempCollectPeriod_range] = useState("");
  const [gateway_id, setGateway_id] = useState("");
  const [toggleVisibleSensors, setToggleVisibleSensors] = useState(false);
  const [modalVisibleSensor, setModalVisibleSensor] = useState(false);
  const [modalTimeOutError, setModalTimeOutError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVisibleSensors, setIsLoadingVisibleSensors] = useState(false);
  const [subs_timestamp, setSubs_timestamp] = useState("");
  const [mqttTopic, setMqttTopic] = useState("");
  const [payloadReceived, setPayloadReceived] = useState(false);
  const [cognito_identity_id, setCognito_identity_id] = useState("");

  const authUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUsername(user.username);
      getList();
    } catch (error) {
      props.history.push("/login");
    }
  };

  const authenticate = async () => {
    try {
      const info = await Auth.currentCredentials();
      setCognito_identity_id(info.data.IdentityId);
      authUser();
    } catch (err) {}
  };

  const getList = async () => {
    try {
      const res = await gatewaySensorsDatabase(props.gatewayId, cognito_identity_id);

      const { columns, sensors } = res.data;
      const available = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
      const registered = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

      setListData(res.data);
      setRmstempCollectPeriod(`${res.data.rmstempCollectPeriod} min`);
      setRmstempCollectPeriod_range(res.data.rmstempCollectPeriod);
      setAvailableSensors(available);
      setRegisteredSensors(registered);
      setGateway_name(res.data.gateway_name);
      setGateway_id(props.gatewayId);
      setIsLoading(false);
    } catch (error) {}
  };

  const updateName = async () => {
    try {
      await updateGatewayName(props.gatewayId, gateway_name);
      setTitleEditMode(false);
    } catch (error) {}
  };

  const subscribeGateway = async () => {
    const actual_timestamp = (Date.now() / 1000).toFixed(0);
    let timeoutId;

    const topic = `dev/frontend/gatewayConfig/${username}/${gateway_id}/${actual_timestamp}`;

    setSubs_timestamp(actual_timestamp);
    setMqttTopic(topic);
    setPayloadReceived(false);

    try {
      console.log(toggleVisibleSensors);
      Amplify.PubSub.subscribe(topic).subscribe({
        next: (data) => {
          // if (toggleVisibleSensors === true) {
          const { columns, sensors } = data.value;
          const availableSensors = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
          const registeredSensors = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

          console.log(availableSensors);
          console.log(registeredSensors);

          setListData(listData);
          setAvailableSensors(availableSensors);
          setRegisteredSensors(registeredSensors);
          setPayloadReceived(true);
          setIsLoadingVisibleSensors(false);
          clearTimeout(timeoutId);
          // }
        },
        error: (error) => {},
        close: () => {},
      });
    } catch (error) {
      console.log(error.message);
    }

    try {
      const res = await gatewayCommandSend({
        cognito_identity_id: cognito_identity_id,
        gateway_id: gateway_id,
        gateway_payload: {
          function: "scan_nearby_sensors",
          path_back: {
            topic_timestamp: actual_timestamp,
            username: username,
            component: "gatewayConfig",
          },
        },
      });

      const gateway_status = res.data.connected;

      if (gateway_status === "FALSE") {
        setToggleVisibleSensors(false);
        setModalVisibleSensor(true);
        setIsLoadingVisibleSensors(false);
      }

      if (gateway_status === "TRUE" && !!payloadReceived) {
        timeoutId = setTimeout(() => {
          if (isLoadingVisibleSensors === true) {
            setModalTimeOutError(true);
            setIsLoadingVisibleSensors(false);
            setToggleVisibleSensors(false);
          }
        }, 15000);
      }
    } catch (err) {}
  };

  const refreshVisibleSensors = () => {
    setIsLoadingVisibleSensors(true);

    const last_timestamp = subs_timestamp;
    const actual_timestamp = (Date.now() / 1000).toFixed(0);

    if (actual_timestamp - last_timestamp <= 10) {
      setTimeout(subscribeGateway(), 15000 - (actual_timestamp - last_timestamp) * 1000);
    } else {
      subscribeGateway();
    }
  };

  const showVisibleSensors = async () => {
    setIsLoadingVisibleSensors(true);
    setToggleVisibleSensors((prev) => !prev);
    // setToggleVisibleSensors

    const last_timestamp = subs_timestamp;
    const actual_timestamp = (Date.now() / 1000).toFixed(0);

    if (!toggleVisibleSensors && actual_timestamp - last_timestamp <= 10) {
      // console.log("true");
      setTimeout(await subscribeGateway(), 15000 - (actual_timestamp - last_timestamp) * 1000);
    } else {
      // console.log("false");
      await subscribeGateway();
    }
    // setToggleVisibleSensors((prev) => !prev);

    // if (toggleVisibleSensors) {
    //   try {
    //     const res = await gatewaySensorsDatabase(username, gateway_id);

    //     const { columns, sensors } = res.data;
    //     const availableSensors = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
    //     const registeredSensors = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

    //     setListData(listData);
    //     setAvailableSensors(availableSensors);
    //     setRegisteredSensors(registeredSensors);
    //     setIsLoadingVisibleSensors(false);
    //     setPayloadReceived(false);
    //   } catch (error) {}
    // }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (destination.droppableId === "registeredSensors") {
      const sensor_id = draggableId;
      try {
        await updateGatewaySensor(sensor_id, props.gatewayId);
      } catch (error) {}
    }

    if (destination.droppableId === "availableSensors") {
      const sensor_id = draggableId;
      try {
        await updateGatewaySensor(sensor_id, null);
      } catch (error) {}
    }

    const start = listData.columns[source.droppableId];
    const finish = listData.columns[destination.droppableId];

    if (start === finish) {
      const newSensorIds = Array.from(start.sensorIds);
      newSensorIds.splice(source.index, 1);
      newSensorIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        sensorIds: newSensorIds,
      };

      const newState = {
        ...listData,
        columns: {
          ...listData.columns,
          [newColumn.id]: newColumn,
        },
      };

      const { columns, sensors } = newState;
      const availableSensors = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
      const registeredSensors = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

      setListData(newState);
      setAvailableSensors(availableSensors);
      setRegisteredSensors(registeredSensors);
    } else {
      const startSensorIds = Array.from(start.sensorIds);
      startSensorIds.splice(source.index, 1);

      const newStart = {
        ...start,
        sensorIds: startSensorIds,
      };

      const finishSensorIds = Array.from(finish.sensorIds);
      finishSensorIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        sensorIds: finishSensorIds,
      };

      const newState = {
        ...listData,
        columns: {
          ...listData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      const { columns, sensors } = newState;
      const availableSensors = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
      const registeredSensors = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

      setListData(newState);
      setAvailableSensors(availableSensors);
      setRegisteredSensors(registeredSensors);
    }
  };

  const toggleGatewayConnected = () => setModalVisibleSensor((prev) => !prev);

  const toggleTimeOutError = () => setModalTimeOutError((prev) => !prev);

  useEffect(() => {
    console.log("toggleVisibleSensors:", toggleVisibleSensors);

    const api = async () => {
      try {
        const res = await gatewaySensorsDatabase(username, gateway_id);

        const { columns, sensors } = res.data;
        const availableSensors = columns.availableSensors.sensorIds.map((sensorId) => sensors[sensorId]);
        const registeredSensors = columns.registeredSensors.sensorIds.map((sensorId) => sensors[sensorId]);

        setListData(listData);
        setAvailableSensors(availableSensors);
        setRegisteredSensors(registeredSensors);
        setIsLoadingVisibleSensors(false);
        setPayloadReceived(false);
      } catch (error) {}
    };

    if (toggleVisibleSensors) {
      api();
    }
  }, [toggleVisibleSensors]);

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      {isLoading && <ComponentLoader />}

      {isLoadingVisibleSensors && <ComponentLoader />}

      <div style={{ width: "100%", height: "100%" }}>
        <Card height="65px">
          <Button
            onClick={() => {
              props.backToList();
            }}
            style={{ backgroundColor: "white", borderColor: "white", padding: 0, marginRight: 12 }}
          >
            <ArrowBack style={{ color: "black" }} />
          </Button>

          {titleEditMode ? (
            <div className="gateway-title-editMode">
              <Label hidden></Label>

              <Input
                style={{
                  fontSize: "18px",
                  color: "black",
                  fontWeight: 600,
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: "auto",
                }}
                bsSize="lg"
                maxLength={25}
                type="input"
                name="gateway_name"
                id="gateway_name"
                value={gateway_name}
                onChange={(event) => setGateway_name(event.target.value)}
              ></Input>

              <Button
                onClick={updateName}
                style={{ backgroundColor: "white", borderColor: "white", padding: 0 }}
              >
                {" "}
                <Check style={{ color: "black" }}></Check>
              </Button>
            </div>
          ) : (
            <div className="gateway-title-editMode">
              <legend style={{ fontSize: "18px", margin: "auto", fontWeight: 600, marginBlock: "auto" }}>
                {gateway_name}
              </legend>
              <Button
                onClick={() => setTitleEditMode(true)}
                style={{ backgroundColor: "white", borderColor: "white", padding: 0 }}
              >
                {" "}
                <Edit style={{ color: "black" }}></Edit>
              </Button>
            </div>
          )}
        </Card>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row" style={{ width: "100%" }}>
            <LabeledCard className="col-12 col-md-6" title="SENSORES DISPONÍVEIS">
              <Droppable droppableId={"availableSensors"}>
                {(provided, snapshot) => (
                  <SensorList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    onClick={() => setChangeColor((prev) => !prev)}
                  >
                    {availableSensors.map((sensor, index) => (
                      <SensorCard key={sensor.id} sensor={sensor} index={index} changeColor={changeColor} />
                    ))}
                    {provided.placeholder}
                  </SensorList>
                )}
              </Droppable>

              <div className="gateway-container-sensorCard-footer">
                {toggleVisibleSensors ? (
                  <button
                    id="refreshButton"
                    disabled={isLoadingVisibleSensors}
                    style={{ border: "none", backgroundColor: "whitesmoke" }}
                    onClick={refreshVisibleSensors}
                  >
                    <Refresh />
                  </button>
                ) : null}

                <div className="gateway-container-sensorCard-footer-paragraph">
                  Mostrar somente os sensores visíveis
                </div>

                <div className="gateway-container-sensorCard-footer-switch">
                  <CustomInput
                    checked={toggleVisibleSensors}
                    onChange={showVisibleSensors}
                    type="switch"
                    id="showVisibleSensors"
                    name="showVisibleSensors"
                  ></CustomInput>
                </div>
              </div>
            </LabeledCard>

            <LabeledCard className="col-12 col-md-6" title="SENSORES ASSOCIADOS">
              <Droppable droppableId={"registeredSensors"}>
                {(provided, snapshot) => (
                  <SensorList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {registeredSensors.map((sensor, index) => (
                      <SensorCard key={sensor.id} sensor={sensor} index={index} />
                    ))}
                    {provided.placeholder}
                  </SensorList>
                )}
              </Droppable>
            </LabeledCard>
          </div>
        </DragDropContext>

        <Card>
          <div className="gateway-footer">
            <span style={{ color: "gray", fontSize: 12 }}>ID do Gateway: {gateway_id}</span>
            <span style={{ color: "gray", fontSize: "12px" }}>Versão firmware: 0.1.0</span>
            <span style={{ color: "gray", fontSize: 12 }}>
              Periodicidade de medição: {rmstempCollectPeriod}{" "}
            </span>
          </div>
        </Card>
      </div>

      <Modal isOpen={modalVisibleSensor} toggle={toggleGatewayConnected} className={props.className} centered>
        <ModalHeader toggle={toggleGatewayConnected}>Configurações do Gateway</ModalHeader>

        <ModalBody>
          <p>O Gateway {gateway_id} está desconectado.</p>
          <p>Verifique a conexão e tente novamente.</p>
        </ModalBody>

        <ModalFooter>
          <Button onClick={toggleGatewayConnected} color="primary">
            OK
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalTimeOutError} toggle={toggleTimeOutError} className={props.className} centered>
        <ModalHeader toggle={toggleTimeOutError}>O tempo de resposta excedeu o limite</ModalHeader>

        <ModalBody>
          <p>O tempo de resposta do Gateway excedeu o limite.</p>
          <p>Verifique a conexão da internet e do Gateway e tente novamente.</p>
        </ModalBody>

        <ModalFooter>
          <Button onClick={toggleTimeOutError} color="primary">
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default withRouter(GatewayConfig);
