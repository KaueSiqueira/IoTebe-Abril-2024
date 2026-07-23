import React, { useContext, useEffect, useState } from "react";
import {
  AccelerationFailure,
  AerodynamicFailure,
  Bearing,
  Cavitation,
  Clearance,
  ElectricalFault,
  EnvelopeFailure,
  Gear,
  HydrodynamicFailure,
  Lubrificant,
  Misalignment,
  SlidingBearingInstability,
  StructuralFailure,
  TemperatureFailure,
  Unbalanced,
  VelocityFailure,
} from "../../assets/customIcons";
import { Help } from "@mui/icons-material";
import { timeText } from "../../utilities";
import {
  BEARING_DICTIONARY,
  MACHINE_TYPE_DICTIONARY,
  RELATED_FAILURE_DICTIONARY,
  TRANSMISSION_DICTIONARY,
} from "../../dashboards/sensor/diagnostic/diagnosticDictionary";
import { DiagnosticContext } from "../../contexts";

const FAILURE_OPTION = {
  UNBALANCE: { title: "Desbalanceamento", icon: <Unbalanced /> },
  MISALIGNMENT: { title: "Desalinhamento", icon: <Misalignment /> },
  LOOSENESS: { title: "Folga", icon: <Clearance /> },
  GEAR_FAILURE: { title: "Engrenamento", icon: <Gear /> },
  BEARING_FAILURE: { title: "Rolamento", icon: <Bearing /> },
  LUBRICATION_FAILURE: {
    title: "Lubrificação",
    icon: <Lubrificant />,
  },
  SLIDING_BEARING_INSTABILITY: {
    title: "Mancal de deslizamento",
    icon: <SlidingBearingInstability />,
  },
  CAVITATION: { title: "Cavitação", icon: <Cavitation /> },
  AERODYNAMIC_FAILURE: {
    title: "Aerodinâmico",
    icon: <AerodynamicFailure />,
  },
  HYDRODYNAMIC_FAILURE: {
    title: "Hidrodinâmico",
    icon: <HydrodynamicFailure />,
  },
  STRUCTURAL_FRAGILITY: {
    title: "Fragilidade estrutural",
    icon: <StructuralFailure />,
  },
  ELECTRICAL_FAULT: {
    title: "Elétrico",
    icon: <ElectricalFault />,
  },
  OTHERS: {
    title: "Outro",
    icon: <Help style={{ color: "#505050" }} />,
  },
  VELOCITY_FAILURE: {
    title: "Velocidade",
    icon: <VelocityFailure />,
  },
  ACCELERATION_FAILURE: {
    title: "Aceleração",
    icon: <AccelerationFailure />,
  },
  TEMPERATURE_FAILURE: {
    title: "Temperatura",
    icon: <TemperatureFailure />,
  },
  ENVELOPE_FAILURE: {
    title: "Envelope",
    icon: <EnvelopeFailure />,
  },
  BAD_ALARM_VALUE: {
    title: "Alarme mal configurado",
    icon: <Help style={{ color: "#505050" }} />,
  },
  SENSOR_ISSUES: {
    title: "Problemas com o sensor",
    icon: <Help style={{ color: "#505050" }} />,
  },
  PROCESS_VARIATION: {
    title: "Variação de processo",
    icon: <Help style={{ color: "#505050" }} />,
  },
  NOT_FOUND: {
    title: "Sem defeito atrelado",
    icon: <Help style={{ color: "#505050" }} />,
  },
};

const generateRecommendations = (
  machine_type,
  related_failure,
  bearing_type,
  transmission_type,
  machineInfo
) => {
  let tempDescription, tempRecommendations;

  if (JSON.stringify(machineInfo) !== "{}") {
    if (RELATED_FAILURE_DICTIONARY[machine_type]) {
      if (RELATED_FAILURE_DICTIONARY[machine_type][related_failure]) {
        const dictionary =
          RELATED_FAILURE_DICTIONARY[machine_type][related_failure];

        dictionary.forEach((possibility) => {
          if (
            possibility.transmission === transmission_type ||
            !possibility.transmission
          ) {
            if (possibility.bearing === bearing_type || !possibility.bearing) {
              tempDescription = possibility.description;
              tempRecommendations = possibility.recommendation;
            }
          }
        });
      } else {
        tempDescription =
          "O alarme foi gerado através de um gráfico no qual não foi atrelado nenhum tipo de defeito no momento em que foi criado.";
        tempRecommendations = [
          "Para receber recomendações específicas de defeitos, considere criar novos gráficos com defeitos atrelados a eles, ou entre em contato com nosso Suporte Técnico para obter ajuda.",
        ];
      }
    } else {
      tempDescription = "As informações do equipamento não foram preenchidas.";
      tempRecommendations = [
        "Para receber recomendações específicas de defeitos, considere preencher as informações do equipamento, ou entre em contato com nosso Suporte Técnico para obter ajuda.",
      ];
    }
  } else {
    tempDescription =
      "As configurações da máquina não foram carregadas corretamente.";
    tempRecommendations = [
      "Tente reiniciar o site, ou entre em contato com nosso Suporte Técnico para obter ajuda;",
    ];
  }

  return { description: tempDescription, recommendations: tempRecommendations };
};

