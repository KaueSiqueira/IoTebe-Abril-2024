import { useEffect, useState, useCallback, useContext } from "react";
import {
  getMachineInfo,
  getCollectInfo,
  getAutomaticDiagnostic,
} from "../../apis";
import {
  convertHour,
  haveChanges,
  strToNumFirmwareVersion,
} from "../../utilities";
import { RightSideMenuContext } from "../../contexts";

const DEFAULT_MACHINE_DATA = {
  axisX: undefined,
  axisY: undefined,
  axisZ: undefined,
  machineType: undefined,
  bearingType: undefined,
  hasVariableRotation: 0,
  maxRotation: null,
  minRotation: null,
  rotationSpeed: null,
  power: 0,
  fixationTypeId: null,
  transmissionTypeId: null,
  divisionCount: null,
  bearingList: [],
  gearBoxGmfList: [],
  removedBearing: [],
  removedGearBoxGmf: [],
};

const DEFAULT_COLLECT_DATA = {
  dynamicBand: 8,
  autoSetup: true,
  spectrumSamplingTime: "00:00:00",
  rmstempSamplingPeriod: 5,
  spectrumSamplingPeriod: 24,
  collectSpectrumAxes: [],
  lineNumber: 8192,
  setup1: {
    high_pass_frequency: null,
    low_pass_frequency: null,
    metrics: [],
  },
  setup2: {
    high_pass_frequency: null,
    low_pass_frequency: null,
    metrics: [],
  },
};

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

const BEARING_TYPE = ["Selecione", "Deslizamento", "Rolamento", "Outros"];

const BEARING_TYPE_BD = [null, "SLEEVE", "ROLLING", "OTHER"];

const TRANSMISSION = [
  "Selecione",
  "Polia",
  "Cardã",
  "Integrada",
  "Acoplamento",
];

const metricsNumbers = {
  1: "Velocidade RMS",
  2: "Aceleração RMS",
  5: "Aceleração Pico",
  12: "Kurtosis",
  13: "Skewness",
};

