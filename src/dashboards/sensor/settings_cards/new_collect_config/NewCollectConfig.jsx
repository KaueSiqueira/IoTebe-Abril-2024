import React, { useState } from "react";
import { GlobalCollectConfig } from "./global_collect/GlobalCollectConfig";
import { SpectralCollectConfig } from "./SpectralCollectConfig";
import { DynamicBand } from "./DynamicBand";

export function NewCollectConfig({
    collectSettings,
    availableAxes,
    handleSliderChange,
    handleInputChange,
    handleSetupInputChange,
    setCollectSettings,
    style,
    sideMenu,
    allowSetupChanges,
    disabled
}) {
    const [isAuto, setIsAuto] = useState(false) // WIP - Ainda não implementado, manter "false"

    return (
        <div className="mainConfigDiv" style={{ padding: "0px 15px 80px 15px", marginTop: sideMenu && 30, display: !sideMenu && "grid", gap: 30, ...style }}>
            <h1 style={{fontSize: sideMenu && 15, margin: !sideMenu ? 0 : "0 0 10px 0"}}>Coleta</h1>
            {sideMenu ? 
            <p>
                <b>Atenção:</b> Ao concluir a ativação do diagnóstico automático, as configurações de coleta serão alteradas para o setup automático.
            </p> :
            <DynamicBand 
                value={collectSettings.dynamicBand} 
                setCollectSettings={setCollectSettings} 
                disabled={disabled}
            />}
            <SpectralCollectConfig 
                sideMenu={sideMenu} 
                availableAxes={availableAxes} 
                collectSettings={collectSettings} 
                setCollectSettings={setCollectSettings} 
                handleInputChange={handleInputChange}
                handleSliderChange={handleSliderChange} 
                disableInputs={isAuto||!allowSetupChanges}
                disabled={disabled}
            />
            {!sideMenu &&
             <GlobalCollectConfig 
                collectSettings={collectSettings} 
                handleInputChange={handleInputChange} 
                handleSetupInputChange={handleSetupInputChange} 
                setCollectSettings={setCollectSettings}
                handleSliderChange={handleSliderChange} 
                disableInputs={isAuto||!allowSetupChanges} 
            />}
        </div>
    );
}