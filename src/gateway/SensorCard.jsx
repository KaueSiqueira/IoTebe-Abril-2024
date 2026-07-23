import { Tooltip } from "@material-ui/core";
import {
  SignalWifi1Bar,
  SignalWifi2Bar,
  SignalWifi3Bar,
  SignalWifi4Bar,
  SignalWifiOff,
  DragIndicator,
} from "@mui/icons-material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.isDragging ? "lightblue" : "whitesmoke")};
  display: flex;
  cursor: pointer;
`;

export function SensorCard(props) {
  const getTrueSignalIntensity = (value) => {
    if (value === "") {
      return (
        <Tooltip style={{ color: "gray" }} className="info" title={"Sem Sinal"}>
          <SignalWifiOff style={{ fontSize: 25, display: "flex", padding: 2, color: "gray" }} />
        </Tooltip>
      );
    } else {
      value = parseInt(value);
      value = ((100 * (value + 88)) / 48).toFixed(2);
      if (value > 100) {
        value = 100;
      }
      if (value <= 0) {
        value = 0;
      }

      if (value === 0) {
        return (
          <Tooltip style={{ color: "gray" }} className="info" title={"1%"}>
            <SignalWifi1Bar style={{ fontSize: 25, display: "flex", padding: 2, color: "red" }} />
          </Tooltip>
        );
      } else if (value < 25) {
        return (
          <Tooltip style={{ color: "gray" }} className="info" title={"25%"}>
            <SignalWifi1Bar style={{ fontSize: 25, display: "flex", padding: 2, color: "green" }} />
          </Tooltip>
        );
      } else if (value < 50) {
        return (
          <Tooltip style={{ color: "gray" }} className="info" title={"50%"}>
            <SignalWifi2Bar style={{ fontSize: 25, display: "flex", padding: 2, color: "green" }} />
          </Tooltip>
        );
      } else if (value < 75) {
        return (
          <Tooltip style={{ color: "gray" }} className="info" title={"75%"}>
            <SignalWifi3Bar style={{ fontSize: 25, display: "flex", padding: 2, color: "green" }} />
          </Tooltip>
        );
      } else {
        return (
          <Tooltip style={{ color: "gray" }} className="info" title={"100%"}>
            <SignalWifi4Bar style={{ fontSize: 25, display: "flex", padding: 2, color: "green" }} />
          </Tooltip>
        );
      }
    }
  };

  return (
    <Draggable draggableId={props.sensor.id} index={props.index}>
      {(provided, snapshot) => (
        <Tooltip title="Arraste e solte o Sensor para a outra coluna">
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <DragIndicator />

            <span style={{ paddingLeft: "20px", color: "gray", display: "flex" }}>
              {props.sensor.content}
            </span>

            <div
              style={{
                textAlign: "right",
                justifyContent: "flex-end",
                flex: 1,
                flexDirection: "reverse",
                paddingLeft: "5px",
              }}
            >
              {props.toggleVisibleSensors && getTrueSignalIntensity(props.sensor.signalIntensity)}
            </div>
          </Container>
        </Tooltip>
      )}
    </Draggable>
  );
}
