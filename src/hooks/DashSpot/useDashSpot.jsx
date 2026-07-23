import { useContext, useState } from "react";
import { updateMachineInfo, updateCollectInfo } from "../../apis";
import { WhichRenderContext } from "../../contexts";
import { convertHour, strToNumFirmwareVersion } from "../../utilities";
import { disableAutomaticDiagnostic } from "../../apis/disableAutomaticDiagnostic";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

const convertAxis = {
    "VERTICAL": 1,
    "HORIZONTAL": 2,
    "AXIAL": 3,
    "RADIAL": 4,
    "TANGENCIAL": 5,
}

export default function useDashSpot() {
    const [isLoading, setIsLoading] = useState(true);
    const [config, setConfig] = useState(false);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [modalSpot, setModalSpot] = useState(false);
    const [errorOnSensorSettingsModal, setErrorOnSensorSettingsModal] =
        useState(false);
    const [errorMessageModal, setErrorMessageModal] = useState(false);
    const {
        selectedNameFullPath,
        selectedNodeChildren,
        selectedNode,
        setIsPageLoading,
    } = useContext(WhichRenderContext);
    const [updateSpotModal, setUpdateSpotModal] = useState(false);
    const [shouldSaveSettings, setShouldSaveSettings] = useState(false);
    const [shouldConfirmSettings, setShouldConfirmSettings] = useState(false);

    const [hasAutoDiagnostic, setHasAutoDiagnostic] = useState(false)

    const updateSettings = async (sensorSettings, collectSettings, versions, disableAutoDiag) => {
        setUpdateSpotModal(false);

        let spectrumTime;

        if (collectSettings) {
            // SPECTRUM VALIDATION
            let isSpectrumTimeValid;

            let spectrumTimeCounter = collectSettings.spectrumSamplingTime.split(":");
            if (spectrumTimeCounter.length === 3) {
                isSpectrumTimeValid = /^([0-1]?\d|2[0-4]):([0-5]\d):([0-5]\d)?$/.test(
                    collectSettings.spectrumSamplingTime
                );
                spectrumTime = collectSettings.spectrumSamplingTime;
            } else if (spectrumTimeCounter.length === 2) {
                isSpectrumTimeValid = /^([0-1]?\d|2[0-4]):([0-5]\d)?$/.test(
                    collectSettings.spectrumSamplingTime
                );
                spectrumTime = collectSettings.spectrumSamplingTime + ":00";
            } else {
                isSpectrumTimeValid = false;
                spectrumTime = undefined;
            }

            if (!isSpectrumTimeValid) {
                setErrorMessageModal(
                    "Horário de coleta do espectro inválido (o formato deve ser hh:mm ou hh:mm:ss"
                );
                setErrorOnSensorSettingsModal(true);

                return;
            }
        }

        if (sensorSettings) {
            if (
                sensorSettings.axisX === sensorSettings.axisY ||
                sensorSettings.axisX === sensorSettings.axisZ ||
                sensorSettings.axisY === sensorSettings.axisZ
            ) {
                setErrorMessageModal(
                    "A direção dos eixos em setup não pode ser iguais\nselecione valores diferentes para cada eixo"
                );
                setErrorOnSensorSettingsModal(true);

                return;
            } else if (
                sensorSettings.axisX === "-" ||
                sensorSettings.axisY === "-" ||
                sensorSettings.axisZ === "-"
            ) {
                setErrorMessageModal(
                    "Não pode haver campos vazios na direção dos eixos em setup\nselecione valores diferentes para cada eixo"
                );
                setErrorOnSensorSettingsModal(true);

                return;
            }
        }

        // SETTINGS UPLOAD IF PASSED ALL CRITERIA
        setIsLoading(true);
        setIsPageLoading(false);

        try {
            if (collectSettings) {
                if (
                    versions?.sensorVersion && versions?.gatewayVersion 
                    &&
                    versions.gatewayVersion >= strToNumFirmwareVersion("v2.0.7") 
                    &&
                    versions.sensorVersion >= strToNumFirmwareVersion("3.1.0")
                ){
                    const metricLabels = {
                        "Velocidade RMS": 1,
                        "Aceleração RMS": 2,
                        "Aceleração Pico": 5,
                        "Kurtosis": 12, 
                        "Skewness": 13,
                    }

                    const payload = {
                        dynamic_band: collectSettings.dynamicBand,
                        automatic_collect_setup: collectSettings.autoSetup,
                        spectrum_sampling_period: collectSettings.spectrumSamplingPeriod,
                        global_sampling_period: collectSettings.rmstempSamplingPeriod,
                        spectrum_sampling_time: convertHour(
                            spectrumTime,
                            new Date().getTimezoneOffset()
                        ),
                        setting_type: {
                            setup_1: {
                                max_frequency: Number(collectSettings.setup1.spectrum_max_frequency),
                                number_of_lines: Number(collectSettings.setup1.spectrum_lines),
                                high_pass_filter: Number(collectSettings.setup1.high_pass_frequency) || null,
                                low_pass_filter: Number(collectSettings.setup1.low_pass_frequency) || null,
                                metrics: collectSettings.setup1.metrics.map(m=>metricLabels[m]),
                            },
                            setup_2: {
                                max_frequency: Number(collectSettings.setup2.spectrum_max_frequency),
                                number_of_lines: Number(collectSettings.setup2.spectrum_lines),
                                high_pass_filter: Number(collectSettings.setup2.high_pass_frequency) || null,
                                low_pass_filter: Number(collectSettings.setup2.low_pass_frequency) || null,
                                metrics: collectSettings.setup2.metrics.map(m=>metricLabels[m]),
                            }
                        },
                        disable_spectrum: false,
                        spectrum_max_frequency: Number(collectSettings.maxFrequencySpectral),
                        spectrum_number_of_lines: Number(collectSettings.lineNumber),
                        spectrum_axes: collectSettings.collectSpectrumAxes.map(axis => {
                            return convertAxis[axis]
                        }),
                        spectrum_on_alarm: collectSettings.spectrumOnAlarm
                    };

                    await updateCollectInfo(selectedNodeChildren[0], payload);
                } else {
                    const payload = {
                        dynamic_band: collectSettings.dynamicBand,
                        automatic_collect_setup: collectSettings.autoSetup,
                        spectrum_sampling_period: collectSettings.spectrumSamplingPeriod,
                        global_sampling_period: collectSettings.rmstempSamplingPeriod,
                        spectrum_sampling_time: convertHour(
                            spectrumTime,
                            new Date().getTimezoneOffset()
                        ),
                    };

                    await updateCollectInfo(selectedNodeChildren[0], payload)
                }
            }

            if (sensorSettings) {
                const addedBearing = sensorSettings.bearingList.filter(
                    (el) => !el.hasOwnProperty("bearing_user_id")
                );

                const bearingList = sensorSettings.bearingList.filter((el) =>
                    el.hasOwnProperty("bearing_user_id")
                );

                const addedGmf = sensorSettings.gearBoxGmfList.filter(
                    (el) => !el.hasOwnProperty("gear_box_gmf_id")
                );

                const gmfList = sensorSettings.gearBoxGmfList.filter((el) =>
                    el.hasOwnProperty("gear_box_gmf_id")
                );

                const payload = {
                    machine_type: sensorSettings.machineType,
                    bearing_type: sensorSettings.bearingType,
                    has_variable_rotation: sensorSettings.hasVariableRotation,
                    min_rotation: sensorSettings.minRotation
                        ? sensorSettings.minRotation
                        : null,
                    max_rotation: sensorSettings.maxRotation
                        ? sensorSettings.maxRotation
                        : null,
                    rotation_speed: sensorSettings.rotationSpeed
                        ? sensorSettings.rotationSpeed
                        : null,
                    power: sensorSettings.power,
                    axis_x: sensorSettings.axisX,
                    axis_y: sensorSettings.axisY,
                    axis_z: sensorSettings.axisZ,
                    fixation_type_id: sensorSettings.fixationTypeId
                        ? sensorSettings.fixationTypeId
                        : null,
                    transmission_type_id: sensorSettings.transmissionTypeId
                        ? sensorSettings.transmissionTypeId
                        : null,
                    division_count: sensorSettings.divisionCount,
                    bearing_list: bearingList,
                    added_bearing: addedBearing,
                    gmf_list: gmfList,
                    added_gmf: addedGmf,
                    removed_bearing: sensorSettings.removedBearing,
                    removed_gmf: sensorSettings.removedGearBoxGmf,
                };

                await updateMachineInfo(selectedNodeChildren[0], payload);
            }

            disableAutoDiag && await disableAutomaticDiagnostic(selectedNodeChildren[0]);

            setIsSettingsVisible(false);
            (disableAutoDiag || sensorSettings || collectSettings) && FeedbackToast.success();
        } catch (error) {
            console.log(error);
            setIsSettingsVisible(false);
            FeedbackToast.error();
        } finally {
            setShouldConfirmSettings(false);
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        setIsLoading,
        modalSpot,
        setModalSpot,
        selectedNode,
        selectedNodeChildren,
        updateSpotModal,
        setUpdateSpotModal,
        setShouldConfirmSettings,
        setShouldSaveSettings,
        isSettingsVisible,
        selectedNameFullPath,
        config,
        setConfig,
        shouldSaveSettings,
        updateSettings,
        shouldConfirmSettings,
        setIsSettingsVisible,
        errorOnSensorSettingsModal,
        errorMessageModal,
        setErrorOnSensorSettingsModal,
        hasAutoDiagnostic,
        setHasAutoDiagnostic
    }
}