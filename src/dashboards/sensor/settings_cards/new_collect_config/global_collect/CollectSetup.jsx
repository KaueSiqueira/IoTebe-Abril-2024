import React, { useState, useEffect } from "react";
import { Input } from "../../../../../components";
import { MyCustomSwitch } from "../../Customizations";
import MetricCheckboxDropdown from "./MetricCheckboxDropdown";
import { colors } from "../../../../../utilities";


export const CollectSetup = ({ setupNumber, setupData, setSetupData, setCollectSettings, disableInputs, invalid}) => {
    const [samplingTime, setSamplingTime] = useState(null)

    useEffect(() => {
        if (setupData?.spectrum_max_frequency)
            setSamplingTime(setupData?.spectrum_lines / (setupData?.spectrum_max_frequency))
    }, [setSamplingTime, setupData]);

    return (
        <div style={
            invalid ? { borderColor: colors.formErrorFeedback, borderRadius: 6, border: '0.50px #156284 solid', padding: 20 }
            : { borderRadius: 6, border: '0.50px #156284 solid', padding: 20 }
        }>
            <div style={{
                display: "inline-flex",
                width: "100%",
                position: "sticky"
            }}>
                <h6 style={{ color: '#777777', fontSize: 18, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word', padding: 0 }}>Setup de coleta {setupNumber}</h6>
                {/* <MyCustomSwitch
                    name="setupEnabled"
                    onChange={{}}
                    checked={true}
                /> */}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignContent: "space-evenly", gap: 10, margin: "1.5rem 0px" }}>
                <Input
                    name="spectrum_max_frequency"
                    onChange={(e) => {setSetupData("setup"+setupNumber, e)}}
                    value={setupData?.spectrum_max_frequency}
                    label="Frequência máxima (Hz)"
                    options={[133.5, 267, 593.333, 1335, 2670, 6675]}
                    type="number"
                    disabled={true}
                />
                <MetricCheckboxDropdown
                    label="Métricas"
                    options={["Velocidade RMS", "Aceleração RMS", "Aceleração Pico"]} // , "Kurtosis", "Skewness"]}
                    objKey={"list"}
                    objArr={[...setupData?.metrics].sort()}
                    setOptions={e => {
                        setCollectSettings(prev => ({...prev,
                            [`setup${setupNumber}`]: {
                                ...prev["setup"+setupNumber],
                                "metrics": e
                            }
                        }))
                    }}
                    resetPayload={false}
                    resetPayloadField={{}}
                    margin={window.innerWidth < 700 ? {marginTop: "auto"} : {}}
                    style={disableInputs ? { margin: 0, backgroundColor: "#EFEFEF", borderColor: "#777", paddingBlock: 14, fontSize: '14px',  } : {paddingBlock: 14}}
                    fieldsetStyle={{ marginBlockStart: 0 }}
                    disabled={true}
                />
                <Input
                    name="high_pass_frequency"
                    onChange={(e) => {
                        setSetupData("setup"+setupNumber, e);
                    }}
                    value={setupData?.high_pass_frequency}
                    label="Filtro passa alta (Hz)"
                    type="number"
                    placeholder="NA"
                    min={0}
                    max={6675}
                    disabled={disableInputs}
                    style={
                        Number(setupData?.high_pass_frequency) > Number(setupData?.spectrum_max_frequency) ? {
                            borderColor: colors.formErrorFeedback,
                            outlineColor: colors.formErrorFeedback
                        }
                        : ""
                    }
                />
                <Input
                    name="low_pass_frequency"
                    onChange={(e) => {
                        setSetupData("setup"+setupNumber, e);
                    }}
                    value={setupData?.low_pass_frequency}
                    label="Filtro passa baixa (Hz)"
                    type="number"
                    placeholder={"NA"}
                    min={0}
                    max={6675}
                    disabled={disableInputs}
                    style={
                        (Number(setupData?.low_pass_frequency) > Number(setupData?.spectrum_max_frequency))
                        || (Number(setupData?.low_pass_frequency) !== 0 
                        && Number(setupData?.low_pass_frequency) <= Number(setupData?.high_pass_frequency) + 3) ? {
                            borderColor: colors.formErrorFeedback,
                            outlineColor: colors.formErrorFeedback
                        }
                        : ""
                    }
                />
                <Input
                    name="sampling_time"
                    onChange={(e) => {
                        setSetupData("setup"+setupNumber, e);
                    }}
                    value={samplingTime?.toFixed(3)}
                    label="Tempo de aquisição (s)"
                    type="number"
                    disabled
                    style={{ backgroundColor: "#EFEFEF", borderColor: "#777" }}
                /> 
            </div>
        </div>
    )
}