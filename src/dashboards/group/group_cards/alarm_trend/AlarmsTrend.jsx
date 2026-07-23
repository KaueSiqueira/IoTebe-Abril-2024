import React from "react";
import Alarm from "./Alarm";
import { CardData } from "../../../../components/NoDataLayer";
import { InfoTooltip } from "../../../../components";
import useAlarmsTrend from "../../../../hooks/GroupView/useAlarmsTrend";

export default function AlarmsTrend() {
  const { noData, data, error, alarmTrend } = useAlarmsTrend();

  if (noData) return <CardData title="NÃO HÁ DADOS" />;
  if (!data) return <CardData title="Carregando..." />;
  if (error) return <CardData title="Ocorreu um erro!" />;

  return (
    <div className="width-100p height-100p flex-column-between">
      <div className="title-with-tooltip">
        <h6 className="cardTitleGroup" style={{ marginRight: "0.4rem" }}>
          TENDÊNCIA DE ALARMES
        </h6>
        <div className="showTooltip">
          <InfoTooltip
            content={
              <p style={{ textAlign: "center", fontSize: "12px" }}>
                Este gráfico contabiliza a pior condição de <br /> cada sensor
                nos últimos 7 dias
              </p>
            }
          />
        </div>
      </div>
      <div className="row-trend overflow-hidden">
        <div className="trendChart">
          <canvas id="alarmChart" ref={alarmTrend} />
        </div>
      </div>
    </div>
  );
}
