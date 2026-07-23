import React from "react";
import { Card } from "../../../../components";
import CriticalSpotsChart from "./CriticalSpotsChart";
import { InfoTooltip } from "../../../../components";
import useCriticalSpots from "../../../../hooks/GroupView/useCriticalSpots";

const CriticalSpots = () => {
  const {
    offlineSensors,
    offlineGateways,
    criticalBatterys,
    totalSensors,
    totalGateways,
    yellowCards,
    redCards,
    totalSpots,
    load,
  } = useCriticalSpots();

  return (
    <div className="critical-spots-container">
      <Card>
        <div className="critical-spots-card">
          <div className="title-with-tooltip">
            <h6 className="cardTitleGroup" style={{ marginRight: "0.4rem" }}>
              SAÚDE DA PLANTA
            </h6>
            <div className="showTooltip">
              <InfoTooltip
                content={
                  <p style={{ textAlign: "center", fontSize: "12px" }}>
                    Este gráfico é relativo aos alarmes que estão <br />{" "}
                    ocorrendo ou que ainda não foram reconhecidos.
                  </p>
                }
              />
            </div>
          </div>
          <CriticalSpotsChart
            totalSpots={totalSpots}
            yellowCards={yellowCards}
            redCards={redCards}
            load={load}
          />
        </div>
      </Card>
      <Card>
        <div className="critical-spots-card">
          <div className="title-with-tooltip">
            <h6 className="cardTitleGroup" style={{ marginRight: "0.4rem" }}>
              DESEMPENHO
            </h6>
            <div className="showTooltip">
              <InfoTooltip
                content={
                  <>
                    <p style={{ fontSize: "12px" }}>Sensores offline</p>
                    <p style={{ fontWeight: 400, fontSize: "12px" }}>
                      Sensores que não possuem dados há mais de 3 horas.
                    </p>
                    <br />
                    <p style={{ fontSize: "12px" }}>Gateway offline</p>
                    <p style={{ fontWeight: 400, fontSize: "12px" }}>
                      Gateways que não possuem conexão com a internet.
                    </p>
                    <br />
                    <p style={{ fontSize: "12px" }}>Baterias críticas</p>
                    <p style={{ fontWeight: 400, fontSize: "12px" }}>
                      Baterias que apresentam carga abaixo de 15%.
                    </p>
                  </>
                }
              />
            </div>
          </div>
          <div className="critical-spots-performance">
            <div className="critical-spots-performance-wrapper">
              <span className="critical-spots-performance-title">
                {!load.criticalLoading ? offlineSensors : "-"}
              </span>
              <span
                className={`critical-spots-performance-${
                  offlineSensors > 0 ? "red" : "green"
                }-indicator`}
              >
                sensores <br />
                offline
              </span>
            </div>

            <div className="critical-spots-performance-wrapper">
              <span className="critical-spots-performance-title">
                {!load.criticalLoading ? offlineGateways : "-"}
              </span>
              <span
                className={`critical-spots-performance-${
                  offlineGateways > 0 ? "red" : "green"
                }-indicator`}
              >
                gateways <br />
                offline
              </span>
            </div>

            <div className="critical-spots-performance-wrapper">
              <span className="critical-spots-performance-title">
                {!load.criticalLoading ? criticalBatterys : "-"}
              </span>
              <span
                className={`critical-spots-performance-${
                  criticalBatterys > 0 ? "red" : "green"
                }-indicator`}
              >
                baterias <br />
                críticas
              </span>
            </div>
          </div>
          <div className="critical-spots-performance-footer">
            <span>
              Total sensores: {!load.criticalLoading ? totalSensors : "-"}
            </span>
            <span>
              Total gateways: {!load.criticalLoading ? totalGateways : "-"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CriticalSpots;
