import { CheckCircle } from "@mui/icons-material";
import React from "react";
import { CardData } from "../../../../components/NoDataLayer";
import InsightCard from "./InsigthCard";
import { InfoTooltip } from "../../../../components";
import useInsightsAndAlerts from "../../../../hooks/GroupView/useInsightsAndAlerts";

export default function InsightsAndAlerts() {
  const {
    load,
    error,
    cards,
    noData,
    handleClickSpot,
    cardType,
    handleClickCardType,
    setCards,
  } = useInsightsAndAlerts();

  if (noData) return <CardData title="NÃO HÁ DADOS" />;
  if (load.insightsLoading) return <CardData title="Carregando..." />;
  if (error) return <CardData title="Ocorreu um erro!" />;

  return (
    <div
      className="width-100p"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="row-center" style={{ justifyContent: "space-between" }}>
        <div className="title-with-tooltip alarmMobileTitle">
          <h6 className="cardTitleGroup" style={{ marginRight: "0.4rem" }}>
            ALERTAS
          </h6>
          <div className="showTooltip">
            <InfoTooltip
              content={
                <>
                  <p style={{ fontSize: "12px" }}>Pendentes</p>
                  <p style={{ fontWeight: 400, fontSize: "12px" }}>
                    Os cards abaixo representam os alarmes que estão ocorrendo
                    ou que ainda não foram reconhecidos de cada sensor.
                  </p>
                  <br />
                  <p style={{ fontSize: "12px" }}>Concluídos</p>
                  <p style={{ fontWeight: 400, fontSize: "12px" }}>
                    Os cards abaixo representam os alarmes que já foram
                    reconhecidos de cada sensor.
                  </p>
                </>
              }
            />
          </div>
        </div>
      </div>
      <div
        className="divider-screen"
        style={{
          pointerEvents: load.insightsLoading && "none",
          width: "95%",
          marginInline: "auto",
        }}
      >
        <button
          className={`divider-screen-button ${
            cardType === "pending" && "divider-screen-selected"
          }`}
          onClick={() => {
            cardType !== "pending" && setCards([]);
            handleClickCardType("pending");
          }}
        >
          Pendentes
        </button>

        <button
          className={`divider-screen-button ${
            cardType === "concluded" && "divider-screen-selected"
          }`}
          onClick={() => {
            cardType !== "concluded" && setCards([]);
            handleClickCardType("concluded");
          }}
        >
          Concluídos
        </button>
      </div>
      <div style={{ overflow: "hidden" }} className="overflow-auto height-100p">
        {cards.length > 0 ? (
          cards.map((el, index) => (
            <InsightCard
              onClick={handleClickSpot}
              data={el}
              key={"Card" + index}
            />
          ))
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "grid",
              textAlign: "center",
            }}
          >
            <div style={{ margin: "auto" }}>
              <div className="green-alarm">
                <CheckCircle style={{ fontSize: 120 }} />
              </div>

              <div className="textSize-14 width-100p mt-3">
                <h6 className="bold textSize-18">Tudo certo!</h6>
                <p className="mt-1">Não há alarmes para visualizar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
