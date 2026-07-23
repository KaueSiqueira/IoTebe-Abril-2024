import React, { useEffect } from "react";
import { CustomSlider } from "../../../../components";

const FrequencyRangeSlider = ({
  spectralOptions,
  chartConfig,
  frequencyOptions,
  sliderConfig,
  setSliderConfig,
  freqError,
}) => {
  let resetSlider =
    chartConfig.frequency === "Selecione" ||
    !frequencyOptions.includes(chartConfig.frequency) ||
    chartConfig.metric === "Selecione" ||
    chartConfig.tolerance === "";

  const { spot_config: spotConfig } = spectralOptions;
  let nominalFreq = parseFloat((spotConfig.rotation_speed / 60).toFixed(1));
  const tolerance = chartConfig.tolerance !== "" ? chartConfig.tolerance : 0;
  const variableRotation =
    spotConfig.has_variable_rotation &&
    spotConfig.min_rotation &&
    spotConfig.max_rotation;

  const multipliedFromTo = (
    firstMultiplier,
    secondMultiplier,
    minFreq,
    maxFreq
  ) => {
    const multipliedByFirstMultiplierMinusTol =
      minFreq * firstMultiplier - tolerance > 0
        ? minFreq * firstMultiplier - tolerance
        : 0;
    const multipliedByFirstMultiplier = minFreq * firstMultiplier;
    const multipliedBySecondMultiplier = maxFreq * secondMultiplier;
    const multipliedBySecondMultiplierPlusTol =
      maxFreq * secondMultiplier + tolerance;

    plotFrequencySlider([
      multipliedByFirstMultiplierMinusTol,
      multipliedByFirstMultiplier,
      multipliedBySecondMultiplier,
      multipliedBySecondMultiplierPlusTol,
    ]);
  };

  const plotFrequencySlider = (frequences) => {
    // Será usado para sempre saber qual o valor mínimo e máximo inserido, a fim de validações caso os valores estejam incorretos
    let freqs = [
      parseFloat(frequences[0].toFixed(1)),
      parseFloat(frequences[frequences.length - 1].toFixed(1)),
    ];

    // Será usado para a exibição no Slider
    const value = Array.from(new Set(freqs)).sort((a, b) => a - b);

    const fakeValue = value.length === 1 ? [50] : [20, 80];

    let marks = [];
    if (fakeValue.length === 1) {
      marks = [
        {
          value: 50,
          label: `${value[0]}Hz`,
        },
      ];
    } else {
      marks = [
        {
          value: 20,
          label: `${value[0]}Hz`,
        },
        {
          value: 80,
          label: `${value[1]}Hz`,
        },
      ];
    }

    setSliderConfig({
      trackColor: "#127DB9",
      markColor: "#127DB9",
      value: fakeValue,
      marks: marks,
      freqs: freqs,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    resetSlider = true;
    if (chartConfig.frequency === "10Hz a 500Hz") {
      multipliedFromTo(1, 1, 10, 500);
    } else if (chartConfig.frequency === "BPF") {
      const bpf = (spotConfig.rotation_speed / 60) * spotConfig.division_count;
      multipliedFromTo(1, 1, bpf, bpf);
    } else if (chartConfig.frequency.indexOf("GMF") !== -1) {
      const objectIndex = chartConfig.frequency.match(/\d+/);
      const gmfObject = spotConfig.gear_box_gmf_list[objectIndex - 1];
      const gmf =
        (gmfObject.nominal_rotation / 60) * gmfObject.gear_teeth_count;
      multipliedFromTo(1, 1, gmf, gmf);
    } else if (chartConfig.frequency === "Manual") {
      if (
        typeof chartConfig.minFreq === "number" &&
        typeof chartConfig.maxFreq === "number"
      ) {
        plotFrequencySlider([chartConfig.minFreq, chartConfig.maxFreq]);
      } else {
        setSliderConfig({
          trackColor: "#AAE9E0",
          markColor: "#AAE9E0",
          value: [],
          marks: [],
          freqs: [chartConfig.minFreq, chartConfig.maxFreq],
        });
      }
    }

    if (variableRotation) {
      const minFreq = spotConfig.min_rotation / 60;
      const maxFreq = spotConfig.max_rotation / 60;

      switch (chartConfig.frequency) {
        case "1x RPM":
        case "2x RPM":
          const multiplier = parseInt(chartConfig.frequency);
          multipliedFromTo(multiplier, multiplier, minFreq, maxFreq);
          break;
        case "1x a 4x RPM":
          multipliedFromTo(1, 4, minFreq, maxFreq);
          break;
        case "0,38x a 0,48x RPM":
          multipliedFromTo(0.38, 0.48, minFreq, maxFreq);
          break;
        default:
          break;
      }

      if (Object.keys(chartConfig.bearing).length > 0) {
        const bearingFailureFreq =
          chartConfig.bearing[chartConfig.bearing.selectedFreq];
        multipliedFromTo(
          bearingFailureFreq,
          bearingFailureFreq,
          minFreq,
          maxFreq
        );
      }
    } else {
      switch (chartConfig.frequency) {
        case "1x RPM":
        case "2x RPM":
          const multiplier = parseInt(chartConfig.frequency);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          nominalFreq *= multiplier;
          const minFreq =
            nominalFreq - tolerance > 0 ? nominalFreq - tolerance : 0;
          const maxFreq = nominalFreq + tolerance;

          plotFrequencySlider([minFreq, nominalFreq, maxFreq]);
          break;
        case "1x a 4x RPM":
          multipliedFromTo(1, 4, nominalFreq, nominalFreq);
          break;
        case "0,38x a 0,48x RPM":
          multipliedFromTo(0.38, 0.48, nominalFreq, nominalFreq);
          break;
        default:
          break;
      }

      if (Object.keys(chartConfig.bearing).length > 0) {
        const bearingFailureFreq =
          chartConfig.bearing[chartConfig.bearing.selectedFreq];
        multipliedFromTo(
          bearingFailureFreq,
          bearingFailureFreq,
          nominalFreq,
          nominalFreq
        );
      }
    }
  }, [chartConfig]);

  return (
    <div style={{ height: 57.7, pointerEvents: "none" }}>
      <CustomSlider
        railColor={freqError ? "#e9aaaa" : "#AAE9E0"}
        trackColor={
          resetSlider
            ? "#AAE9E0"
            : freqError
            ? "#e9aaaa"
            : sliderConfig.trackColor
        }
        markColor={
          resetSlider
            ? "#AAE9E0"
            : freqError
            ? "#e9aaaa"
            : sliderConfig.markColor
        }
        min={0}
        max={100}
        value={resetSlider || freqError ? [] : sliderConfig.value}
        marks={resetSlider || freqError ? [] : sliderConfig.marks}
        disabled
      />
    </div>
  );
};

export default FrequencyRangeSlider;
