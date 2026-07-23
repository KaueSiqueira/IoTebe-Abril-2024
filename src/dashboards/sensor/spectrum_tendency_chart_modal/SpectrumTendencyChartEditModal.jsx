import React, { useState } from "react";
import { IoTebeModal, Input, CustomSlider } from "../../../components";
import { colors } from "../../../utilities";

const SpectrumTendencyChartEditModal = ({
  changeModal,
  setChangeModal,
  chartConfig,
  updateGraph,
  canEdit
}) => {
  const [chartName, setChartName] = useState(chartConfig.chart_name);

  const metric =
    chartConfig.metric === "VELOCIDADE"
      ? "Velocidade"
      : chartConfig.metric === "ACELERACAO"
      ? "Aceleração"
      : chartConfig.metric === "ENVELOPE"
      ? "Envelope"
      : "";
  const amplitude =
    chartConfig.amplitude === "RMS"
      ? "RMS"
      : chartConfig.amplitude === "PK"
      ? "Pico"
      : chartConfig.amplitude === "PKPK"
      ? "Pico a pico"
      : "";

  const handleInputChange = ({ target: { value } }) => {
    setChartName(value);
  };

  return (
    <IoTebeModal
      showModal={changeModal}
      toggleModal={() => setChangeModal(!changeModal)}
      title="Configurações do Gráfico"
      onConfirmTitle="Salvar"
      onDismissTitle="Cancelar"
      onConfirm={canEdit ? (() => {
        if (chartName === "") {
          document.getElementById("chartName").focus();
        } else if (chartName === chartConfig.chart_name) {
          setChangeModal(false);
        } else {
          updateGraph(chartName);
        }
      }) : false}
      children={
        <div className="stcm">
          <div className="stcm__input-group">
            <Input
              id="chartName"
              type="text"
              name="chart_name"
              label="Nome"
              value={chartName}
              onChange={handleInputChange}
              style={
                canEdit ? chartName === ""
                  ? { borderColor: colors.formErrorFeedback, outlineColor: colors.formErrorFeedback }
                  : {}
                : { backgroundColor: "#F8F8F8", borderColor: "#777" }
              }
              disabled={!canEdit}
            />
          </div>

          <div className="stcm__input-group--wrapper">
            <div className="stcm__input-group">
              <Input
                name="metric"
                label="Métrica"
                value={metric}
                style={{ backgroundColor: "#F8F8F8", borderColor: "#777" }}
                disabled={true}
              />
            </div>

            <div className="stcm__input-group">
              <Input
                name="amplitude"
                label="Amplitude"
                value={amplitude}
                style={{ backgroundColor: "#F8F8F8", borderColor: "#777" }}
                disabled={true}
              />
            </div>
          </div>

          {chartConfig.filter && (
            <div className="stcm__input-group">
              <Input
                name="filter"
                label="Filtro"
                value={chartConfig.filter}
                style={{ backgroundColor: "#F8F8F8", borderColor: "#777" }}
                disabled
              />
            </div>
          )}

          <div className="stcm__slider__wrapper">
            <label htmlFor="slider">Faixa de Frequência</label>

            <div className="stcm__slider">
              <div style={{ height: 57.7, pointerEvents: "none" }}>
                <CustomSlider
                  railColor={"#DDD"}
                  trackColor={"#777"}
                  markColor={"#777"}
                  min={0}
                  max={100}
                  value={[20, 80]}
                  marks={[
                    {
                      value: 20,
                      label: `${chartConfig.min_freq}Hz`,
                    },
                    {
                      value: 80,
                      label: `${chartConfig.max_freq}Hz`,
                    },
                  ]}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SpectrumTendencyChartEditModal;
