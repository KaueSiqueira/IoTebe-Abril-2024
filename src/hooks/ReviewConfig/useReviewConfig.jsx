import { useEffect, useContext } from "react";
import useDashSpot from "../DashSpot/useDashSpot";
import useSettingsView from "../Settings/useSettingsView";
import { haveChanges } from "../../utilities";
import { RightSideMenuContext } from "../../contexts";

export default function useReviewConfig({ setLock, turnLock, page, setSave }) {
  const { setLoadingAutomatic, isAutoEnabled } =
    useContext(RightSideMenuContext);

  const {
    selectedNodeChildren,
    setUpdateSpotModal,
    setShouldConfirmSettings,
    setShouldSaveSettings,
    shouldSaveSettings,
    updateSettings,
    shouldConfirmSettings,
    setIsSettingsVisible,
  } = useDashSpot();

  const {
    sensorSettings,
    originalSensorSettings,
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
    originalCollectSettings,
    handleSliderChange,
    handleSwitchChange,
    handleRadioChange,
    setCollectSettings,
    firmwareVersion,
    gearLock,
  } = useSettingsView({
    spotId: selectedNodeChildren[0],
    setLoading: setLoadingAutomatic,
    shouldSaveSettings,
    setShouldSaveSettings,
    updateSettings,
    shouldConfirmSettings,
    setShouldConfirmSettings,
    setUpdateSpotModal,
    setIsSettingsVisible,
    setLock,
    turnLock,
    sideMenuPage: page,
  });

  useEffect(() => {
    if (page === 2) setShouldSaveSettings(true);
  }, [page, setShouldSaveSettings]);

  useEffect(() => {
    if (page === 1) {
      if (
        haveChanges(originalSensorSettings, sensorSettings) ||
        haveChanges(originalCollectSettings, collectSettings)
      ) {
        setSave(true);
      } else {
        setSave(false);
      }
    }
  }, [
    sensorSettings,
    collectSettings,
    originalSensorSettings,
    originalCollectSettings,
    page,
    setSave,
  ]);

  return {
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
  };
}
