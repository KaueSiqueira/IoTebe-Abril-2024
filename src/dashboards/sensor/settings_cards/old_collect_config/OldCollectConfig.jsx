import React from "react";
import { ValueLabelComponent, MyCustomSlider } from "../Customizations";
import { Input } from "../../../../components";

export function OldCollectConfig({ collectSettings, handleSliderChange, handleInputChange, style, sideMenu, disabled }) {
  return (
      <div className="row mainConfigDiv" style={{paddingBottom: 60, ...style}}>
        <h1 style={{marginBottom: sideMenu ? 10 : 30, fontSize: sideMenu && 15}}>Coleta</h1>
        {!sideMenu && <div className="col-12" style={{marginBottom: 30}}>
          <h6 className="iotebe-label" style={{paddingInline: 0, marginBlockEnd: 6, fontSize: sideMenu && 15}}>Coleta global</h6>
          <h7 style={{ fontSize: 14, color: "#777" }}>Intervalo</h7>
          <div className="row">
            <div className="col-12" style={{ marginBlockStart: 40, marginBlockEnd: 4, paddingInline: 0 }}>
              <MyCustomSlider
                valueLabelDisplay="on"
                value={collectSettings.rmstempSamplingPeriod}
                name="rmstempSamplingPeriod"
                onChange={(e, newValue) => !disabled && handleSliderChange("rmstempSamplingPeriod", newValue)}
                min={1}
                max={10}
                ValueLabelComponent={ValueLabelComponent}
              />
            </div>
          </div>
        </div>}

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, alignItems: "flex-start", inlineSize: "100%", paddingInline: 15 }}>
          <div style={{ display: "flex", flexDirection: "column", inlineSize: "fit-content" }}>
            <div style={{ alignItems: "center", display: "flex", columnGap: 10 }}>
              <h6 className="iotebe-label" style={{ paddingInline: 0, marginBlockEnd: 6 }}>Coleta espectral</h6>
            </div>
            <p style={{ fontSize: 14, color: "#777" }}>
                Espectro coletado 1 vez ao dia
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", inlineSize: "fit-content" }}>
            <Input
              name="spectrumSamplingTime"
              onChange={(e) => {
                handleInputChange("collect", e);
              }}
              value={collectSettings.spectrumSamplingTime}
              label="Horário da coleta"
              type="time"
              step="60"
              placeholder="ex. 12:00 horas"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
  );
}
