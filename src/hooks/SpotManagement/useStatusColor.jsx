import { useEffect, useState } from "react";

export default function useStatusColor(
  alarms,
  data,
  colorsToUse = {
    red: "#FE5C66",
    yellow: "#FFE032",
    green: "#5CD160",
    gray: "#737373",
  },
  alternativeStatusColor = "GRAY",
  dataType = "all",
  showPendents = true,
  optionalFuncs = false
) {
  const [finalColor, setFinalColor] = useState(false);

  function getMatchingColor(color) {
    switch (color) {
      case "GRAY":
        return colorsToUse.gray;
      case "GREEN":
        return colorsToUse.green;
      case "YELLOW":
        return colorsToUse.yellow;
      case "RED":
        return colorsToUse.red;
      default:
        return colorsToUse.gray;
    }
  }

  // Função responsável por definir o peso das cores, para facilitar na hora de definir a cor de status
  function getStatusWeight(status) {
    switch (status) {
      case "GRAY":
        return 0;
      case "GREEN":
        return 1;
      case "YELLOW":
        return 2;
      case "RED":
        return 3;
      default:
        return -1;
    }
  }

  // Função que define a cor de status
  function getStatusColor() {
    // Pega todos os SPOTS. dataType informa se o array contem apenas spots ou tudo (grupos, spots etc)
    const spotIds =
      data && data.length > 0
        ? dataType === "all"
          ? data.map((item) => item.node.type === "SPOT" && item.node.id)
          : data.map((item) => item.id)
        : [];
    // Pega todos os alarmes que sejam dos spots acima
    const filteredSpots =
      alarms.length > 0
        ? alarms.filter((item) => spotIds.includes(item.spot_id))
        : [];

    let finalColor;

    if (filteredSpots.length === 0) {
      finalColor = {
        hex: getMatchingColor(alternativeStatusColor),
        name: alternativeStatusColor,
      };
      return finalColor;
    }

    // Atribui o primeiro status_color para dar sequencia na verificação de hierarquia de cores
    let maxWeight = getStatusWeight(filteredSpots[0].status_color);

    let finalColorAlarmInProgress = null;

    // Percorre os alarmes e identifica qual é a cor de maior peso
    for (let i = 0; i < filteredSpots.length; i++) {
      const currentWeight = getStatusWeight(filteredSpots[i].status_color);

      if (currentWeight >= maxWeight) {
        maxWeight = currentWeight;
        finalColor = filteredSpots[i].status_color;

        // Guarda a cor de alarme em andamento para ser usado em caso de filtro de alarme.
        if (alternativeStatusColor === finalColor) {
          finalColorAlarmInProgress = finalColor;
        }
      }
    }

    // Verifica o filtro de alarme.
    if (!showPendents) {
      // Se for filtrado para mostrar apenas alarmes em andamento,
      // a cor será de acordo com o alarme de maior cor que está em andamento ou verde.
      finalColor = finalColorAlarmInProgress || alternativeStatusColor;
    }

    // Essas funções servem para o SpotViewSpot, que requer algumas ações a mais além de definir a cor do spot
    if (optionalFuncs) {
      // Aqui acessamos a posição 0, pois essas funções só são usadas pelo SpotViewSpot, onde apenas um spot bate com algum alarme.
      optionalFuncs.setPercent &&
        optionalFuncs.setPercent(filteredSpots[0].percent_above_alarm);
      optionalFuncs.setTime &&
        optionalFuncs.setTime(
          filteredSpots[0].last_alarmed_time ||
            filteredSpots[0].max_value_timestamp
        );

      // Função utilizada pelo SpotViewCard
      optionalFuncs.setIsPlannedIntervention &&
        optionalFuncs.setIsPlannedIntervention(
          filteredSpots.find(
            (item) => item.diagnostic_status === "PLANNED_INTERVENTION"
          )
            ? true
            : false
        );
    }

    finalColor = {
      hex: getMatchingColor(finalColor),
      name: finalColor,
    };

    return finalColor;
  }

  // Função para determinar a cor do status
  const verify = () => {
    // Aqui é retornado uma cor
    let hierarchy = getStatusColor();
    setFinalColor(hierarchy);
  };

  // Sempre que houver alterações nos alarmes ou no filtro, a verificação é ativada
  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarms, showPendents]);

  return finalColor;
}
