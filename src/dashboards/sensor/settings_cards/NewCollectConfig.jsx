import React, { Fragment, useState, useEffect } from "react";
import { AccessAlarm } from "@mui/icons-material";
import { ValueLabelComponent, MyCustomSlider } from "./Customizations";
import { Input, LabeledCard, CheckboxDropdown } from "../../../components";
import { GlobalCollectConfig } from "./GlobalCollectConfig";
import { SpectralCollectConfig } from "./SpectralCollectConfig";
import { AutomaticSetupSwitch } from "./AutomaticSetupSwitch";
import { DynamicBand } from "./DynamicBand";

const METRICS = [
    "Velocidade RMS",
    "Aceleração RMS",
    null,
    null,
    "Aceleração Pico",
    "Aceleração Pico a Pico",
    null,
    null,
]

export function NewCollectConfig({
    collectSettings,
    handleDropdownChange,
    handleSliderChange,
    handleSwitchChange,
    handleInputChange,
    normalizeAxisOption,
    handleRadioChange,
    setCollectSettings,
    handleDynamicBandChange,
    style,
    sideMenu,
    disabled,
}) {
    const [isAuto, setIsAuto] = useState(true)

    return (
        <div className="mainConfigDiv" style={{ padding: "0px 15px 80px 15px", marginTop: sideMenu && 30, display: !sideMenu && "grid", gap: 30, ...style }}>
            <h1 style={{fontSize: sideMenu && 15, margin: !sideMenu ? 0 : "0 0 10px 0"}}>Coleta</h1>
            {sideMenu ? 
            <p>
                <b>Atenção:</b> Ao concluir a ativação do diagnóstico automático, as configurações de coleta serão alteradas para o setup automático.
            </p> :
            <DynamicBand value={collectSettings.dynamicBand} setCollectSettings={setCollectSettings} disabled={disabled} />}
            {/* <AutomaticSetupSwitch handleRadioChange={handleRadioChange} setIsAuto={setIsAuto} isAuto={isAuto} /> */}
            <SpectralCollectConfig sideMenu={sideMenu} collectSettings={collectSettings} setCollectSettings={setCollectSettings} handleInputChange={handleInputChange} handleSliderChange={handleSliderChange} isAuto={isAuto} disabled={disabled} />
            {!sideMenu && <GlobalCollectConfig collectSettings={collectSettings} handleInputChange={handleInputChange} handleSliderChange={handleSliderChange} isAuto={isAuto} />}
        </div>
    );
}