export default function useSettingsView({
  spotId,
  setLoading,
  shouldSaveSettings,
  setShouldSaveSettings,
  updateSettings,
  shouldConfirmSettings,
  setShouldConfirmSettings,
  setUpdateSpotModal,
  setLock,
  shouldConfirmDiagnostic = false,
  setShouldConfirmDiagnostic = () => {},
  setConfirmDiagnosticModal = () => {},
  hasAutoDiagnostic = false,
  setHasAutoDiagnostic = () => {},
  sideMenuPage,
}) {
  const [sensorSettings, setSensorSettings] = useState(DEFAULT_MACHINE_DATA);
  const [collectSettings, setCollectSettings] = useState(DEFAULT_COLLECT_DATA);

  const [originalSensorSettings, setOriginalSensorSettings] = useState({});
  const [originalCollectSettings, setOriginalCollectSettings] = useState({});

  const [hasAccessToFullScaleSettings, setHasAccessToFullScaleSettings] =
    useState(false);
  const [hasAccessToSetupConfig, setHasAccessToSetupConfig] = useState(false);
  const [rotationSettings, setRotationSettings] = useState({});
  const [page, setPage] = useState("equipment");
  const [gearLock, setGearLock] = useState(false);
  const [settingsLock, setSettingsLock] = useState(false);
  const [versions, setVersions] = useState(null);
  const [disableAutoDiag, setDisableAutoDiag] = useState(false);

  const { setStandardSettings } = useContext(RightSideMenuContext);

  useEffect(() => {
    if (shouldSaveSettings) {
      setShouldSaveSettings(false);

      try {
        updateSettings(
          haveChanges(originalSensorSettings, sensorSettings)
            ? sensorSettings
            : false,
          haveChanges(originalCollectSettings, collectSettings)
            ? collectSettings
            : false,
          versions,
          disableAutoDiag
        );
        haveChanges(originalSensorSettings, sensorSettings) &&
          setOriginalSensorSettings(sensorSettings);
        haveChanges(originalCollectSettings, collectSettings) &&
          setOriginalCollectSettings(collectSettings);

        setStandardSettings({
          machineType: sensorSettings.machineType,
          power: sensorSettings.power,
          transmissionTypeId: sensorSettings.transmissionTypeId,
          fixationTypeId: sensorSettings.fixationTypeId,
          maxRotation:
            sensorSettings.machineType !== 5
              ? sensorSettings.hasVariableRotation
                ? sensorSettings.maxRotation
                : sensorSettings.rotationSpeed
              : sensorSettings.hasVariableRotation
              ? sensorSettings.gearBoxGmfList.find((obj) => obj.selected_gmf)
                  .max_rotation
              : sensorSettings.gearBoxGmfList.find((obj) => obj.selected_gmf)
                  .nominal_rotation,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    collectSettings,
    disableAutoDiag,
    originalCollectSettings,
    originalSensorSettings,
    sensorSettings,
    setShouldSaveSettings,
    setStandardSettings,
    shouldSaveSettings,
    updateSettings,
    versions,
  ]);

  useEffect(() => {
    if (shouldConfirmSettings) {
      if (
        rotationSettings.rotationSpeed !== sensorSettings.rotationSpeed ||
        rotationSettings.minRotation !== sensorSettings.minRotation ||
        rotationSettings.maxRotation !== sensorSettings.maxRotation
      ) {
        setUpdateSpotModal(true);
      } else setShouldConfirmDiagnostic(true);
      setShouldConfirmSettings(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldConfirmSettings]);

  useEffect(() => {
    if (shouldConfirmDiagnostic) {
      if (hasAutoDiagnostic) {
        const originalRequiredAutoDiagSettings = {
          machineType: originalSensorSettings.machineType,
          bearingType: originalSensorSettings.bearingType,
          fixationTypeId: originalSensorSettings.fixationTypeId,
          transmissionTypeId: originalSensorSettings.transmissionTypeId,
          power: originalSensorSettings.power,
          hasVariableRotation: originalSensorSettings.hasVariableRotation,
          rotationSpeed: originalSensorSettings.rotationSpeed,
          minRotation: originalSensorSettings.minRotation,
          maxRotation: originalSensorSettings.maxRotation,
          divisionCount: originalSensorSettings.divisionCount,
          gearBoxGmfList: originalSensorSettings.gearBoxGmfList,
          bearingList: originalSensorSettings.bearingList,
          axisX: originalSensorSettings.axisX,
          axisY: originalSensorSettings.axisY,
          axisZ: originalSensorSettings.axisZ,
          collectSettings: {
            autoSetup: originalCollectSettings.autoSetup,
            collectSpectrumAxes: originalCollectSettings.collectSpectrumAxes,
            lineNumber: originalCollectSettings.lineNumber,
            maxFrequencySpectral: originalCollectSettings.maxFrequencySpectral,
            setup1: originalCollectSettings.setup1,
            setup2: originalCollectSettings.setup2,
          },
        };
        const requiredAutoDiagSettings = {
          machineType: sensorSettings.machineType,
          bearingType: sensorSettings.bearingType,
          fixationTypeId: sensorSettings.fixationTypeId,
          transmissionTypeId: sensorSettings.transmissionTypeId,
          power: sensorSettings.power,
          hasVariableRotation: sensorSettings.hasVariableRotation,
          rotationSpeed: sensorSettings.rotationSpeed,
          minRotation: sensorSettings.minRotation,
          maxRotation: sensorSettings.maxRotation,
          divisionCount: sensorSettings.divisionCount,
          gearBoxGmfList: sensorSettings.gearBoxGmfList,
          bearingList: sensorSettings.bearingList,
          axisX: sensorSettings.axisX,
          axisY: sensorSettings.axisY,
          axisZ: sensorSettings.axisZ,
          collectSettings: {
            autoSetup: collectSettings.autoSetup,
            collectSpectrumAxes: collectSettings.collectSpectrumAxes,
            lineNumber: collectSettings.lineNumber,
            maxFrequencySpectral: collectSettings.maxFrequencySpectral,
            setup1: collectSettings.setup1,
            setup2: collectSettings.setup2,
          },
        };
        if (
          haveChanges(
            originalRequiredAutoDiagSettings,
            requiredAutoDiagSettings
          )
        ) {
          setDisableAutoDiag(true);
          setConfirmDiagnosticModal(true);
        } else {
          setDisableAutoDiag(false);
          setShouldSaveSettings(true);
        }
      } else setShouldSaveSettings(true);
      setShouldConfirmDiagnostic(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldConfirmDiagnostic]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setHasAccessToFullScaleSettings(false);
    setHasAccessToSetupConfig(false);
    setVersions(null);
    try {
      let [machine, collect, diagnostic] = await Promise.all([
        getMachineInfo(spotId),
        getCollectInfo(spotId),
        getAutomaticDiagnostic(spotId),
      ]);

      machine = machine.data;
      collect = collect.data;
      diagnostic = diagnostic.data;

      setHasAutoDiagnostic(diagnostic.automatic_diag ? true : false);

      const sensorFirmwareVersion = strToNumFirmwareVersion(
        collect.sensor_firmware_version
      );
      const gatewayFirmwareVersion = strToNumFirmwareVersion(
        collect.gateway_firmware_version
      );

      setVersions({
        sensorVersion: sensorFirmwareVersion,
        gatewayVersion: gatewayFirmwareVersion,
      });

      if (sensorFirmwareVersion && gatewayFirmwareVersion) {
        if (
          gatewayFirmwareVersion >= strToNumFirmwareVersion("v2.0.0") &&
          sensorFirmwareVersion >= strToNumFirmwareVersion("v3.0.0")
        ) {
          setHasAccessToFullScaleSettings(true);
        }

        if (
          gatewayFirmwareVersion >= strToNumFirmwareVersion("v2.0.7") &&
          sensorFirmwareVersion >= strToNumFirmwareVersion("v3.1.0")
        ) {
          setHasAccessToSetupConfig(true);
        }
      }

      const machineData = JSON.stringify({
        machineType: machine.machine_type,
        hasVariableRotation: machine.has_variable_rotation || 0,
        minRotation: machine.min_rotation || null,
        maxRotation: machine.max_rotation || null,
        rotationSpeed: machine.rotation_speed,
        power: machine.power,
        axisX: machine.axis_x,
        axisY: machine.axis_y,
        axisZ: machine.axis_z,
        fixationTypeId: machine.fixation_type_id,
        transmissionTypeId: machine.transmission_type_id,
        bearingList: machine.bearing_list || [],
        removedBearing: [],
        bearingType: machine.bearing_type,
        gearBoxGmfList: machine.gear_box_gmf_list || [],
        removedGearBoxGmf: [],
        divisionCount: machine.division_count,
      });

      const empty_setup = {
        axes: ["HORIZONTAL", "VERTICAL", "AXIAL"],
        high_pass_frequency: null,
        low_pass_frequency: null,
        metrics: [],
        spectrum_lines: 2050,
        spectrum_max_frequency: 6675,
      };
      
      const collectData = {
        rmstempSamplingPeriod: collect.global_sampling_period, // ACQUISITION
        spectrumSamplingTime: convertHour(collect.spectrum_sampling_time),
        spectrumSamplingPeriod: collect.spectrum_sampling_period,
        autoSetup: collect.automatic_collect_setup || true,
        dynamicBand: collect.dynamic_band ? collect.dynamic_band : 8,
        collectSpectrumAxes: collect.setups[0]?.axes || [
          machine.axis_x,
          machine.axis_y,
          machine.axis_z,
        ],
        lineNumber: collect.setups[0]?.spectrum_lines || 8192,
        maxFrequencySpectral: collect.setups[0]?.spectrum_max_frequency || 256,
        spectrumOnAlarm: collect.spectrum_on_alarm? true : false,
      };
      
      if (parseInt(collectData.maxFrequencySpectral) === 593) {
        collectData.maxFrequencySpectral = 593.333
      }

      collectData.setup1 = collect.setups[1]
        ? {
            metrics: collect.setups[1].metrics.map((m) => metricsNumbers[m]),
            axes: ["HORIZONTAL", "VERTICAL", "AXIAL"],
            high_pass_frequency: collect.setups[1].high_pass_frequency,
            low_pass_frequency: collect.setups[1].low_pass_frequency,
            spectrum_lines: 2050,
            spectrum_max_frequency: collect.setups[1].spectrum_max_frequency,
          }
        : { ...empty_setup };

      if (parseInt(collectData.setup1.spectrum_max_frequency) === 593) {
        collectData.setup1.spectrum_max_frequency = 593.333
      }

      collectData.setup2 = collect.setups[2]
        ? {
            metrics: collect.setups[2].metrics.map((m) => metricsNumbers[m]),
            axes: ["HORIZONTAL", "VERTICAL", "AXIAL"],
            high_pass_frequency: collect.setups[2].high_pass_frequency,
            low_pass_frequency: collect.setups[2].low_pass_frequency,
            spectrum_lines: 2050,
            spectrum_max_frequency: collect.setups[2].spectrum_max_frequency,
          }
        : { ...empty_setup };

        if (parseInt(collectData.setup2.spectrum_max_frequency) === 593) {
          collectData.setup2.spectrum_max_frequency = 593.333
        }

      setSensorSettings({ ...JSON.parse(machineData) });
      setOriginalSensorSettings({ ...JSON.parse(machineData) });

      setCollectSettings(collectData);
      setOriginalCollectSettings(collectData);

      setRotationSettings({
        hasVariableRotation: machine.has_variable_rotation || 0,
        minRotation: machine.min_rotation || null,
        maxRotation: machine.max_rotation || null,
        rotationSpeed: machine.rotation_speed,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoading, setRotationSettings, spotId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (
    configType,
    { target: { min, max, value, name, type } }
  ) => {
    let configState;
    let configData;
    if (configType === "machine") {
      configState = setSensorSettings;
      configData = sensorSettings;
    } else {
      configState = setCollectSettings;
      configData = collectSettings;
    }
    
    if (name === "divisionCount") value = Math.round(value);
    if (name == "spectrumOnAlarm") {
      configState(prev  => ({ ...configData, [name]: !prev.spectrumOnAlarm }));
    }
    else if (type === "time") {
      configState({ ...configData, [name]: value });
    } else if (min && Number(value) < min) {
      configState({ ...configData, [name]: min });
      alert("O valor mínimo para este campo é " + min);
    } else if (max && Number(value) > max) {
      configState({ ...configData, [name]: max });
      alert("O valor máximo para este campo é " + max);
    } else if (value === "0" || value === "00" || isNaN(Number(value)))
      configState({ ...configData, [name]: "0" });
    else configState({ ...configData, [name]: Number(value) });
  };

  const handleSetupInputChange = (
    setup,
    { target: { min, max, value, name, type } }
  ) => {
    if (type === "number") value = Number(value);
    if (max && value > max) value = max;
    if (min && value < min) value = min;
    // if (name === "high_pass_frequency" && value + 3 > collectSettings[setup].low_pass_frequency)
    //     value = collectSettings[setup].low_pass_frequency - 3
    // if (name === "low_pass_frequency" && value - 3 < collectSettings[setup].high_pass_frequency)
    //     value = collectSettings[setup].high_pass_frequency + 3
    setCollectSettings((prev) => ({
      ...prev,
      [setup]: {
        ...prev[setup],
        [name]: value,
      },
    }));
  };

  const handleDropdownChange = ({ target: { name, value } }) => {
    let updatedValue;

    if (name === "machineType") {
      updatedValue = MACHINE_TYPES_OPTIONS.indexOf(value);
    } else if (name.includes("axis")) {
      updatedValue = value.toUpperCase();
    } else {
      updatedValue = value;
    }

    setSensorSettings({
      ...sensorSettings,
      [name]: updatedValue,
    });
  };

  const handleBearingTypeSave = ({ target: { name, value } }) => {
    setSensorSettings({
      ...sensorSettings,
      [name]: BEARING_TYPE_BD[BEARING_TYPE.indexOf(value)],
    });
  };

  const handleSwitchRotation = ({ target: { name, value } }) => {
    setSensorSettings({
      ...sensorSettings,
      [name]: value === "Sim" ? 1 : 0,
    });
  };

  const handleTransmissionChange = ({ target: { name, value } }) => {
    setSensorSettings({
      ...sensorSettings,
      [name]: TRANSMISSION.indexOf(value),
    });
  };

  const handleFixationChange = ({ target: { name, value } }) => {
    let updatedValue;

    if (value === "Selecione") {
      updatedValue = null;
    } else if (value === "Rígida") {
      updatedValue = 1;
    } else {
      updatedValue = 2;
    }

    setSensorSettings({
      ...sensorSettings,
      [name]: updatedValue,
    });
  };

  const normalizeAxisOption = (option) => {
    if (option) {
      return option.charAt(0) + option.substring(1).toLowerCase();
    }
  };

  const handleSwitchChange = ({ target: { name, checked } }) => {
    setCollectSettings({ ...collectSettings, [name]: checked ? 0 : 1 });
  };

  const handleSliderChange = (name, newValue) => {
    setCollectSettings({ ...collectSettings, [name]: newValue });
  };

  const handleRadioChange = (event) => {
    if (event.target.value === "AUTO") {
      setCollectSettings({
        ...collectSettings,
        maxFrequencySpectral: 6000,
        maxFrequencyCollect2: 6000,
        maxFrequencyCollect1: 100,
      });
    }
  };

  const handleTableChange = (tableName, index, { target: { name, value } }) => {
    const updatedTable = [...sensorSettings[tableName]];
    updatedTable[index][name] = Number(value);
    setSensorSettings({
      ...sensorSettings,
      [tableName]: updatedTable,
    });
  };

  const addTableRow = (tableName, row, selectFieldName) => {
    const updatedTable = [...sensorSettings[tableName]];
    updatedTable.push(row);
    if (updatedTable.length === 1) {
      row[selectFieldName] = 1;
    }
    setSensorSettings({
      ...sensorSettings,
      [tableName]: updatedTable,
    });
  };

  const deselectTableRows = (tableName, fieldName, exceptIndex) => {
    const updatedTable = [...sensorSettings[tableName]];
    updatedTable.forEach((obj, index) => {
      if (index !== exceptIndex) {
        obj[fieldName] = 0;
      }
    });
    setSensorSettings({
      ...sensorSettings,
      [tableName]: updatedTable,
    });
  };

  const deleteTableRow = (
    tableName,
    index,
    selectFieldName,
    removedFieldName,
    idFieldName
  ) => {
    const updatedTable = [...sensorSettings[tableName]];

    if (updatedTable[index][selectFieldName] === 1) {
      if (updatedTable[index - 1]) {
        updatedTable[index - 1][selectFieldName] = 1;
      } else if (updatedTable[index + 1]) {
        updatedTable[index + 1][selectFieldName] = 1;
      }
    }

    const [removedRow] = updatedTable.splice(index, 1);
    const removedList = removedRow.hasOwnProperty(idFieldName)
      ? [...sensorSettings[removedFieldName], removedRow[idFieldName]]
      : [...sensorSettings[removedFieldName]];

    setSensorSettings({
      ...sensorSettings,
      [tableName]: updatedTable,
      [removedFieldName]: removedList,
    });
  };

  useEffect(() => {
    if (
      sensorSettings.gearBoxGmfList.length > 0 &&
      sensorSettings.machineType === 5
    ) {
      sensorSettings.gearBoxGmfList.forEach((gear) => {
        if (
          gear.nominal_rotation < 300 ||
          (sensorSettings.hasVariableRotation === 1 &&
            (gear.min_rotation === 0 ||
              !gear.min_rotation ||
              !gear.max_rotation ||
              gear.min_rotation < 300 ||
              gear.min_rotation > gear.max_rotation ||
              gear.min_rotation > gear.nominal_rotation ||
              gear.nominal_rotation > gear.max_rotation ||
              gear.max_rotation - gear.min_rotation > 600))
        ) {
          setGearLock(true);
        } else setGearLock(false);
      });
    } else setGearLock(false);

    if (
      sensorSettings.machineType === 0 ||
      sensorSettings.machineType === 8 ||
      (sensorSettings.hasVariableRotation === 1 &&
        sensorSettings.machineType !== 5 &&
        (sensorSettings.minRotation === 0 ||
          !sensorSettings.minRotation ||
          !sensorSettings.maxRotation ||
          sensorSettings.minRotation > sensorSettings.maxRotation ||
          sensorSettings.minRotation > sensorSettings.rotationSpeed ||
          sensorSettings.minRotation < 300 ||
          sensorSettings.maxRotation < sensorSettings.rotationSpeed ||
          sensorSettings.maxRotation - sensorSettings.minRotation > 600)) ||
      (sensorSettings.machineType !== 5 &&
        sensorSettings.rotationSpeed < 300) ||
      !sensorSettings.power ||
      sensorSettings.power === 0 ||
      !sensorSettings.transmissionTypeId ||
      sensorSettings.transmissionTypeId === 0 ||
      !sensorSettings.fixationTypeId ||
      sensorSettings.fixationTypeId === 0 ||
      sensorSettings.axisX === sensorSettings.axisY ||
      sensorSettings.axisX === sensorSettings.axisZ ||
      sensorSettings.axisY === sensorSettings.axisZ
    ) {
      setSettingsLock(true);
    } else setSettingsLock(false);
  }, [sensorSettings]);

  useEffect(() => {
    if (sideMenuPage === 1) {
      if (!settingsLock && !gearLock) {
        setLock(false);
      } else {
        setLock(true);
      }
    }
  }, [settingsLock, gearLock, setLock, sideMenuPage]);

  return {
    sensorSettings,
    originalSensorSettings,
    handleDropdownChange,
    handleInputChange,
    handleSetupInputChange,
    handleSwitchRotation,
    handleTransmissionChange,
    handleFixationChange,
    MACHINE_TYPES_OPTIONS,
    handleTableChange,
    addTableRow,
    deselectTableRows,
    deleteTableRow,
    page,
    setPage,
    setSensorSettings,
    normalizeAxisOption,
    handleBearingTypeSave,
    collectSettings,
    originalCollectSettings,
    handleSliderChange,
    handleSwitchChange,
    handleRadioChange,
    setCollectSettings,
    hasAccessToFullScaleSettings,
    hasAccessToSetupConfig,
    gearLock,
    hasAutoDiagnostic,
  };
}