export default function useDiagnosticFailures(
  failure,
  failureExpanded,
  setFailureExpanded,
  machineInfo,
  onlyOne
) {
  const { setChartFilter, mobileDescription, setMobileDescription, resetColor, setResetColor, setShowMobileDescription } = useContext(DiagnosticContext);

  const [mouseHover, setMouseHover] = useState(false);
  const [formattedFailure, setFormattedFailure] = useState({});
  const [alarmedTime, setAlarmedTime] = useState("");
  const [disruption, setDisruption] = useState("");
  const [alarmColor, setAlarmColor] = useState("");
  const [recommendations, setRecommendations] = useState({
    description: "",
    recommendations: [],
  });

  let transition =
    failureExpanded === formattedFailure.title
      ? "transition_expand"
      : "transition_collapse";

  let transitionButton =
    failureExpanded === formattedFailure.title ? "Fechar" : "Expandir";

  const getFailureContent = (failure, machineInfo) => {
    const related_failure = failure.related_failure;

    const formattedFailure = FAILURE_OPTION.hasOwnProperty(related_failure)
      ? FAILURE_OPTION[related_failure]
      : FAILURE_OPTION["NOT_FOUND"];
    setFormattedFailure(formattedFailure);

    const alarmedTime = failure.end_time
      ? timeText(Math.floor(Date.now() / 1000) - failure.end_time)
      : "em andamento";
    setAlarmedTime(alarmedTime);

    const disruption = failure.percent_above_alarm;
    setDisruption(disruption);

    const alarmColor = failure.alarm_status === "RED" ? "#FE5C66" : "#FFE032";
    setAlarmColor(alarmColor);

    const machine_type = machineInfo.machine_type
      ? MACHINE_TYPE_DICTIONARY[machineInfo.machine_type]
      : MACHINE_TYPE_DICTIONARY[0];

    const bearing_type = !machineInfo.bearing_type
      ? BEARING_DICTIONARY[0]
      : machineInfo.bearing_type === "ROLLING"
      ? BEARING_DICTIONARY[1]
      : BEARING_DICTIONARY[2];

    const transmission_type = machineInfo.transmission_type_id
      ? TRANSMISSION_DICTIONARY[machineInfo.transmission_type_id]
      : TRANSMISSION_DICTIONARY[0];

    const recommendations = generateRecommendations(
      machine_type,
      related_failure,
      bearing_type,
      transmission_type,
      machineInfo
    );
    setRecommendations(recommendations);
    
    if(failureExpanded === formattedFailure.title)
      setMobileDescription({...recommendations, color: alarmColor});
  };

  const changeTransition = () => {
    if(window.innerWidth > 700)
      setChartFilter(
        failureExpanded === formattedFailure.title
          ? []
          : [...failure.related_graphics]
      );
    else
      setChartFilter([...failure.related_graphics]);

    setFailureExpanded((prevState) =>
      prevState === formattedFailure.title ? false : formattedFailure.title
    );

    setMobileDescription({...recommendations, color: alarmColor});

    setShowMobileDescription((prevState) =>
      prevState === true ? 1 : true
    );

    resetColor === "Expandir" && failureExpanded === formattedFailure.title && setResetColor("Fechar");
  };

  useEffect(() => {
    getFailureContent(failure, machineInfo);
  }, [failure, machineInfo]);

  useEffect(() => {
    !!formattedFailure?.title && onlyOne && changeTransition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedFailure]);

  return {
    formattedFailure,
    mouseHover,
    setMouseHover,
    alarmedTime,
    alarmColor,
    disruption,
    transition,
    changeTransition,
    transitionButton,
    description: recommendations.description,
    recommendations: recommendations.recommendations,
    mobileDescription
  };
}
