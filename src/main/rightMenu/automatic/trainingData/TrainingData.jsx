import React from "react";
import "./TrainingData.css";
import { Input } from "../../../../components";
import RadioGroup from "../../../../components/RadioGroup/RadioGroup";
import RadioInput from "../../../../components/RadioGroup/RadioInput/RadioInput";
import useTrainingData from "../../../../hooks/TrainingData/useTrainingData";
import { CheckCircle } from "@mui/icons-material";
import { DateRangePicker } from "react-bootstrap-daterangepicker";
import { getFormattedDate } from "../../../../utilities";

export default function TrainingData({
  lock,
  setLock,
  turnLock,
  page,
  setSave,
  setVerifyFunction,
  setPage,
}) {
  const {
    dateRange,
    metric,
    setMetric,
    limit,
    dateError,
    specError,
    limitError,
    specOnList,
    handleLimit,
    verifyDate,
    validSpec,
    isAutoEnabled,
    formatDateForDatetimeLocal,
  } = useTrainingData({
    lock,
    setLock,
    turnLock,
    page,
    setSave,
    setVerifyFunction,
    setPage,
  });

  const locale = {
    format: "DD/MM/YYYY hh:mm A",
    applyLabel: "Aplicar",
    cancelLabel: "Cancelar",
    daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  };

  const currentDate = new Date();

  return (
    <div className="training">
      {!isAutoEnabled && (
        <h2>
          Preencha os campos abaixo para selecionar dados que serão utilizados
          pelo algoritmo como referência de padrão de funcionamento da máquina.
        </h2>
      )}

      <h1>
        Período de treinamento <br />
        <span className={dateError && "dateError"}>
          (minímo 7 dias e máximo 30 dias)
        </span>
      </h1>
      {!isAutoEnabled && (
        <h2>
          Selecione um intervalo entre duas datas que contenha dados de vibração
          coletados pelo sensor com a máquina em bom funcionamento.
        </h2>
      )}
      <div className="inputsDiv">
        <DateRangePicker
          startDate={dateRange.startDate !== "" ? dateRange.startDate : false}
          endDate={dateRange.endDate !== "" ? dateRange.endDate : false}
          timePicker={true}
          timePicker24Hour={true}
          onApply={verifyDate}
          locale={locale}
          drops="auto"
          opens="left"
          maxDate={getFormattedDate(currentDate)}
        >
          <Input
            label="Data e hora inicial"
            value={formatDateForDatetimeLocal(dateRange.startDate)}
            required={true}
            labelError={dateRange.startDate.length > 0 && dateError}
            type="datetime-local"
            readOnly={true}
            disabled={isAutoEnabled}
          />
        </DateRangePicker>
        <DateRangePicker
          startDate={dateRange.startDate !== "" ? dateRange.startDate : false}
          endDate={dateRange.endDate !== "" ? dateRange.endDate : false}
          timePicker={true}
          timePicker24Hour={true}
          onApply={verifyDate}
          locale={locale}
          drops="auto"
          opens="left"
          maxDate={getFormattedDate(currentDate)}
        >
          <Input
            label="Data e hora final"
            value={formatDateForDatetimeLocal(dateRange.endDate)}
            required={true}
            labelError={dateRange.endDate.length > 0 && dateError}
            type="datetime-local"
            readOnly={true}
            disabled={isAutoEnabled}
          />
        </DateRangePicker>
      </div>
      <h1>Limite On / Off</h1>
      {!isAutoEnabled && (
        <h2>
          Insira um valor de vibração em velocidade ou aceleração que represente
          o limiar entre a máquina parada e a máquina operando.
        </h2>
      )}
      <div className="inputsDiv">
        <RadioGroup
          title="Métrica"
          children={
            <>
              <RadioInput
                name="metric"
                value={1}
                checked={metric === 1}
                label="Velocidade"
                onChange={() => setMetric(1)}
                disabled={isAutoEnabled}
              />
              <RadioInput
                name="metric"
                value={2}
                checked={metric === 2}
                label="Aceleração"
                onChange={() => setMetric(2)}
                disabled={isAutoEnabled}
              />
            </>
          }
        />
        <Input
          label={`Valor em ${metric === 1 ? "mm/s" : "g"}`}
          value={limit}
          labelError={
            limitError &&
            "O limite on / off definido não admite nenhum período de máquina ligada, altere seu valor para prosseguir."
          }
          onChange={(e) => handleLimit(e.target.value)}
          min={0}
          required={true}
          type="number"
          placeholder="Ex: 0,5"
          step="any"
          disabled={isAutoEnabled}
        />
      </div>
      {validSpec && (
        <h2 className="verify">
          <CheckCircle />
          Dados de treinamento definidos com sucesso!
        </h2>
      )}
      {specError && (
        <>
          <h1>Coletas de Espectro</h1>
          <h4>
            É necessário ter realizado no mínimo 5 coletas de espectro com a
            máquina ligada, realize mais coletas ou altere o período de
            treinamento.
          </h4>
          {specOnList?.length > 0 && (
            <div className="collectWarning">
              <h3>Coletas realizadas no período selecionado</h3>
              {specOnList?.map((spec) => (
                <>
                  <hr />
                  <li>
                    {new Date(spec.time * 1000).toLocaleDateString("pt-BR") +
                      " às " +
                      new Date(spec.time * 1000).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </li>
                </>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
