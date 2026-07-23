/* eslint-disable jsx-a11y/aria-role */
import { Tooltip } from "@material-ui/core";
import "./AutomaticChart.css";
import { PanTool, MoreVert } from "@mui/icons-material";
import { Axis, Fullscreen, Refresh } from "../../../../assets/customIcons";
import React from "react";
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import { Button, Input, Card, NoDataLayer } from "../../../../components";
import { DownloadButton } from "../../../../components/DownloadButton";
import useAutomaticChart from "../../../../hooks/Automatic/AutomaticChart/useAutomaticChart";

function AutomaticChart(props) {
  const {
    noData,
    isModalVisible,
    size,
    loading,
    onEnterPress,
    classChart,
    chartName,
    toggleResetMode,
    togglePanMode,
    toggleFullScreen,
    toggleModal,
    chartCSV,
    fullScreenButton,
    panButton,
    saveLimits,
    yAxisMax,
    yAxisMin,
    setyAxisMax,
    setyAxisMin,
  } = useAutomaticChart(props);

  return (
    <Card
      className={`col-12 transition_smooth chart-card ${
        loading && "cardLoading"
      } ${!props.showChart ? "invisible-chart" : ""}`}
      height={size}
      minHeight="200px"
    >
      {loading && (
        <div className="chart-loading">
          <div className="chart-loading-animation" />
        </div>
      )}
      <div className="rowWrap">
        <div className="cardWrap">
          <div className="header">
            <MoreVert />
            <h6 className="cardTitle">{chartName}</h6>

            {!noData && (
              <div className="row-chart-buttons">
                <Button
                  id="reset-button"
                  small
                  onClick={() => toggleResetMode()}
                  className="selected-chart-button chart-button autoWhite"
                >
                  <Tooltip title="Reset">
                    <Refresh />
                  </Tooltip>
                </Button>

                <Button
                  id="pan-button"
                  small
                  onClick={() => togglePanMode()}
                  className="selected-chart-button chart-button"
                  style={{ color: "#fff", backgroundColor: "#156284" }}
                  buttonRef={panButton}
                >
                  <Tooltip title="Arrastar">
                    <PanTool fontSize={"inherit"} style={{ fontSize: 12 }} />
                  </Tooltip>
                </Button>

                <Button
                  id="limit-button"
                  small
                  onClick={() => toggleModal()}
                  className="selected-chart-button chart-button autoWhite"
                >
                  <Tooltip title="Limite eixo Y">
                    <Axis />
                  </Tooltip>
                </Button>

                <DownloadButton
                  id="download-button"
                  small
                  className="selected-chart-button chart-button download"
                  filename={chartName + ".csv"}
                  headers={chartCSV.headers}
                  data={chartCSV.data}
                />

                <Button
                  id="fullscreen"
                  small
                  onClick={() => toggleFullScreen()}
                  className="chart-button"
                  style={{ fill: "#fff", backgroundColor: "#156284" }}
                  buttonRef={fullScreenButton}
                >
                  <Tooltip title="Tela cheia">
                    <Fullscreen />
                  </Tooltip>
                </Button>
              </div>
            )}
          </div>

          <NoDataLayer noData={noData}>
            <canvas
              id={props.id}
              className={classChart}
              role="canvas"
              aria-label="myCanvas"
            ></canvas>
          </NoDataLayer>

          <Modal isOpen={isModalVisible} toggle={() => toggleModal()} centered>
            <ModalHeader toggle={() => toggleModal()}>
              Alterar limite do gráfico
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label className="label-add-graph">Amplitude mínima</Label>
                <Input
                  className="iotebe-input"
                  type="number"
                  value={yAxisMin}
                  onChange={(e) => setyAxisMin(e.target.value)}
                  onKeyPress={onEnterPress}
                />
              </FormGroup>
              <FormGroup>
                <Label className="label-add-graph">Amplitude máxima</Label>
                <Input
                  className="iotebe-input"
                  type="number"
                  value={yAxisMax}
                  onChange={(e) => setyAxisMax(e.target.value)}
                  onKeyPress={onEnterPress}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter className="modalFooter">
              <Button
                cancel={true}
                onClick={() => toggleModal()}
                buttonType="rounded-button-outlined"
              >
                Cancelar
              </Button>
              <Button onClick={() => saveLimits()} buttonType="rounded-button">
                Salvar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </Card>
  );
}

export default AutomaticChart;
