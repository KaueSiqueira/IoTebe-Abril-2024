import React from "react";
import { MachineConfig } from "../../../../dashboards/sensor/settings_cards/machine_config/MachineConfig";
import { BearingConfig } from "../../../../dashboards/sensor/settings_cards/bearing/BearingConfig/BearingConfig";
import { OldCollectConfig } from "../../../../dashboards/sensor/settings_cards/old_collect_config/OldCollectConfig";
import { NewCollectConfig } from "../../../../dashboards/sensor/settings_cards/new_collect_config/NewCollectConfig";
import useReviewConfig from "../../../../hooks/ReviewConfig/useReviewConfig";
import "./ReviewConfig.css";

export default function ReviewConfig({
  lock,
  setLock,
  turnLock,
  page,
  setSave,
}) {
  const {
    sensorSettings,
    handleDropdownChange,
    handleInputChange,
    handleSwitchRotation,
    handleTransmissionChange,
    handleFixationChange,
    MACHINE_TYPES_OPTIONS,
    handleTableChange,
    addTableRow,
    deselectTableRows,
    deleteTableRow,
    setSensorSettings,
    normalizeAxisOption,
    handleBearingTypeSave,
    collectSettings,
    handleSliderChange,
    handleSwitchChange,
    handleRadioChange,
    setCollectSettings,
    firmwareVersion,
    gearLock,
    isAutoEnabled,
  } = useReviewConfig({ lock, setLock, turnLock, page, setSave });

  return (
    <>
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
        sideMenu={true}
        turnLock={turnLock}
        gearLock={gearLock}
        allowTooltips={false}
        disabled={isAutoEnabled}
      />
      <BearingConfig
        sensorSettings={sensorSettings}
        setSensorSettings={setSensorSettings}
        normalizeAxisOption={normalizeAxisOption}
        handleDropdownChange={handleDropdownChange}
        handleBearingTypeSave={handleBearingTypeSave}
        sideMenu={true}
        disabled={isAutoEnabled}
        allowTooltips={false}
        turnLock={turnLock}
      />
      {firmwareVersion ? (
        <NewCollectConfig
          collectSettings={collectSettings}
          handleDropdownChange={handleDropdownChange}
          handleSliderChange={handleSliderChange}
          handleSwitchChange={handleSwitchChange}
          handleInputChange={handleInputChange}
          normalizeAxisOption={normalizeAxisOption}
          handleRadioChange={handleRadioChange}
          setCollectSettings={setCollectSettings}
          sideMenu={true}
          disabled={isAutoEnabled}
        />
      ) : (
        <div>
          <OldCollectConfig
            collectSettings={collectSettings}
            handleSliderChange={handleSliderChange}
            handleSwitchChange={handleSwitchChange}
            handleInputChange={handleInputChange}
            sideMenu={true}
            disabled={isAutoEnabled}
          />
        </div>
      )}
    </>
  );
}
