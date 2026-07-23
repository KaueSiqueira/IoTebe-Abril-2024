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
import { DiagnosticContext } from "../../contexts";

const FAILURE_OPTION = {
  UNBALANCE: {
    title: "Desbalanceamento",
    icon: <Unbalanced />,
  },
  MISALIGNMENT: {
    title: "Desalinhamento",
    icon: <Misalignment />,
  },
  LOOSENESS: { title: "Folga", icon: <Clearance /> },
  GEAR_FAILURE: { title: "Engrenagemento", icon: <Gear /> },
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
    title: "Outros",
    icon: <Help style={{ color: "#505050", paddingRight: "6px" }} />,
  },
  VELOCITY_FAILURE: {
    title: "Aumento de velocidade",
    icon: <VelocityFailure />,
  },
  ACCELERATION_FAILURE: {
    title: "Aumento de aceleração",
    icon: <AccelerationFailure />,
  },
  TEMPERATURE_FAILURE: {
    title: "Aumento de temperatura",
    icon: <TemperatureFailure style={{ paddingRight: "6px" }} />,
  },
  ENVELOPE_FAILURE: {
    title: "Automento de envelope",
    icon: <EnvelopeFailure />,
  },
  BAD_ALARM_VALUE: {
    title: "Alarme mal configurado",
    icon: <Help style={{ color: "#505050", paddingRight: "6px" }} />,
  },
  SENSOR_ISSUES: {
    title: "Problemas com o sensor",
    icon: <Help style={{ color: "#505050", paddingRight: "6px" }} />,
  },
  PROCESS_VARIATION: {
    title: "Variação do processo",
    icon: <Help style={{ color: "#505050", paddingRight: "6px" }} />,
  },
  NOT_FOUND: {
    title: "Sem defeito atrelado",
    icon: <Help style={{ color: "#505050", paddingRight: "6px" }} />,
  },
};

export default function useDiagnosticCompleted(
  failure,
  failureExpanded,
  setFailureExpanded,
  info,
  sendChartIds,
  diagnosticExpanded,
  setDiagnosticExpanded,
  cardStatus,
  author,
  observation,
  cardColor
) {
  const { setChartFilter, setMobileHistoric, setShowMobileHistoric, mobileHistoric } = useContext(DiagnosticContext);

  const [mouseHover, setMouseHover] = useState(false);
  const [formattedFailure, setFormattedFailure] = useState([]);
  const [causes, setCauses] = useState([]);
  const [diagnosticTime, setDiagnosticTime] = useState("");
  const [plannedTime, setPlannedTime] = useState("");
  const [disruption, setDisruption] = useState("");
  const [wasEffective, setWasEffective] = useState(false);

  const transition =
    diagnosticExpanded.id === info.diagnostic_card_id &&
    diagnosticExpanded.state === "open"
      ? "transition_expand"
      : "transition_collapse";

  const transitionButton =
    diagnosticExpanded.id === info.diagnostic_card_id &&
    diagnosticExpanded.state === "open"
      ? "Fechar"
      : "Expandir";

  const getFailureContent = (failure, cause) => {
    let tempArray = [];
    failure.forEach((failure) => {
      const related_failure = failure.related_failure;

      const formattedFailure = FAILURE_OPTION.hasOwnProperty(related_failure)
        ? FAILURE_OPTION[related_failure]
        : FAILURE_OPTION["NOT_FOUND"];

      tempArray.push({
        start: failure.start_time,
        end: failure.end_time,
        title: formattedFailure.title,
        icon: formattedFailure.icon,
        related_graphics: failure.related_graphics,
      });
    });

    tempArray.sort(function (a, b) {
      return b.start - a.start;
    });

    setFormattedFailure(tempArray);

    let tempCauseArray = [];

    cause &&
      cause.forEach((failure) => {
        const related_failure = failure;

        const formattedFailure = FAILURE_OPTION.hasOwnProperty(related_failure)
          ? FAILURE_OPTION[related_failure]
          : FAILURE_OPTION["NOT_FOUND"];

        tempCauseArray = [...tempCauseArray, formattedFailure.title];
      });

    setCauses(tempCauseArray);

    const diagnosticTime = {
      start: info.start_diagnostic_time,
      end: info.end_diagnostic_time,
    };
    const plannedIntervationTime = info.planned_intervention_time;
    const disruption = failure.percent_above_alarm;
    
    if(diagnosticExpanded.id === info.diagnostic_card_id)
      setMobileHistoric(
        {
          formattedFailure: tempArray,
          causes: tempCauseArray,
          diagnosticTime: {
            start: info.start_diagnostic_time,
            end: info.end_diagnostic_time,
          },
          plannedTime: plannedIntervationTime,
          disruption: failure.percent_above_alarm,
          wasEffective: wasEffective,
          author: author,
          observation: observation,
          alarmColor: cardColor,
          otherCause: info?.other_cause
        }
      );

    setDiagnosticTime(diagnosticTime);
    setPlannedTime(plannedIntervationTime);
    setDisruption(disruption);
    setWasEffective(cardStatus === "NOT_EFFECTIVE" ? false : true);
    if(diagnosticExpanded.state === "open")
      setShowMobileHistoric(true);
  };

  const changeTransition = () => {
    setDiagnosticExpanded((prevState) => {
      if (prevState.id === info.diagnostic_card_id) {
        if (prevState.state === "open") {
          setMobileHistoric(
            {
              formattedFailure: formattedFailure,
              causes: causes,
              diagnosticTime: diagnosticTime,
              plannedTime: plannedTime,
              disruption: disruption,
              wasEffective: wasEffective,
              author: author,
              observation: observation,
              alarmColor: cardColor,
              otherCause: info?.other_cause
            }
          )
          setShowMobileHistoric((prevState) =>
            prevState === true ? 1 : true
          );
          return { state: "close", id: info.diagnostic_card_id };
        }
        setMobileHistoric(
          {
            formattedFailure: formattedFailure,
            causes: causes,
            diagnosticTime: diagnosticTime,
            plannedTime: plannedTime,
            disruption: disruption,
            wasEffective: wasEffective,
            author: author,
            observation: observation,
            alarmColor: cardColor,
            otherCause: info?.other_cause
          }
        )
        setShowMobileHistoric((prevState) =>
          prevState === true ? 1 : true
        );
        return { state: "open", id: info.diagnostic_card_id };
      }

      sendChartIds([info]);
      setChartFilter([]);
      setFailureExpanded(false);
      setMobileHistoric(
        {
          formattedFailure: formattedFailure,
          causes: causes,
          diagnosticTime: diagnosticTime,
          plannedTime: plannedTime,
          disruption: disruption,
          wasEffective: wasEffective,
          author: author,
          observation: observation,
          alarmColor: cardColor,
          otherCause: info?.other_cause
        }
      )
      setShowMobileHistoric((prevState) =>
        prevState === true ? 1 : true
      );
      return { state: "open", id: info.diagnostic_card_id };
    });
  };

  const changeSelectedFailure = (failure, index) => {
    const failureString = failure.title + index;
    setChartFilter(
      failureExpanded === failureString ? [] : [...failure.related_graphics]
    );

    setFailureExpanded((prevState) =>
      prevState === failureString ? false : failureString
    );
  };

  useEffect(() => {
    getFailureContent(failure, info.causes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failure, info]);


  return {
    formattedFailure,
    causes,
    mouseHover,
    setMouseHover,
    diagnosticTime,
    plannedTime,
    disruption,
    transition,
    changeTransition,
    transitionButton,
    changeSelectedFailure,
    wasEffective,
    mobileHistoric
  };
}
