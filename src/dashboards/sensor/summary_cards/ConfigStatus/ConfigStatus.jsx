import React from "react";
import {
  Motor,
  Bomba_Centrifuga,
  Gerador,
  Redutor,
  Rotores,
  Ventilador_Exaustor,
  Turbina,
  Outros,
} from "../../../../assets/imgs/machine_type_images";
import UploadPhotosModal from "../UploadPhotosModal/UploadPhotosModal";

import SpotImagesModal from "../SpotImagesModal/SpotImagesModal";
import SpotImages from "../SpotImages/SpotImages";
import useConfigStatus from "./hooks/useConfigStatus";
import CollectSpectrumButton from "../CollectSpectrumButton/CollectSpectrumButton";
import styles from "./styles/ConfigStatus.module.css";
import { strToNumFirmwareVersion } from "../../../../utilities";
import { ProtectedFeature } from "../../../../components/ProtectedFeature/ProtectedFeature";

const ConfigStatus = (props) => {
  const {
    data,
    imagesModal,
    setImagesModal,
    handleClose,
    setUploadImagesModal,
    handleOpen,
    uploadImagesModal,
  } = useConfigStatus(props);

  const MACHINE_TYPES_OPTIONS = [
    "Selecione",
    "Motor Elétrico",
    "Bomba Centrífuga",
    "Ventilador/Exaustor",
    "Turbina a Vapor",
    "Redutor",
    "Gerador",
    "Rotores em Geral",
    "Outros",
  ];

  const MACHINE_IMAGES = [
    Outros,
    Motor,
    Bomba_Centrifuga,
    Ventilador_Exaustor,
    Turbina,
    Redutor,
    Gerador,
    Rotores,
    Outros,
  ];

  const formatStringTime = (string) => {
    let hour = string.split(":");
    hour.pop();
    hour = hour.join("h");
    return hour;
  };

  const convertTypeBearing = {
    ROLLING: "Rolamento",
    SLEEVE: "Deslizamento",
    OTHER: "Outros",
  };

  return (
    <div className="width-100p flex-column-between">
      <h6 className="summaryTitle">Ficha técnica</h6>
      <div className="ConfigCard background-table weight500">
        <SpotImages
          data={props.data}
          machineImg={MACHINE_IMAGES[data.machine_type ? data.machine_type : 0]}
          setIsModalOpen={setUploadImagesModal}
          handleOpenImagesModal={handleOpen}
          spotId={props.spotId}
          setSummaryLoading={props.setSummaryLoading}
          summaryLoading={props.summaryLoading}
          loadData={props.loadData}
        />

        {uploadImagesModal && (
          <UploadPhotosModal
            showModal={uploadImagesModal}
            dismissFunc={() => setUploadImagesModal(false)}
            setSummaryLoading={props.setSummaryLoading}
            loadData={props.loadData}
            spotId={props.spotId}
            data={props.data}
          />
        )}

        <SpotImagesModal
          machineType={MACHINE_TYPES_OPTIONS[data.machine_type]}
          bearingType={data.bearing_type}
          rotationSpeed={data.rotation_speed}
          data={props.data}
          imagesModal={imagesModal}
          setImagesModal={setImagesModal}
          handleClose={handleClose}
          setUploadImagesModal={setUploadImagesModal}
          loadData={props.loadData}
        />

        <div className="width-90p rowConfig">
          <span className="titleConfigStatus ">
            Tipo de máquina <br />
            <span className="dataReturned dont-break">
              {MACHINE_TYPES_OPTIONS[data.machine_type] === null ||
              MACHINE_TYPES_OPTIONS[data.machine_type] === "" ||
              !MACHINE_TYPES_OPTIONS[data.machine_type]
                ? "--"
                : MACHINE_TYPES_OPTIONS[data.machine_type]}
            </span>
          </span>
        </div>

        <div className="width-90p rowConfig">
          <span className="titleConfigStatus ">
            Tipo de mancal <br />
            <span className="dataReturned dont-break">
              {data.bearing_type === null || data.bearing_type === ""
                ? "--"
                : convertTypeBearing[data.bearing_type]}
            </span>
          </span>
        </div>

        <div className="width-90p rowConfig">
          <span className="titleConfigStatus ">
            Potência (kW) <br />
            <span className="dataReturned dont-break">
              {data.power === null ? "--" : `${data.power}`}
            </span>
          </span>
        </div>

        <div className="width-90p rowConfig">
          <span className="titleConfigStatus ">
            Rotação (rpm) <br />
            <span className="dataReturned dont-break">
              {data.rotation_speed === null ? "--" : `${data.rotation_speed}`}
            </span>
          </span>
        </div>

        <div className="width-90p rowConfig">
          <span className="titleConfigStatus ">
            Coleta de RMS (intervalo) <br />
            <span className="dataReturned dont-break">
              {data.rmstemp_sampling_period === null
                ? "--"
                : `${data.rmstemp_sampling_period} min`}
            </span>
          </span>
        </div>

        <div className={`width-90p rowConfig`}>
          <span className="titleConfigStatus">
            Coleta do Espectro <br />
            <span className="dataReturned dont-break">
              {data.spectrum_sampling_time === null
                ? "--"
                : formatStringTime(data.spectrum_sampling_time)}
            </span>
          </span>
        </div>
        {strToNumFirmwareVersion(props.sensorVersion) >=
          strToNumFirmwareVersion("v3.0.0") && (
          <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
            <div
              className={`width-90p rowConfig ${styles.spectrumCollectContainer}`}
            >
              <CollectSpectrumButton
                spotId={props.spotId}
                sensorConnection={props.sensorConnection}
              />
            </div>
          </ProtectedFeature>
        )}
      </div>
    </div>
  );
};

export default ConfigStatus;
