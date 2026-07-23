import React, { useState } from "react";
import {
  Button,
  ComponentLoader,
  PopupModal,
  AssociationModal,
  AssociationSensorButton,
} from "../../components";
import ChartsView from "./ChartsView";
import SettingsView from "./SettingsView";
import IoTebeModal from "../../components/IoTebeModal";
import NamePath from "../name_path/NamePath";
import useDashSpot from "../../hooks/DashSpot/useDashSpot";
import {
  ProtectedFeature,
  hasPermission,
} from "../../components/ProtectedFeature/ProtectedFeature";

function DashSpot() {
  const {
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
    setHasAutoDiagnostic,
  } = useDashSpot();

  const [shouldConfirmDiagnostic, setShouldConfirmDiagnostic] = useState(false);
  const [confirmDiagnosticModal, setConfirmDiagnosticModal] = useState(false);
  const [returnPage, setReturnPage] = useState("");

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      {isLoading && <ComponentLoader />}

      {modalSpot && (
        <AssociationModal
          showModal={modalSpot}
          className="modalSpot"
          isOnTree={false}
          dismissFunc={() => setModalSpot(!modalSpot)}
          sensorId={selectedNode.sensor_id}
          newSpotId={selectedNode.id}
          style={
            window.screen.width < 992 ? { width: "95%" } : { width: "45vw" }
          }
        />
      )}

      {updateSpotModal && (
        <IoTebeModal
          showModal={updateSpotModal}
          changeMarginBottom={"35px"}
          title="Confirmar Alterações"
          onConfirmTitle="Sim"
          onDismissTitle="Não"
          children="A alteração realizada impacta os gráficos personalizados espectrais, alterando seu range de frequências. Você tem certeza que deseja realizar esta modificação?"
          dismissFunc={() => {
            setUpdateSpotModal(false);
            setShouldConfirmSettings(false);
          }}
          onConfirm={() => {
            setUpdateSpotModal(false);
            setShouldConfirmDiagnostic(true);
          }}
        />
      )}

      {confirmDiagnosticModal && (
        <IoTebeModal
          showModal={confirmDiagnosticModal}
          changeMarginBottom={"35px"}
          title="Confirmação de Alterações nas Configurações"
          onConfirmTitle="Sim"
          onDismissTitle="Não"
          children="Ao salvar suas alterações, o Diagnóstico Automático será desativado e precisará ser reconfigurado com as novas configurações. Tem certeza de que deseja prosseguir e salvar as alterações?"
          dismissFunc={() => {
            setConfirmDiagnosticModal(false);
          }}
          onConfirm={() => {
            setConfirmDiagnosticModal(false);
            setShouldSaveSettings(true);
          }}
        />
      )}

      <div className="visibiltyDiv" style={{ opacity: 1 }}>
        <div
          id="dashHeader"
          style={
            isSettingsVisible
              ? {
                  paddingBottom: 6,
                  boxShadow:
                    window.innerWidth > 700 &&
                    "0px 1px 0px 0px rgba(50, 50, 50, 0.3)",
                }
              : {}
          }
        >
          <div className="dashHeader-left">
            <NamePath fullPath={selectedNameFullPath} />
            <AssociationSensorButton
              onClick={() =>
                hasPermission(["CONFIG_SPOTS"], selectedNode.permission) &&
                setModalSpot(true)
              }
              conditional={selectedNode.sensor_id}
              text={selectedNode.sensor_id}
            />
          </div>
          <div className="dashHeader-align">
            {!isSettingsVisible && !config && (
              <ProtectedFeature requiredPermissions={["CONFIG_MACHINE_INFO"]}>
                <Button
                  onClick={() => setIsSettingsVisible(true)}
                  className="rounded-button"
                >
                  Configurar
                </Button>
              </ProtectedFeature>
            )}
          </div>
        </div>

        <div id="SubContainer">
          {isSettingsVisible ? (
            <ProtectedFeature requiredPermissions={["CONFIG_MACHINE_INFO"]}>
              <SettingsView
                spotId={selectedNodeChildren[0]}
                setLoading={setIsLoading}
                shouldSaveSettings={shouldSaveSettings}
                setShouldSaveSettings={setShouldSaveSettings}
                updateSettings={updateSettings}
                shouldConfirmSettings={shouldConfirmSettings}
                setUpdateSpotModal={setUpdateSpotModal}
                setShouldConfirmSettings={setShouldConfirmSettings}
                setIsSettingsVisible={setIsSettingsVisible}
                shouldConfirmDiagnostic={shouldConfirmDiagnostic}
                setShouldConfirmDiagnostic={setShouldConfirmDiagnostic}
                setConfirmDiagnosticModal={setConfirmDiagnosticModal}
                hasAutoDiagnostic={hasAutoDiagnostic}
                setHasAutoDiagnostic={setHasAutoDiagnostic}
              />
              <div className="settingSaveBar">
                <div className="settingSaveButton">
                  <Button
                    onClick={() => setIsSettingsVisible(false)}
                    className="rounded-button-outlined"
                  >
                    Cancelar
                  </Button>
                  <div style={{ width: 10 }}></div>
                  <Button
                    onClick={() => setShouldConfirmSettings(true)}
                    className="rounded-button"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </ProtectedFeature>
          ) : (
            <ChartsView
              spotId={selectedNodeChildren[0]}
              setLoading={setIsLoading}
              setConfigAlarm={setConfig}
              configAlarm={config}
              showSettings={() => setIsSettingsVisible(true)}
              returnPage={returnPage}
              setReturnPage={setReturnPage}
            />
          )}
        </div>

        <PopupModal
          title="Erro"
          showModal={errorOnSensorSettingsModal}
          toggleModal={() =>
            setErrorOnSensorSettingsModal(!errorOnSensorSettingsModal)
          }
        >
          <p>{errorMessageModal}</p>
        </PopupModal>
      </div>
    </div>
  );
}

export default DashSpot;
