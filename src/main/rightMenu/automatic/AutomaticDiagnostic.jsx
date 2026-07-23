import React from "react";
import useAutomaticDiagnostic from "../../../hooks/Automatic/RightMenu/useAutomaticDiagnostic";
import "./AutomaticDiagnostic.css";
import {
  AutoMode,
  DisplaySettings,
  ModelTraining,
  MonitorHeart,
} from "@mui/icons-material";
import InfoMenu from "./infoMenu/infoMenu";
import ReviewConfig from "./reviewConfig/ReviewConfig";
import TrainingData from "./trainingData/TrainingData";
import EquipmentHealth from "./equipmentHealth/EquipmentHealth";
import { ComponentLoader, PopupModal } from "../../../components";
import { FinalStep } from "../../../assets/customIcons/automaticDiagnostic";

export default function AutomaticDiagnostic() {
  const {
    page,
    setPage,
    lock,
    setLock,
    turnLock,
    setTurnLock,
    save,
    setSave,
    buttonText,
    verifyFunction,
    setVerifyFunction,
    loadingAutomatic,
    loadingAutomaticInfo,
    validSpec,
    activateAutomDiagnostic,
    isAutoEnabled,
    disableAutoDiagnostic,
    disableModal,
    setDisableModal,
    hasDataChanges,
  } = useAutomaticDiagnostic();

  return (
    <div className="automaticWrapper">
      <div
        className={`automaticHeader ${
          page === 0 && !isAutoEnabled && "hidden"
        }`}
      >
        <h1>Diagnóstico Automático</h1>
        {page !== 0 && (
          <div
            className="row"
            style={{ paddingLeft: "5px", paddingRight: "20px" }}
          >
            <p>
              <div className={`circle ${page > 0 && "selected"}`}>
                <DisplaySettings />
              </div>
              <span>Dados Técnicos</span>
            </p>
            <hr className={`${page > 1 && "selected"}`} />
            <p>
              <div className={`circle ${page > 1 && "selected"}`}>
                <ModelTraining />
              </div>
              <span>Dados de Treinamento</span>
            </p>
            <hr className={`${page > 2 && "selected"}`} />
            <p>
              <div className={`circle ${page > 2 && "selected"}`}>
                <MonitorHeart />
              </div>
              <span>Saúde do Equipamento</span>
            </p>
          </div>
        )}
      </div>
      <div
        className={`${
          isAutoEnabled && page === 0 ? "congratulations" : "hidden"
        }`}
      >
        <p>O diagnóstico automático está ativado.</p>
        <div className="final-image">
          <FinalStep />
        </div>
        <div className="toggle-automatic-diagnostic">
          <p>Clique no botão abaixo para desativar</p>
          <button
            className={`foward ${isAutoEnabled && "auto-enabled"}`}
            onClick={
              isAutoEnabled
                ? () => {
                    setDisableModal(true);
                  }
                : ""
            }
          >
            <AutoMode />
            Desativar Diagnóstico Automático
          </button>
        </div>
      </div>

      <div className={(page !== 0 || isAutoEnabled) && "hidden"}>
        <InfoMenu />
      </div>

      {isAutoEnabled && page !== 0 && (
        <p className="auto-message">
          Para editar as informações, é necessário desativar o diagnóstico
          automático.
        </p>
      )}
      <div style={{ marginTop: "-15px" }} className={page !== 1 && "hidden"}>
        <ReviewConfig
          lock={lock}
          setLock={setLock}
          turnLock={turnLock}
          page={page}
          setSave={setSave}
        />
      </div>

      <div className={page !== 2 && "hidden"}>
        <TrainingData
          lock={page === 2}
          setLock={setLock}
          turnLock={turnLock}
          page={page}
          setPage={setPage}
          setSave={setSave}
          setVerifyFunction={setVerifyFunction}
        />
      </div>

      <div className={page !== 3 && "hidden"}>
        <EquipmentHealth
          lock={page === 3}
          setLock={setLock}
          turnLock={turnLock}
          page={page}
          setSave={setSave}
          setVerifyFunction={setVerifyFunction}
        />
      </div>

      <div className="startConfigButton">
        <hr />
        {page === 0 && (
          <button
            className={`foward ${isAutoEnabled && "auto-enabled"}`}
            onClick={() => setPage(page + 1)}
          >
            <AutoMode />
            {isAutoEnabled
              ? "Visualizar Configurações"
              : "Configurar Diagnóstico Automático"}
          </button>
        )}
        {page !== 0 && (
          <div className="row wrapButton">
            <button
              className="back twoButtons"
              onClick={() =>
                setPage((prev) => {
                  if (prev === 2) {
                    setLock(false);
                    setTurnLock(false);
                  }

                  return prev - 1;
                })
              }
            >
              Voltar
            </button>
            {(!isAutoEnabled || (isAutoEnabled && page < 3)) && (
              <button
                className={`foward twoButtons ${
                  !isAutoEnabled && turnLock && lock && "lock"
                }`}
                onClick={() => {
                  if (isAutoEnabled || (page === 2 && !hasDataChanges)) {
                    setPage(page + 1);
                  } else if (verifyFunction) {
                    verifyFunction();
                  } else if (page === 3) {
                    activateAutomDiagnostic();
                  } else {
                    if (lock) {
                      setTurnLock(true);
                    } else {
                      setPage(page + 1);
                    }
                  }
                }}
              >{`${
                isAutoEnabled || (page === 2 && !hasDataChanges)
                  ? "Avançar"
                  : buttonText[validSpec && page === 2 ? page - 1 : page]
              } ${
                !isAutoEnabled && save && !(page === 2 && !hasDataChanges)
                  ? " e Salvar"
                  : ""
              }`}</button>
            )}
          </div>
        )}
      </div>
      <PopupModal
        showModal={disableModal}
        toggleModal={() => {
          setDisableModal(!disableModal);
        }}
        title={"Desativar Diagnóstico Automático"}
        dismissFunc={() => {
          setDisableModal(!disableModal);
        }}
        onDismissTitle={"Cancelar"}
        onConfirm={() => {
          disableAutoDiagnostic();
          setDisableModal(!disableModal);
        }}
        onConfirmTitle={"Confirmar"}
      >
        <p>Tem certeza que deseja desativar o Diagnóstico Automático?</p>
      </PopupModal>
      {(loadingAutomatic || loadingAutomaticInfo) && (
        <ComponentLoader
          customStyle={loadingAutomaticInfo ? { backgroundColor: "#fff" } : {}}
        />
      )}
    </div>
  );
}
