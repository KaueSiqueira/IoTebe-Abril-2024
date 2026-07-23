import React, { Component } from "react";

import { ArrowBack, Check, Edit, Refresh } from "@mui/icons-material";
import {
  Button,
  CustomInput,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import styled from "styled-components";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Card, ComponentLoader, LabeledCard } from "../components";
import { SensorCard } from "./SensorCard";

import { checkNetworkError, strToNumFirmwareVersion } from "../utilities";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";
import Amplify, { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import {
  gatewayCommandSend,
  gatewaySpotsDatabase,
  updateGatewayName,
  updateGatewaySpot,
} from "../apis";

import pontos_de_coleta_disponiveis from "../assets/imgs/tutorial_tooltips/gif-pc-disponiveis.gif";
import pontos_de_coleta_associados from "../assets/imgs/tutorial_tooltips/gif-pc-associados.gif";
import "./Gateway.css";


const SpotList = styled.div`
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

class GatewayConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      gateway_name: "",
      titleEditMode: false,
      changeColor: false,
      listData: {},
      availableSpots: [],
      registeredSpots: [],
      rmstempCollectPeriod: "",
      rmstempCollectPeriod_range: "",
      gateway_id: "",
      toggleVisibleSpots: false,
      modalVisibleSpot: false,
      modalTimeOutError: false,
      isLoading: true,
      isLoadingVisibleSpots: false,
      subs_timestamp: "",
      mqttTopic: "",
      payloadReceived: false,
      cognito_identity_id: "",
      isModalGatewayVersionErrorVisible: false,
      gateway_version: "",
    };
    this.editGatewayName = this.editGatewayName.bind(this);
    this.updateName = this.updateName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.showVisibleSpots = this.showVisibleSpots.bind(this);
    this.refreshVisibleSpots = this.refreshVisibleSpots.bind(this);
    this.gatewayConnected = this.gatewayConnected.bind(this);
    this.toggleTimeOutError = this.toggleTimeOutError.bind(this);
    this.toggleModalGatewayVersionErrorVisible = this.toggleModalGatewayVersionErrorVisible.bind(this);
  }

  componentDidMount() {
    this.authenticate();
  }

  authUser = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState(
          {
            username: user.username,
            accessToken: user.signInUserSession.accessToken.jwtToken,
          },
          () => this.getList()
        );
      })
      .catch(() => this.props.history.push("/login"));
  };

  authenticate() {
    Auth.currentCredentials().then((info) => {
      this.setState(
        { cognito_identity_id: info.data.IdentityId },
        this.authUser()
      );
    });
  }

  async getList() {
    const { gatewayId } = this.props;
    gatewaySpotsDatabase(gatewayId, "", this.state.cognito_identity_id)
      .then((res) => {
        const { columns, spots } = res.data;
        const availableSpots = columns.availableSpots.spotIds.map(
          (spotId) => spots[spotId]
        );
        const registeredSpots = columns.registeredSpots.spotIds.map(
          (spotId) => spots[spotId]
        );

        const rmstempCollectPeriod = res.data.rmstempCollectPeriod + " min";

        for(let node of availableSpots){
          node["id"] = String(node["id"])
          node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
        }
        for(let node of registeredSpots){
          node["id"] = String(node["id"])
          node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
        }
        
        const dataState = {
          listData: res.data,
          rmstempCollectPeriod: rmstempCollectPeriod,
          rmstempCollectPeriod_range: res.data.rmstempCollectPeriod,
          availableSpots: availableSpots,
          registeredSpots: registeredSpots,
          gateway_name: res.data.gateway_name,
          gateway_id: gatewayId,
          isLoading: false,
          gateway_version: res.data.gateway_version,
        };

        this.setState(dataState);
      })
      .catch((error) => {
        checkNetworkError(error);
      });
  }

  async updateName() {
    try {
      await updateGatewayName(this.props.gatewayId, this.state.gateway_name);
      this.setState({
        titleEditMode: false,
        gateway_name: this.state.gateway_name,
      });
    } catch (error) {
      console.error(error);
    }
  }

  subscribeGateway = () => {
    const { gateway_id, username, cognito_identity_id } = this.state;

    const actual_timestamp = (Date.now() / 1000).toFixed(0);
    const component = "gatewayConfig";
    let timeoutId;

    const topic = `dev/frontend/${component}/${username}/${gateway_id}/${actual_timestamp}`;

    this.setState({
      subs_timestamp: actual_timestamp,
      mqttTopic: topic,
      payloadReceived: false,
    });

    Amplify.PubSub.subscribe(topic).subscribe({
      next: (data) => {
        if (this.state.toggleVisibleSpots=== true) {
          const { columns, spots} = data.value;
          const availableSpots = columns.availableSpots.spotIds.map((sensorId) => spots[sensorId]);
          for(let node of availableSpots){
            node["id"] = String(node["id"])
            node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
          }
          const registeredSpots = columns.registeredSpots.spotIds.map((sensorId) => spots[sensorId]);
          for(let node of registeredSpots){
            node["id"] = String(node["id"])
            node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
          }

          var oldSpots = this?.state?.listData?.spots;

          var newListData = data.value;

          if (oldSpots) {
            for (const key in oldSpots) {
              if (newListData.spots.hasOwnProperty(key)) {
                newListData.spots[key].sensor_version = oldSpots[key].sensor_version
              }
            }
          }

          this.setState({
            listData: newListData,
            availableSpots: availableSpots,
            registeredSpots: registeredSpots,
            payloadReceived: true,
            isLoadingVisibleSpots: false,
          });

          clearTimeout(timeoutId);
        }
      },
      error: (error) => {},
      close: () => {},
    });
    
    gatewayCommandSend({
      cognito_identity_id: cognito_identity_id,
      gateway_id: gateway_id,
      gateway_payload: {
        function: "scan_nearby_sensors",
        path_back: {
          topic_timestamp: actual_timestamp,
          username: username,
          component: component,
        },
      },
    })
      .then((res) => {
        const gateway_status = res.data.connected;

        if (gateway_status === 0) {
          //NO GATEWAY CONNECTION MESSAGE
          this.setState({
            toggleVisibleSpots: false,
            modalVisibleSpot: true,
            isLoadingVisibleSpots: false,
          });
        }
        if (gateway_status === 1 && !this.state.payloadReceived) {
          //GATEWAY CONNECTION OK
          timeoutId = setTimeout(() => {
            //IF TIME TO RECEIVE MQTT DATA IS BIGGER THAN 10S --> CONNECTION ERROR
            if (this.state.isLoadingVisibleSpots) {
              this.setState({
                modalTimeOutError: true,
                isLoadingVisibleSpots: false,
                toggleVisibleSpots: false,
              });
            }
          }, 40000);
        }
      })
      .catch((error) => {
        checkNetworkError(error);
      });
  };

  refreshVisibleSpots() {
    this.setState({ isLoadingVisibleSpots: true });

    const last_timestamp = this.state.subs_timestamp;
    const actual_timestamp = (Date.now() / 1000).toFixed(0);

    if (actual_timestamp - last_timestamp <= 10) {
      setTimeout(
        this.subscribeGateway(),
        15000 - (actual_timestamp - last_timestamp) * 1000
      );
    } else {
      this.subscribeGateway();
    }
  }

  showVisibleSpots() {
    this.setState({
      isLoadingVisibleSpots: true,
      toggleVisibleSpots: !this.state.toggleVisibleSpots,
    });

    const last_timestamp = this.state.subs_timestamp;
    const actual_timestamp = (Date.now() / 1000).toFixed(0);

    if (
      !this.state.toggleVisibleSpots &&
      actual_timestamp - last_timestamp <= 10
    ) {
      setTimeout(
        this.subscribeGateway(),
        15000 - (actual_timestamp - last_timestamp) * 1000
      );
    } else {
      this.subscribeGateway();
    }

    if (this.state.toggleVisibleSpots) {
      gatewaySpotsDatabase(this.state.gateway_id, this.state.username)
        .then((res) => {   
          const { columns, spots } = res.data;
          const availableSpots = columns.availableSpots.spotIds.map((spotId) => spots[spotId]);
          const registeredSpots = columns.registeredSpots.spotIds.map((spotId) => spots[spotId]);
          for(let node of availableSpots){
            node["id"] = String(node["id"])
            node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
          }
          for(let node of registeredSpots){
            node["id"] = String(node["id"])
            node["content"] = node["content"] + (node["sensor_id"] === "None" ? "" : " (" + node["sensor_id"] + ")")
          }

          this.setState({
            listData: res.data,
            availableSpots: availableSpots,
            registeredSpots: registeredSpots,
            isLoadingVisibleSpots: false,
            payloadReceived: false,
            gateway_version: res.data.gateway_version,
          });
        })
        .catch((error) => {
          checkNetworkError(error);
        });
    }
  }

  onDragEnd = async (result) => {
    const gateway_id = this.state.gateway_id;
    const { destination, source, draggableId } = result;
    const spotId = draggableId;
    const gatewayVersion = strToNumFirmwareVersion(this.state.gateway_version)
    const sensorVersion = strToNumFirmwareVersion(this.state.listData.spots[spotId].sensor_version)
    const sensor_id = this.state.listData.spots[spotId].sensor_id

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (destination.droppableId === "registeredSpots") {
      console.log(gatewayVersion, sensorVersion)
      if(sensor_id != "None" && (
        (
          gatewayVersion < strToNumFirmwareVersion("v2.0.0")
          && 
          sensorVersion >= strToNumFirmwareVersion("v3.0.0")
        ) || (
          gatewayVersion >= strToNumFirmwareVersion("v2.0.0")
          &&
          sensorVersion < strToNumFirmwareVersion("v3.0.0")
        ) || (
          gatewayVersion < strToNumFirmwareVersion("v2.0.7")
          && 
          sensorVersion >= strToNumFirmwareVersion("v3.1.0")
        ) || (
          gatewayVersion === strToNumFirmwareVersion("v2.0.7")
          && 
          sensorVersion < strToNumFirmwareVersion("v3.1.0")
        ) || (
          gatewayVersion === strToNumFirmwareVersion("v2.0.8")
          && 
          sensorVersion >= strToNumFirmwareVersion("v3.1.0")
        ) || (
          gatewayVersion < strToNumFirmwareVersion("v2.0.7")
          && 
          sensorVersion >= strToNumFirmwareVersion("v3.1.0")
        ) || (
          gatewayVersion < strToNumFirmwareVersion("v2.0.10")
          && 
          sensorVersion >= strToNumFirmwareVersion("v3.1.6")
        )
      )){
        this.setState({isModalGatewayVersionErrorVisible: true})
        return
      }
      try {
        updateGatewaySpot(spotId, gateway_id);
      } catch (error) {
        console.error(error);
      }
    }

    if (destination.droppableId === "availableSpots") {
      try {
        updateGatewaySpot(spotId, null);
      } catch (error) {
        console.error(error);
      }
    }

    const start = this.state.listData.columns[source.droppableId];
    const finish = this.state.listData.columns[destination.droppableId];

    if (start === finish) {
      const newSpotIds = Array.from(start.spotIds);
      newSpotIds.splice(source.index, 1);
      newSpotIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        spotIds: newSpotIds,
      };

      const newState = {
        ...this.state.listData,
        columns: {
          ...this.state.listData.columns,
          [newColumn.id]: newColumn,
        },
      };

      const { columns, spots } = newState;
      const availableSpots = columns.availableSpots.spotIds.map(
        (spotId) => spots[spotId]
      );
      const registeredSpots = columns.registeredSpots.spotIds.map(
        (spotId) => spots[spotId]
      );

      this.setState({
        listData: newState,
        availableSpots: availableSpots,
        registeredSpots: registeredSpots,
      });
    } else {
      const startSpotIds = Array.from(start.spotIds);
      startSpotIds.splice(source.index, 1);
      const newStart = {
        ...start,
        spotIds: startSpotIds,
      };

      const finishSpotIds = Array.from(finish.spotIds);
      finishSpotIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        spotIds: finishSpotIds,
      };

      const newState = {
        ...this.state.listData,
        columns: {
          ...this.state.listData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      const { columns, spots } = newState;
      const availableSpots = columns.availableSpots.spotIds.map(
        (spotId) => spots[spotId]
      );
      const registeredSpots = columns.registeredSpots.spotIds.map(
        (spotId) => spots[spotId]
      );

      this.setState({
        listData: newState,
        availableSpots: availableSpots,
        registeredSpots: registeredSpots,
      });
    }
  };

  editGatewayName() {
    this.setState({ titleEditMode: true });
  }

  gatewayConnected() {
    this.setState({ modalVisibleSpot: !this.state.modalVisibleSpot });
  }

  toggleTimeOutError() {
    this.setState({ modalTimeOutError: !this.state.modalTimeOutError });
  }
  
  toggleModalGatewayVersionErrorVisible() {
    this.setState({ isModalGatewayVersionErrorVisible: !this.state.isModalGatewayVersionErrorVisible });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeColor() {
    this.setState({ changeColor: !this.state.changeColor });
  }

  render() {
    const {
      isLoading,
      titleEditMode,
      gateway_name,
      availableSpots,
      changeColor,
      isLoadingVisibleSpots,
      toggleVisibleSpots,
      registeredSpots,
      rmstempCollectPeriod,
      modalVisibleSpot,
      gateway_id,
      modalTimeOutError,
      isModalGatewayVersionErrorVisible,
    } = this.state;

    const { className, backToList } = this.props;

    return (
      <div style={{ width: "100%", height: "100%" }} className="relative">
        {(isLoading || isLoadingVisibleSpots) && <ComponentLoader />}

        <div style={{ width: "100%", height: "100%" }}>
          <Card height="65px">
            <Button
              onClick={() => {
                backToList();
              }}
              style={{
                backgroundColor: "white",
                borderColor: "white",
                padding: 0,
                marginRight: 12,
              }}
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
                  onChange={this.handleChange}
                ></Input>

                <Button
                  onClick={this.updateName}
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    padding: 0,
                  }}
                >
                  <Check style={{ color: "black" }}></Check>
                </Button>
              </div>
            ) : (
              <div className="gateway-title-editMode">
                <legend
                  style={{
                    fontSize: "18px",
                    margin: "auto",
                    fontWeight: 600,
                    marginBlock: "auto",
                  }}
                >
                  {gateway_name}
                </legend>

                <Button
                  onClick={this.editGatewayName}
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    padding: 0,
                  }}
                >
                  <Edit style={{ color: "black" }}></Edit>
                </Button>
              </div>
            )}
          </Card>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row" style={{ width: "100%" }}>
              <LabeledCard
                className="col-12 col-md-6"
                title="PONTOS DE COLETA DISPONÍVEIS"
                info={{
                  message: () => {
                    return (
                      <p className="p-info-modal">
                        Pontos de coleta desassociados ao gateway.
                        <br />
                        Para associar, arraste para a direita!
                        <br />
                        <span className="arrow-tooltip">→</span>
                      </p>
                    );
                  },
                  image: pontos_de_coleta_disponiveis,
                }}
              >
                <Droppable droppableId={"availableSpots"}>
                  {(provided, snapshot) => (
                    <SpotList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                      onClick={this.changeColor}
                    >
                      {availableSpots.map((spot, index) => (
                        <SensorCard
                          key={spot.id}
                          sensor={spot}
                          index={index}
                          changeColor={changeColor}
                          toggleVisibleSensors={toggleVisibleSpots}
                        />
                      ))}
                      {provided.placeholder}
                    </SpotList>
                  )}
                </Droppable>
                <div className="gateway-container-sensorCard-footer">
                  {toggleVisibleSpots ? (
                    <button
                      id="refreshButton"
                      disabled={isLoadingVisibleSpots}
                      style={{ border: "none", backgroundColor: "whitesmoke" }}
                      onClick={this.refreshVisibleSpots}
                    >
                      <Refresh />
                    </button>
                  ) : null}

                  <div className="gateway-container-sensorCard-footer-paragraph">
                    Mostrar somente os pontos com sensores visíveis
                  </div>
                  <div className="gateway-container-sensorCard-footer-switch">
                    <CustomInput
                      checked={toggleVisibleSpots}
                      onChange={this.showVisibleSpots}
                      type="switch"
                      id="showVisibleSpots"
                      name="showVisibleSpot"
                    ></CustomInput>
                  </div>
                </div>
              </LabeledCard>

              <LabeledCard
                className="col-12 col-md-6"
                title="PONTOS DE COLETA ASSOCIADOS"
                info={{
                  message: () => {
                    return (
                      <p className="p-info-modal">
                        Pontos de coleta associados ao gateway.
                        <br />
                        Para desassociar, arraste para a esquerda!
                        <br />
                        <span className="arrow-tooltip">←</span>
                      </p>
                    );
                  },
                  image: pontos_de_coleta_associados,
                }}
              >
                <Droppable droppableId={"registeredSpots"}>
                  {(provided, snapshot) => (
                    <SpotList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {registeredSpots.map((spot, index) => (
                        <SensorCard
                          key={spot.id}
                          sensor={spot}
                          index={index}
                          toggleVisibleSensors={toggleVisibleSpots}
                        />
                      ))}
                      {provided.placeholder}
                    </SpotList>
                  )}
                </Droppable>
              </LabeledCard>
            </div>
          </DragDropContext>

          <Card>
            <div className="gateway-footer">
              <span style={{ color: "gray", fontSize: 12 }}>
                ID do Gateway: {gateway_id}
              </span>
              <span style={{ color: "gray", fontSize: "12px" }}>
                Versão firmware: 0.1.0
              </span>
              <span style={{ color: "gray", fontSize: 12 }}>
                Periodicidade de medição: {rmstempCollectPeriod}{" "}
              </span>
            </div>
          </Card>
        </div>

        <Modal
          isOpen={modalVisibleSpot}
          toggle={this.gatewayConnected}
          className={className}
          centered
        >
          <ModalHeader toggle={this.gatewayConnected}>
            Configurações do Gateway
          </ModalHeader>

          <ModalBody>
            <p>O Gateway {gateway_id} está desconectado.</p>
            <p>Verifique a conexão e tente novamente.</p>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.gatewayConnected} color="primary">
              OK
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={modalTimeOutError}
          toggle={this.toggleTimeOutError}
          className={className}
          centered
        >
          <ModalHeader toggle={this.toggleTimeOutError}>
            O tempo de resposta excedeu o limite
          </ModalHeader>

          <ModalBody>
            <p>O tempo de resposta do Gateway excedeu o limite.</p>
            <p>
              Verifique a conexão da internet e do Gateway e tente novamente.
            </p>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.toggleTimeOutError} color="primary">
              OK
            </Button>
          </ModalFooter>
        </Modal>
        
        <Modal
          isOpen={isModalGatewayVersionErrorVisible}
          toggle={this.toggleModalGatewayVersionErrorVisible}
          className={className}
          centered
        >
          <ModalHeader toggle={this.toggleModalGatewayVersionErrorVisible}>
            Incompatibilidade de Versão
          </ModalHeader>

          <ModalBody>
            <p>O gateway atual possui versão incompatível com a versão do sensor.</p>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.toggleModalGatewayVersionErrorVisible} color="primary">
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withRouter(GatewayConfig);
