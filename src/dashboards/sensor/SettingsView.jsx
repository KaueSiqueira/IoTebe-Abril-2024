import React from "react";

import { OldCollectConfig } from "./settings_cards/old_collect_config/OldCollectConfig";
import { NewCollectConfig } from "./settings_cards/new_collect_config/NewCollectConfig";
import { BearingConfig } from "./settings_cards/bearing/BearingConfig/BearingConfig";
import { MachineConfig } from "./settings_cards/machine_config/MachineConfig";
import { ArrowBackRounded } from "@mui/icons-material";
import useSettingsView from "../../hooks/Settings/useSettingsView";


export default function SettingsView({
  spotId,
  setLoading,
  shouldSaveSettings,
  setShouldSaveSettings,
  updateSettings,
  shouldConfirmSettings,
  setShouldConfirmSettings,
  setUpdateSpotModal,
  setIsSettingsVisible,
  shouldConfirmDiagnostic,
  setShouldConfirmDiagnostic,
  setConfirmDiagnosticModal,
  hasAutoDiagnostic,
  setHasAutoDiagnostic
}) {

  const {
    sensorSettings,
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
    handleSliderChange,
    handleSwitchChange,
    handleRadioChange,
    setCollectSettings,
    hasAccessToFullScaleSettings,
    hasAccessToSetupConfig,
  } = useSettingsView({
    spotId,
    setLoading,
    shouldSaveSettings,
    setShouldSaveSettings,
    updateSettings,
    shouldConfirmSettings,
    setShouldConfirmSettings,
    setUpdateSpotModal,
    setIsSettingsVisible,
    shouldConfirmDiagnostic,
    setShouldConfirmDiagnostic,
    setConfirmDiagnosticModal,
    hasAutoDiagnostic,
    setHasAutoDiagnostic
  });

  return (
    <div className={hasAccessToFullScaleSettings ? null : "row "} id="chartsContainer">
      <div
        className={hasAccessToFullScaleSettings ? "mainConfigDiv" : "col-12 mainConfigDiv"}
        style={{ padding: 0 }}
      >
        <h4
          onClick={() => setIsSettingsVisible(false)}
          style={{ cursor: "pointer", marginTop: 30, marginBottom: 30 }}
        >
          <ArrowBackRounded />
          Voltar para os gráficos
        </h4>
        <h1 style={{ marginBottom: 10 }}>Configuração</h1>
        <div
          className="cont-espc-config-buttons"
          style={{ zIndex: 2, marginBottom: 30 }}
        >
          <div className="divider-screen" style={{ marginLeft: 15 }}>
            <button
              className={`divider-screen-button ${page === "equipment" && "divider-screen-selected"
                }`}
              onClick={() => setPage("equipment")}
            >
              Equipamento
            </button>
            <button
              className={`divider-screen-button ${page === "axis" && "divider-screen-selected"
                }`}
              onClick={() => setPage("axis")}
            >
              Eixos e Mancais
            </button>
            <button
              className={`divider-screen-button ${page === "colect" && "divider-screen-selected"
                }`}
              onClick={() => setPage("colect")}
            >
              Coleta
            </button>
          </div>
        </div>
        <MachineConfig
          sensorSettings={sensorSettings}
          handleDropdownChange={handleDropdownChange}
          handleInputChange={handleInputChange}
          handleSwitchRotation={handleSwitchRotation}
          handleTransmissionChange={handleTransmissionChange}
          handleFixationChange={handleFixationChange}
          MACHINE_TYPES_OPTIONS={MACHINE_TYPES_OPTIONS}
          handleTableChange={handleTableChange}
          addTableRow={addTableRow}
          deselectTableRows={deselectTableRows}
          deleteTableRow={deleteTableRow}
          style={{ display: page !== "equipment" && "none" }}
        />

        <BearingConfig
          sensorSettings={sensorSettings}
          setSensorSettings={setSensorSettings}
          normalizeAxisOption={normalizeAxisOption}
          handleDropdownChange={handleDropdownChange}
          handleBearingTypeSave={handleBearingTypeSave}
          style={{ display: page !== "axis" && "none" }}
        />
      </div>

      {hasAccessToFullScaleSettings ? (
        <NewCollectConfig
          collectSettings={collectSettings}
          availableAxes={[sensorSettings.axisX, sensorSettings.axisY, sensorSettings.axisZ]}
          handleDropdownChange={handleDropdownChange}
          handleSliderChange={handleSliderChange}
          handleSwitchChange={handleSwitchChange}
          handleInputChange={handleInputChange}
          handleSetupInputChange={handleSetupInputChange}
          normalizeAxisOption={normalizeAxisOption}
          handleRadioChange={handleRadioChange}
          setCollectSettings={setCollectSettings}
          allowSetupChanges={hasAccessToSetupConfig}
          style={{ display: page !== "colect" ? "none" : "grid" }}
        />
      ) : (
        <div className="col-12 col-xl-5" style={{ padding: 0 }}>
          <OldCollectConfig
            collectSettings={collectSettings}
            handleSliderChange={handleSliderChange}
            handleSwitchChange={handleSwitchChange}
            handleInputChange={handleInputChange}
            style={{ display: page !== "colect" && "none" }}
          />
        </div>
      )}
    </div>
  );
}
