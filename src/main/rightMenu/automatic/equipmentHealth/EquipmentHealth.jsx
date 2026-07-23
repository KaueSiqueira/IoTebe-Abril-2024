import React from "react";
import useEquipmentHealth from "../../../../hooks/EquipmentHealth/useEquipmentHealth";
import GaugeChart from "./GaugeChart/GaugeChart";
import "./EquipmentHealth.css";
import { CheckCircle, WarningRounded, ErrorRounded } from "@mui/icons-material";
import RadioGroup from "../../../../components/RadioGroup/RadioGroup";
import RadioInput from "../../../../components/RadioGroup/RadioInput/RadioInput";
import { blockExternalLink } from "../../../../utilities";

export default function EquipmentHealth({ page, setVerifyFunction }) {
  const {
    velocityAverage,
    accelerationAverage,
    velocityAlarm,
    accelerationAlarm,
    velocityValues,
    accelerationValues,
    equipmentHealth,
    keepAlarm,
    handleKeepAlarm,
    isAutoEnabled,
  } = useEquipmentHealth(page, setVerifyFunction);

  return (
    <div className="equipment-health">
      {page === 3 && velocityValues && accelerationValues && (
        <>
          <GaugeChart
            id="velocity"
            name="Velocidade Global RMS (mm/s)"
            value={velocityAverage}
            alarm={velocityAlarm}
            ticks={velocityValues}
          />
          <GaugeChart
            id="acceleration"
            name="Aceleração Global RMS (g)"
            value={accelerationAverage}
            alarm={accelerationAlarm}
            ticks={accelerationValues}
          />
        </>
      )}
      <div className="status-container">
        <div className={`status-message status-${equipmentHealth}`}>
          {equipmentHealth === "good" ? (
            <>
              <CheckCircle />
              <p>
                Seu equipamento apresenta níveis de vibração conforme o esperado
                para uma <span>condição saudável.</span>
              </p>
            </>
          ) : equipmentHealth === "alert" ? (
            <>
              <WarningRounded />
              <p>
                Seu equipamento apresenta níveis de vibração acima do esperado.
              </p>
            </>
          ) : (
            <>
              <ErrorRounded />
              <p>
                Seu equipamento apresenta níveis de vibração acima do esperado.
              </p>
            </>
          )}
        </div>
        {equipmentHealth !== "good" && (
          <>
            <div className="alert-critical-message">
              <p>
                Mesmo apresentando altos níveis de vibração, não necessariamente
                significa que o equipamento está defeituoso, já que isso pode
                ser uma característica normal.
              </p>

              <p>
                Caso não tenha certeza se a máquina está em boas condições ou
                não, <span>utilize as opções recomendadas</span> e contate o{" "}
                <a href="#" onClick={blockExternalLink}>
                  suporte técnico
                </a>{" "}
                para solicitar uma análise.
              </p>
            </div>
            {!isAutoEnabled && (
              <div className="keep-alarm">
                <RadioGroup
                  title="Manter ponto alarmado?"
                  value={keepAlarm}
                  onChange={handleKeepAlarm}
                >
                  <RadioInput label={"Sim (recomendado)"} value={"true"} />
                  <RadioInput label={"Não"} value={"false"} />
                </RadioGroup>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
