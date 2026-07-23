import React, { useState, useEffect } from "react";
import { Input, CheckboxDropdown } from "../../../../components";
import { AltValueLabelComponent, MyCustomSlider, ValueLabelComponent } from "../Customizations";
import { MyCustomSwitch } from "../../../sensor/settings_cards/Customizations";

export const SpectralCollectConfig = ({ collectSettings, setCollectSettings, availableAxes, handleInputChange, disableInputs, sideMenu, disabled, handleSliderChange }) => {
    const AXIS_OPTIONS = [collectSettings.axisX, collectSettings.axisY, collectSettings.axisZ]
    const [roundNumber, setRoundNumber] = useState(0)
    const [frequencyResolutionSpectral, setFrequencyResolutionSpectral] = useState(collectSettings.maxFrequencySpectral / collectSettings.lineNumber)
    const [samplingTime, setSamplingTime] = useState(collectSettings.lineNumber / collectSettings.maxFrequencySpectral)

    const marks = [
        {
            value: 6,
        },
        {
            value: 8,
        },
        {
            value: 12,
        },
        {
            value: 24,
        },
    ];

    useEffect((prev) => {
        if (collectSettings.dynamicBand) {
            setRoundNumber(samplingTime * (collectSettings.dynamicBand / 60))
        }
    }, [setRoundNumber, collectSettings.dynamicBand, samplingTime])

    useEffect(() => {
        setFrequencyResolutionSpectral(collectSettings.maxFrequencySpectral / collectSettings.lineNumber)
    }, [setFrequencyResolutionSpectral, collectSettings.maxFrequencySpectral, collectSettings.lineNumber])

    useEffect(() => {
        setSamplingTime(collectSettings.lineNumber / collectSettings.maxFrequencySpectral)
    }, [setSamplingTime, collectSettings.maxFrequencySpectral, collectSettings.lineNumber])

    return (
        <div>
            {!sideMenu &&
                <>
                    <h5 className="iotebe-label" style={{ paddingInline: 0 }}>Coleta espectral</h5>
                    {/* <h6 className="iotebe-label" style={{ paddingInline: 0, fontSize: 14, fontWeight: 500 }}>Intervalo</h6> */}
                </>
            }
            <div style={{ display: "grid", gridTemplateColumns: sideMenu || window.innerWidth < 700 ? "1fr" : "1fr 1fr 1fr", gap: "1rem"}}>
                <div style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", gap: 32, rowGap: 0, alignItems: "center", inlineSize: "100%", marginBottom: "1rem" }}>
                    <div className={window.innerWidth < 700 ? "col-12 markedSlider" : "col-2 markedSlider"} style={{ marginBlockStart: 40, marginLeft: 10, marginBlockEnd: 0, paddingInline: 0 }}>
                        <MyCustomSlider
                            valueLabelDisplay="on"
                            value={parseInt(collectSettings?.spectrumSamplingPeriod)}
                            name="spectrumSamplingPeriod"
                            onChange={(e, newValue) => handleSliderChange("spectrumSamplingPeriod", newValue)}
                            ValueLabelComponent={AltValueLabelComponent}
                            marks={marks}
                            step={null}
                            min={6}
                            max={24}
                            disabled={disabled}
                        />
                    </ div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "4em" }} >
                        <Input
                            name="spectrumSamplingTime"
                            onChange={(e) => {
                                handleInputChange("collect", e);
                            }}
                            value={collectSettings.spectrumSamplingTime}
                            label="Horário da coleta"// label="Início"
                            type="time"
                            step="60"
                            placeholder="ex. 12:00 horas"
                            disabled={disabled}
                        />
                        <div className="iotebe-input-wrapper" style={{ width: "100%", fontSize: "14px", margin: "0px" }}>
                            <div style={{ display: "flex", flexDirection: "row", gap: "1em", marginBlockEnd: "4px" }}>
                                <div style={{ fontSize: "14px", color: "rgb(119, 119, 119)", fontWeight: 600 }}>
                                    Espectro ao alarmar
                                </div>
                                <div className="iotebe-input-spectrumSamplingTime-wrapper" style={{ alignSelf: "center" }}>
                                    <MyCustomSwitch
                                        label="Espectro ao alarmar"
                                        name="spectrumOnAlarm"
                                        checked={collectSettings.spectrumOnAlarm ?? true}
                                        onChange={(e) => {
                                            handleInputChange("collect", e);
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{fontFamily: "Inter, sans-serif", color: "#777777", fontSize:"13px"}}>
                                Coleta automática ao surgir novo alarme
                            </div>
                        </div>

                    </div>
                </div>
                <Input
                    name="maxFrequencySpectral"
                    onChange={(e) => {
                        handleInputChange("collect", e);
                    }}
                    value={collectSettings.maxFrequencySpectral}
                    label="Frequência máxima (Hz)"
                    type="number"
                    options={[133.5, 267, 593.333, 1335, 2670, 6675]}
                    // unit="Hz"
                    disabled={true}
                    style={disableInputs ? { backgroundColor: "#EFEFEF", borderColor: "#777" } : ""}
                />
                <CheckboxDropdown
                    label="Eixos"
                    options={[...availableAxes].sort()}
                    objKey={"collectSpectrumAxes"}
                    objArr={[...collectSettings.collectSpectrumAxes].sort()}
                    setOptions={setCollectSettings}
                    resetPayload={false}
                    resetPayloadField={{}}
                    margin={window.innerWidth < 700 ? {marginTop: "auto"} : {}}
                    style={disableInputs ? { margin: 0, backgroundColor: "#EFEFEF", borderColor: "#777", paddingBlock: 14 } : {paddingBlock: 14}}
                    fieldsetStyle={{ marginBlockStart: 0 }}
                    disabled={true}
                />
                <Input
                    name="lineNumber"
                    onChange={(e) => {
                        handleInputChange("collect", e);
                    }}
                    value={collectSettings.lineNumber}
                    label="Número de linhas"
                    type="number"
                    options={[1024, 2048, 4096, 5461, 8192]}
                    min={0}
                    max={8192}
                    disabled={true}
                    style={disableInputs ? { backgroundColor: "#EFEFEF", borderColor: "#777" } : ""}
                />
                <Input
                    name="frequencyResolutionSpectral"
                    value={frequencyResolutionSpectral?.toFixed(3)}
                    label="Resolução de frequência (Hz)"
                    type="number"
                    min={0}
                    max={20000}
                    step={"any"}
                    disabled
                    style={{ backgroundColor: "#EFEFEF", borderColor: "#777" }}
                />
                <Input
                    name="aquisitionTimeSpectral"
                    value={samplingTime?.toFixed(3)}
                    label="Tempo de aquisição (s)"
                    type="number"
                    min={0}
                    max={50}
                    step={"any"}
                    disabled
                    style={{ backgroundColor: "#EFEFEF", borderColor: "#777" }}
                />
                <Input
                    name="roundNumber"
                    value={roundNumber?.toFixed(3)}
                    label="Número de voltas"
                    type="number"
                    min={0}
                    max={10}
                    step={"any"}
                    disabled
                    style={{ backgroundColor: "#EFEFEF", borderColor: "#777" }}
                />
            </div>
        </div>
    )
}