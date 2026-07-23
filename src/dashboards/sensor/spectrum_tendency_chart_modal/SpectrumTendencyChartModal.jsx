import React, { useState, useEffect } from "react";
import { readSpectralOptions, createSpectralChart } from "../../../apis";
import {
  IoTebeModal,
  Input,
  IncrementDecrementInput,
  CheckboxDropdown,
  ModalLoader,
} from "../../../components";
import FrequencyRangeSlider from "./sliders/FrequencyRangeSlider";
import { colors } from "../../../utilities";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";

const SpectrumTendencyChartModal = ({
  spotId,
  showModal,
  setCreateModal,
  showSettings,
  loadData,
  newLoad,
}) => {
  const [spectralOptions, setSpectralOptions] = useState({});
  const [variableRotation, setVariableRotation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warningModal, setWarningModal] = useState(false);
  const [frequencyOptions, setFrequencyOptions] = useState(["Selecione"]);
  const [chartConfig, setChartConfig] = useState({
    name: "",
    metric: "Selecione",
    amplitude: "Selecione",
    frequency: "Selecione",
    minFreq: "",
    maxFreq: "",
    filter: "Selecione",
    tolerance: "",
    axes: [],
    tiedDefects: [],
    bearing: {},
  });
  const [sliderConfig, setSliderConfig] = useState({
    trackColor: "#AAE9E0",
    markColor: "#AAE9E0",
    value: [],
    marks: [],
    freqs: [],
  });
  const [payload, setPayload] = useState({});

  const metricOptions = ["Selecione", "Velocidade", "Aceleração", "Envelope"];
  const amplitudeOptions = ["Selecione", "RMS", "Pico", "Pico a pico"];
  const filterOptions = ["Selecione", "50 a 1000Hz", "500 a 6000Hz"];
  // TODO: Uncomment tangential and radial options after its data types implementation
  const axesOptions = [
    "Axial",
    "Horizontal",
    "Vertical",
    // "Tangencial",
    // "Radial",
  ];
  const tiedDefects = [
    "Desbalanceamento",
    "Desalinhamento",
    "Folga",
    "Defeito de engrenamento",
    "Instabilidade do mancal de deslizamento",
    "Cavitação",
    "Defeito em rolamento",
    "Defeito de lubrificação",
    "Defeito aerodinâmico",
    "Defeito hidrodinâmico",
    "Fragilidade estrutural",
    "Defeito elétrico",
  ];

  const min_freq = sliderConfig.freqs[0];
  const max_freq = sliderConfig.freqs[1];

  let freq_error = {
    error: payload["minFreq"] === "invalid" || payload["maxFreq"] === "invalid",
    message: {
      minFreq:
        chartConfig.metric === "Envelope"
          ? min_freq < 0
            ? "Frequência Mínima 0hz"
            : false
          : min_freq < 3
          ? "Frequência Mínima 3hz"
          : false,
      maxFreq: max_freq > 6000 ? "Frequência Máxima 6000hz" : "",
      fullMessage: "",
    },
  };

  freq_error.message.fullMessage =
    min_freq >= max_freq ||
    min_freq === "" ||
    max_freq === "" ||
    min_freq === undefined ||
    max_freq === undefined
      ? "Intervalo Inválido"
      : (freq_error.message.minFreq ? freq_error.message.minFreq : "") +
        (freq_error.message.minFreq && freq_error.message.maxFreq
          ? " e "
          : "") +
        (freq_error.message.maxFreq ? freq_error.message.maxFreq : "");

  const getSpectralOptions = async () => {
    try {
      const MACHINE_TYPES_OPTIONS = [
        "Selecione",
        "Motor Elétrico",
        "Bomba Centrífuga",
        "Ventilador/Exaustor",
        "Turbina a Vapor",
        "Redutor",
        "Gerador",
        "Rotores em Geral",
        "Outros",
      ];
      const response = await readSpectralOptions(spotId);
      response.data.spot_config.machine_type =
        MACHINE_TYPES_OPTIONS[response.data.spot_config.machine_type] || null;

      setSpectralOptions(response.data);

      const { spot_config: spotConfig } = response.data;
      const variableRotation =
        spotConfig.has_variable_rotation &&
        spotConfig.min_rotation &&
        spotConfig.max_rotation;

      setVariableRotation(variableRotation);

      if (
        !response.data.spot_config.machine_type ||
        !response.data.spot_config.rotation_speed
      ) {
        setWarningModal(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createChart = async () => {
    if (validateFields()) {
      setLoading(true);
      // spot_id
      const spot_id = spotId;

      // chart_name
      const chart_name = chartConfig.name;

      // metric_id
      const { metric, amplitude } = chartConfig;
      const metric_id =
        metric === "Velocidade" && amplitude === "RMS"
          ? 1
          : metric === "Velocidade" && amplitude === "Pico"
          ? 7
          : metric === "Velocidade" && amplitude === "Pico a pico"
          ? 8
          : metric === "Aceleração" && amplitude === "RMS"
          ? 2
          : metric === "Aceleração" && amplitude === "Pico"
          ? 5
          : metric === "Aceleração" && amplitude === "Pico a pico"
          ? 6
          : metric === "Envelope" && amplitude === "RMS"
          ? 9
          : metric === "Envelope" && amplitude === "Pico"
          ? 10
          : metric === "Envelope" && amplitude === "Pico a pico"
          ? 11
          : null;

      // min_freq_env && max_freq_env
      let min_freq_env = null;
      let max_freq_env = null;

      if (chartConfig.metric === "Envelope") {
        switch (chartConfig.filter) {
          case "50 a 1000Hz":
            min_freq_env = 50;
            max_freq_env = 1000;
            break;
          case "500 a 6000Hz":
            min_freq_env = 500;
            max_freq_env = 6000;
            break;
          default:
            min_freq_env = null;
            max_freq_env = null;
        }
      }

      // axes
      let axes = [];
      chartConfig.axes.includes("Vertical") && axes.push(1);
      chartConfig.axes.includes("Horizontal") && axes.push(2);
      chartConfig.axes.includes("Axial") && axes.push(3);
      chartConfig.axes.includes("Radial") && axes.push(4);
      chartConfig.axes.includes("Tangencial") && axes.push(5);

      // related_failures
      let related_failures = [];
      chartConfig.tiedDefects.includes("Desbalanceamento") &&
        related_failures.push(1);
      chartConfig.tiedDefects.includes("Desalinhamento") &&
        related_failures.push(2);
      chartConfig.tiedDefects.includes("Folga") && related_failures.push(3);
      chartConfig.tiedDefects.includes("Defeito de engrenamento") &&
        related_failures.push(4);
      chartConfig.tiedDefects.includes("Defeito em rolamento") &&
        related_failures.push(5);
      chartConfig.tiedDefects.includes("Defeito de lubrificação") &&
        related_failures.push(6);
      chartConfig.tiedDefects.includes(
        "Instabilidade do mancal de deslizamento"
      ) && related_failures.push(7);
      chartConfig.tiedDefects.includes("Cavitação") && related_failures.push(8);
      chartConfig.tiedDefects.includes("Defeito aerodinâmico") &&
        related_failures.push(9);
      chartConfig.tiedDefects.includes("Fragilidade estrutural") &&
        related_failures.push(12);
      chartConfig.tiedDefects.includes("Defeito hidrodinâmico") &&
        related_failures.push(13);
      chartConfig.tiedDefects.includes("Defeito elétrico") &&
        related_failures.push(14);

      try {
        await createSpectralChart({
          spot_id,
          chart_name,
          metric_id,
          min_freq_env,
          max_freq_env,
          min_freq,
          max_freq,
          axes,
          related_failures,
        });
        loadData();
        newLoad(true);
        FeedbackToast.success();
      } catch (error) {
        console.lerror(error);
        FeedbackToast.error();
      } finally {
        setCreateModal(!showModal);
        setLoading(false);
      }
    }
  };

  const changeFrequencyOptions = () => {
    if (Object.keys(spectralOptions).length > 0) {
      let freqOptAux = [];

      // Somente quando houver GMF configurado
      if (spectralOptions.spot_config.machine_type === "Redutor") {
        spectralOptions.spot_config.gear_box_gmf_list.forEach(
          (option, index) => {
            const label =
              "GMF " +
              (index + 1) +
              (option.selected_gmf === 1 ? " (selecionado)" : "");
            freqOptAux.push(label);
          }
        );
      }

      if (
        chartConfig.metric === "Velocidade" ||
        chartConfig.metric === "Aceleração"
      ) {
        // Somente quando houver mancal de deslizamento configurado
        if (spectralOptions.spot_config.bearing_type === "SLEEVE") {
          freqOptAux.push("0,38x a 0,48x RPM");
        }

        // Somente quando houver bomba centrífuga configurada
        if (spectralOptions.spot_config.machine_type === "Bomba Centrifuga") {
          freqOptAux.push("10Hz a 500Hz");
        }

        // Somente quando houver BPF configurado
        if (
          [
            "Ventilador/Exaustor",
            "Bomba Centrifuga",
            "Rotores em Geral",
            "Outros",
          ].includes(spectralOptions.spot_config.machine_type) &&
          spectralOptions.spot_config.division_count &&
          spectralOptions.spot_config.rotation_speed
        ) {
          freqOptAux.push("BPF");
        }

        freqOptAux.unshift(
          "Selecione",
          "Manual",
          "1x RPM",
          "2x RPM",
          "1x a 4x RPM"
        );
      } else {
        // Somente quando houver rolamento configurado
        if (spectralOptions.bearings.length > 0) {
          spectralOptions.bearings.forEach((bearing) => {
            freqOptAux.push(`${bearing.manufacturercode}${bearing.model}`);
          });
        }

        freqOptAux.unshift("Selecione", "Manual");
      }

      setFrequencyOptions(freqOptAux);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    resetPayloadField(name);

    setChartConfig((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleFrequencyChange = ({ target: { value } }) => {
    resetPayloadField("minFreq");
    resetPayloadField("maxFreq");
    resetPayloadField("frequency");
    resetPayloadField("tolerance");
    let defaultTolerance = 0;
    let bearing = {};

    if (value.indexOf("GMF") !== -1) {
      defaultTolerance = 10;
    } else if (
      chartConfig.metric === "Envelope" &&
      spectralOptions.bearings.length > 0 &&
      !["Selecione", "Manual", "GMF"].includes(value)
    ) {
      const bearingInfo = spectralOptions.bearings.find(
        (bearing) => value === `${bearing.manufacturercode}${bearing.model}`
      );

      bearing = {
        bearing: `${bearingInfo.manufacturercode}${bearingInfo.model}`,
        bpfi: bearingInfo.bpfi,
        bpfo: bearingInfo.bpfo,
        bsf: bearingInfo.bsf,
        selectedFreq: "bpfi",
      };

      defaultTolerance = 1;
    } else if (variableRotation) {
      switch (value) {
        case "1x RPM":
        case "2x RPM":
        case "1x a 4x RPM":
        case "BPF":
          defaultTolerance = 1;
          break;
        default:
          defaultTolerance = 0;
      }
    } else {
      switch (value) {
        case "1x RPM":
        case "2x RPM":
        case "1x a 4x RPM":
        case "BPF":
          defaultTolerance = 3;
          break;
        default:
          defaultTolerance = 0;
      }
    }

    setChartConfig((prevState) => {
      return {
        ...prevState,
        frequency: value,
        tolerance: defaultTolerance,
        bearing,
      };
    });
  };

  const handleBearingFailureFrequencyChange = ({ target: { name, value } }) => {
    setChartConfig((prevState) => {
      return {
        ...prevState,
        bearing: {
          ...prevState.bearing,
          [name]: value,
        },
      };
    });
  };

  const handleMetricChange = ({ target: { name, value } }) => {
    handleFrequencyChange({
      target: {
        value: "Selecione",
      },
    });

    handleInputChange({ target: { name: name, value: value } });
  };

  const resetPayloadField = (field) => {
    setPayload((prevState) => {
      const payloadCopy = { ...prevState };
      delete payloadCopy[field];
      return payloadCopy;
    });
  };

  const validateFields = () => {
    const payload = {
      name: chartConfig.name !== "" ? chartConfig.name : "invalid",
      metric:
        chartConfig.metric !== "Selecione" ? chartConfig.metric : "invalid",
      amplitude:
        chartConfig.amplitude !== "Selecione"
          ? chartConfig.amplitude
          : "invalid",
      filter:
        chartConfig.metric === "Envelope"
          ? chartConfig.filter !== "Selecione"
            ? chartConfig.filter
            : "invalid"
          : "",
      frequency:
        chartConfig.frequency !== "Selecione"
          ? chartConfig.frequency
          : "invalid",
      tolerance:
        chartConfig.tolerance >= 0 && chartConfig.tolerance !== ""
          ? chartConfig.tolerance
          : "invalid",
      minFreq:
        chartConfig.metric === "Envelope"
          ? min_freq >= 0 && min_freq !== "" && min_freq !== undefined
            ? min_freq
            : "invalid"
          : min_freq >= 3 && min_freq !== "" && min_freq !== undefined
          ? min_freq
          : "invalid",
      maxFreq:
        max_freq !== "" &&
        max_freq !== undefined &&
        max_freq !== 0 &&
        max_freq <= 6000 &&
        max_freq > min_freq
          ? max_freq
          : "invalid",
      axes: chartConfig.axes.length !== 0 ? chartConfig.axes.length : "invalid",
    };

    if (
      payload.frequency !== "Manual" &&
      (payload.minFreq === "invalid" || payload.maxFreq === "invalid")
    ) {
      payload.tolerance = "invalid";
    }

    setPayload(payload);
    const isPayloadValid = Object.values(payload).every(
      (value) => value !== "invalid"
    );
    return isPayloadValid;
  };

  useEffect(() => {
    getSpectralOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    changeFrequencyOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartConfig.metric]);

  if (loading) {
    return <ModalLoader />;
  } else if (warningModal) {
    return (
      <IoTebeModal
        showModal={warningModal}
        toggleModal={() => {
          setWarningModal(!warningModal);
          setCreateModal(!showModal);
        }}
        title="Atenção"
        onDismissTitle="Cancelar"
        onConfirm={() => {
          showSettings();
        }}
        onConfirmTitle="Configurar"
        children={
          <p>
            O tipo de máquina e suas características de rotação são necessários
            para a criação de gráficos de tendência espectral. Acesse a página
            de configuração de ponto e preencha as informações solicitadas.
          </p>
        }
      />
    );
  } else {
    return (
      <IoTebeModal
        showModal={showModal}
        toggleModal={() => setCreateModal(!showModal)}
        title="Novo Gráfico de Tendência Espectral"
        onDismissTitle="Cancelar"
        onConfirm={() => {
          createChart();
        }}
        onConfirmTitle="Salvar"
        children={
          // Spectrum Tendency Chart Modal
          <div className="stcm">
            <div className="stcm__input-group">
              <Input
                type="text"
                name="name"
                label="Nome"
                value={chartConfig.name}
                onChange={handleInputChange}
                style={
                  payload["name"] === "invalid"
                    ? {
                        borderColor: colors.formErrorFeedback,
                        outlineColor: colors.formErrorFeedback,
                      }
                    : ""
                }
              />
            </div>

            <div className="stcm__input-group--wrapper">
              <div className="stcm__input-group">
                <Input
                  name="metric"
                  label="Métrica"
                  options={metricOptions}
                  value={chartConfig.metric}
                  onChange={handleMetricChange}
                  style={
                    payload["metric"] === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                          outlineColor: colors.formErrorFeedback,
                        }
                      : ""
                  }
                />
              </div>

              <div className="stcm__input-group">
                <Input
                  name="amplitude"
                  label="Amplitude"
                  options={amplitudeOptions}
                  value={chartConfig.amplitude}
                  onChange={handleInputChange}
                  style={
                    payload["amplitude"] === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                          outlineColor: colors.formErrorFeedback,
                        }
                      : ""
                  }
                />
              </div>
            </div>

            {chartConfig.metric === "Envelope" && (
              <div className="stcm__input-group">
                <Input
                  name="filter"
                  label="Filtro"
                  options={filterOptions}
                  value={chartConfig.filter}
                  onChange={handleInputChange}
                  style={
                    payload["filter"] === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                          outlineColor: colors.formErrorFeedback,
                        }
                      : ""
                  }
                />
              </div>
            )}

            <div className="stcm__input-group--wrapper">
              <div className="stcm__input-group">
                <Input
                  name="frequency"
                  label="Frequência"
                  options={frequencyOptions}
                  value={chartConfig.frequency}
                  onChange={handleFrequencyChange}
                  disabled={chartConfig.metric === "Selecione"}
                  style={
                    chartConfig.metric === "Selecione" &&
                    payload["frequency"] === "invalid"
                      ? {
                          backgroundColor: "#F2F2F2",
                          borderColor: colors.formErrorFeedback,
                          outlineColor: colors.formErrorFeedback,
                        }
                      : chartConfig.metric === "Selecione"
                      ? { backgroundColor: "#F2F2F2" }
                      : payload["frequency"] === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                          outlineColor: colors.formErrorFeedback,
                        }
                      : ""
                  }
                />
              </div>

              {!["Selecione", "Manual"].includes(chartConfig.frequency) && (
                <div className="stcm__input-group">
                  <IncrementDecrementInput
                    name="tolerance"
                    label="Tolerância (Hz)"
                    placeholder="Ex: 10.0Hz"
                    type="number"
                    step="1"
                    min="0"
                    value={String(chartConfig.tolerance)}
                    setValue={setChartConfig}
                    decrementBtnDisabled={chartConfig.tolerance - 1 < 0}
                    resetPayload={true}
                    resetPayloadField={resetPayloadField}
                    style={
                      payload["tolerance"] === "invalid"
                        ? {
                            borderColor: colors.formErrorFeedback,
                            outlineColor: colors.formErrorFeedback,
                          }
                        : ""
                    }
                  />
                </div>
              )}
            </div>

            {chartConfig.frequency === "Manual" && (
              <div className="stcm__input-group--wrapper">
                <div className="stcm__input-group">
                  <IncrementDecrementInput
                    name="minFreq"
                    label="Frequência Mínima"
                    placeholder="Ex: 50.0Hz"
                    type="number"
                    step="1"
                    min="0"
                    value={String(chartConfig.minFreq)}
                    setValue={setChartConfig}
                    decrementBtnDisabled={chartConfig.minFreq - 1 < 0}
                    resetPayload={true}
                    resetPayloadField={resetPayloadField}
                    style={
                      payload["minFreq"] === "invalid"
                        ? {
                            borderColor: colors.formErrorFeedback,
                            outlineColor: colors.formErrorFeedback,
                          }
                        : ""
                    }
                  />
                </div>
                <div className="stcm__input-group">
                  <IncrementDecrementInput
                    name="maxFreq"
                    label="Frequência Máxima"
                    placeholder="Ex: 100.0Hz"
                    type="number"
                    step="1"
                    min="0"
                    value={String(chartConfig.maxFreq)}
                    setValue={setChartConfig}
                    decrementBtnDisabled={chartConfig.maxFreq - 1 < 0}
                    resetPayload={true}
                    resetPayloadField={resetPayloadField}
                    style={
                      payload["maxFreq"] === "invalid"
                        ? {
                            borderColor: colors.formErrorFeedback,
                            outlineColor: colors.formErrorFeedback,
                          }
                        : ""
                    }
                  />
                </div>
              </div>
            )}

            {Object.keys(chartConfig.bearing).length > 0 &&
              chartConfig.metric === "Envelope" && (
                <>
                  <label className="stcm__radio-group__title">
                    Frequência de Falha de Rolamento
                  </label>

                  <div className="stcm__input-group--wrapper">
                    <div className="stcm__radio-group">
                      <input
                        type="radio"
                        id="bpfi"
                        name="selectedFreq"
                        value="bpfi"
                        checked={chartConfig.bearing.selectedFreq === "bpfi"}
                        onChange={handleBearingFailureFrequencyChange}
                      />
                      <label htmlFor="bpfi">BPFI</label>
                    </div>

                    <div className="stcm__radio-group">
                      <input
                        type="radio"
                        id="bpfo"
                        name="selectedFreq"
                        value="bpfo"
                        checked={chartConfig.bearing.selectedFreq === "bpfo"}
                        onChange={handleBearingFailureFrequencyChange}
                      />
                      <label htmlFor="bpfo">BPFO</label>
                    </div>

                    <div className="stcm__radio-group">
                      <input
                        type="radio"
                        id="bsf"
                        name="selectedFreq"
                        value="bsf"
                        checked={chartConfig.bearing.selectedFreq === "bsf"}
                        onChange={handleBearingFailureFrequencyChange}
                      />
                      <label htmlFor="bsf">BSF</label>
                    </div>
                  </div>
                </>
              )}

            <div className="stcm__slider__wrapper">
              <label htmlFor="slider">
                Faixa de Frequência
                {freq_error.error && (
                  <span style={{ color: colors.formErrorFeedback }}>
                    {freq_error.message.fullMessage}
                  </span>
                )}
              </label>

              <div className="stcm__slider">
                <FrequencyRangeSlider
                  frequencyOptions={frequencyOptions}
                  spectralOptions={spectralOptions}
                  chartConfig={chartConfig}
                  sliderConfig={sliderConfig}
                  setSliderConfig={setSliderConfig}
                  freqError={freq_error.error}
                />
              </div>
            </div>

            <CheckboxDropdown
              label="Eixos"
              options={axesOptions}
              objKey={"axes"}
              objArr={chartConfig.axes}
              setOptions={setChartConfig}
              resetPayload={true}
              resetPayloadField={resetPayloadField}
              style={
                payload["axes"] === "invalid"
                  ? {
                      borderColor: colors.formErrorFeedback,
                      outlineColor: colors.formErrorFeedback,
                    }
                  : ""
              }
            />

            <CheckboxDropdown
              label="Defeito(s) Atrelado(s)"
              tooltip="Os defeitos atrelados definidos nesta seção serão utilizados como diagnósticos caso haja alarme deste gráfico."
              defaultValue={"Nenhum"}
              options={tiedDefects}
              objKey={"tiedDefects"}
              objArr={chartConfig.tiedDefects}
              setOptions={setChartConfig}
            />
          </div>
        }
      />
    );
  }
};

export default SpectrumTendencyChartModal;
