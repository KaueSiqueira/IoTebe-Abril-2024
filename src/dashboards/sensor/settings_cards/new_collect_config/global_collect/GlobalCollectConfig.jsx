import React from "react";
import { ValueLabelComponent, MyCustomSlider } from "../../Customizations";
import { CollectSetup } from "./CollectSetup"; 
import { colors } from "../../../../../utilities";


export const GlobalCollectConfig = ({ collectSettings, setCollectSettings, handleSetupInputChange, handleSliderChange, disableInputs }) => {
    return (
        <div>
            <h5 className="iotebe-label" style={{ paddingInline: 0 }}>Coleta global</h5>
            <h6 className="iotebe-label" style={{ paddingInline: 0, fontSize: 14, fontWeight: 500 }}>Intervalo</h6>
            <div style={{ display: "flex", flexWrap: "wrap", rowGap: 10, alignItems: "center", inlineSize: "100%", marginBottom: 30 }}>
                <div className={window.innerWidth < 700 ? "col-12" : "col-2"} style={{ marginBlockStart: 40, marginLeft: 10, marginBlockEnd: 4, paddingInline: 0 }}>
                    <MyCustomSlider
                        valueLabelDisplay="on"
                        value={collectSettings?.rmstempSamplingPeriod}
                        name="rmstempSamplingPeriod"
                        onChange={(e, newValue) => handleSliderChange("rmstempSamplingPeriod", newValue)}
                        min={1}
                        max={10}
                        ValueLabelComponent={ValueLabelComponent}
                    />
                </div>
            </div>

            <div 
                style={{
                        display: "grid",
                        gridTemplateColumns: window.innerWidth < 700 ? "1fr" : "1fr 1fr 1fr 1fr",
                        gap: 30,
                        justifyContent: "start" 
                }}
            >
                {!!collectSettings && collectSettings.hasOwnProperty("setup1")
                && <CollectSetup 
                    setupNumber={1}
                    setupData={collectSettings.setup1} 
                    setCollectSettings={setCollectSettings}
                    setSetupData={handleSetupInputChange}
                    disableInputs={disableInputs}
                    invalid={collectSettings.setup1.metrics?.some(v => {
                        return collectSettings.setup2.metrics.includes(v);
                    })}
                />}
                {!!collectSettings && collectSettings.hasOwnProperty("setup2")
                && <CollectSetup 
                    setupNumber={2}
                    setupData={collectSettings.setup2} 
                    setCollectSettings={setCollectSettings}
                    setSetupData={handleSetupInputChange}
                    disableInputs={disableInputs}
                    invalid={collectSettings.setup1.metrics?.some(v => {
                        return collectSettings.setup2.metrics.includes(v);
                    })}
                />}
            </div>
        </div>
    )
}


