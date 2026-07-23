import React from "react";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import {
  AddAPhotoRounded,
  AddPhotoAlternateOutlined,
  HelpOutline,
} from "@mui/icons-material";
import styles from "./styles/UploadPhotosModal.module.css";
import useUploadPhotosModal from "./hooks/useUploadPhotosModal";
import { blockExternalLink } from "../../../../utilities";

const Ximage = () => (
  <svg
    rwidth="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      opacity="0.8"
      cx="7.5"
      cy="7.5"
      r="7.5"
      transform="matrix(-1 0 0 1 15 0)"
      fill="#2F2F2F"
      fillOpacity="0.8"
    />
    <path
      opacity="0.8"
      d="M7.5 11.1C5.5155 11.1 3.9 9.4845 3.9 7.5C3.9 5.5155 5.5155 3.9 7.5 3.9C9.4845 3.9 11.1 5.5155 11.1 7.5C11.1 9.4845 9.4845 11.1 7.5 11.1ZM7.5 3C5.0115 3 3 5.0115 3 7.5C3 9.9885 5.0115 12 7.5 12C9.9885 12 12 9.9885 12 7.5C12 5.0115 9.9885 3 7.5 3ZM8.6655 5.7L7.5 6.8655L6.3345 5.7L5.7 6.3345L6.8655 7.5L5.7 8.6655L6.3345 9.3L7.5 8.1345L8.6655 9.3L9.3 8.6655L8.1345 7.5L9.3 6.3345L8.6655 5.7Z"
      fill="white"
    />
  </svg>
);

const StarImage = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7.5" cy="7.5" r="7.5" fill="#2F2F2F" fillOpacity="0.8" />
    <path
      d="M7.5 8.6379L5.808 9.59368L6.2535 7.79158L4.7595 6.57895L6.7305 6.42316L7.5 4.72211L8.2695 6.42316L10.2405 6.57895L8.7465 7.79158L9.192 9.59368M12 6.04842L8.7645 5.79158L7.5 3L6.2355 5.79158L3 6.04842L5.4525 8.04L4.719 11L7.5 9.42947L10.281 11L9.543 8.04L12 6.04842Z"
      fill="#F5F5F5"
    />
  </svg>
);

const FavouriteImage = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7.5" cy="7.5" r="7.5" fill="#2F2F2F" fillOpacity="0.8" />
    <path
      d="M7.5 9.42947L10.281 11L9.543 8.04L12 6.04842L8.7645 5.78737L7.5 3L6.2355 5.78737L3 6.04842L5.4525 8.04L4.719 11L7.5 9.42947Z"
      fill="#FFE032"
    />
  </svg>
);

function UploadPhotosModal({
  showModal,
  dismissFunc,
  loadData,
  setSummaryLoading,
  spotId,
  data,
}) {
  const {
    disabled,
    inputText,
    handleFileChange,
    files,
    favouriteImage,
    setFavouriteImage,
    deleteImage,
    saveHandler,
    fileInputRef,
    handleDrop,
  } = useUploadPhotosModal(
    dismissFunc,
    loadData,
    setSummaryLoading,
    spotId,
    data
  );

  return (
    <Modal
      isOpen={showModal}
      style={{
        maxWidth: "1000px",
      }}
      centered
      size="auto"
      className="uploadPhotosModal"
    >
      <ModalHeader
        toggle={dismissFunc}
        className={`border-0 ${styles.modalTitle}`}
      >
        Adicionar Imagens
      </ModalHeader>
      {
        <div className="dropzone-box">
          <div style={{ paddingInline: 10 }}>
            <div
              style={{
                padding: 4,
                marginInline: 10,
                marginBlock: 5,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span className={styles.addPhotoIcon}>
                <AddPhotoAlternateOutlined />
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 10,
                  color: "#777777",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Imagens
                </span>
                <span
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "300",
                    fontSize: "12px",
                  }}
                >
                  JPG, JPEG - 4 MB
                </span>
              </div>
            </div>
            <div className={styles.formContainer}>
              <div
                style={{
                  border: "dashed #156284",
                  borderRadius: "10px",
                  borderWidth: "thin",
                  display: "grid",
                  alignItems: "center",
                  justifyItems: "center",
                  alignContent: "center",
                  position: "relative",
                }}
                className={`${styles.imageInputContainer} ${
                  styles.cameraInput
                } ${disabled ? styles.disabledInput : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <AddAPhotoRounded
                  style={{
                    color: disabled ? "#CCCCCC" : "#156284",
                    fontSize: 100,
                    marginBottom: "20px",
                  }}
                />
                <span
                  className={`${styles.inputMainText} ${
                    disabled ? styles.disabledInput : ""
                  }`}
                >
                  Tirar foto agora
                </span>
                <span
                  className={`${styles.inputLinkText} ${
                    disabled ? styles.disabledInput : ""
                  }`}
                >
                  Abrir câmera do dispositivo
                </span>
                <input
                  type="file"
                  id="upload-file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  name="uploaded-file"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    width: "100%",
                  }}
                  disabled={disabled}
                  ref={fileInputRef}
                  className={`${disabled ? styles.disabledInput : ""}`}
                  capture="camera"
                />
              </div>
              <div
                style={{
                  border: "dashed #156284",
                  borderRadius: "10px",
                  borderWidth: "thin",
                  display: "grid",
                  alignItems: "center",
                  justifyItems: "center",
                  alignContent: "center",
                  position: "relative",
                }}
                className={`${styles.imageInputContainer} ${
                  disabled ? styles.disabledInput : ""
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <AddPhotoAlternateOutlined
                  style={{
                    color: disabled ? "#CCCCCC" : "#156284",
                    fontSize: 100,
                    marginBottom: "20px",
                  }}
                />
                <span
                  className={`${styles.inputMainText} ${
                    disabled ? styles.disabledInput : ""
                  }`}
                >
                  {inputText}
                </span>
                <span
                  className={`${styles.inputLinkText} ${
                    disabled ? styles.disabledInput : ""
                  }`}
                >
                  Procurar no seu dispositivo
                </span>
                <input
                  type="file"
                  id="upload-file"
                  accept=".jpg, .jpeg"
                  multiple
                  onChange={handleFileChange}
                  name="uploaded-file"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    width: "100%",
                  }}
                  disabled={disabled}
                  ref={fileInputRef}
                  className={`${disabled ? styles.disabledInput : ""}`}
                />
              </div>
              <div className={styles.selectedImages}>
                {files?.map((image, idx) => {
                  return (
                    <div className={`${styles.imageSpot} ${styles.withImage}`}>
                      {idx === favouriteImage ? (
                        <span
                          onClick={() => setFavouriteImage(null)}
                          style={{ position: "absolute", left: 3, top: 2 }}
                        >
                          <FavouriteImage />
                        </span>
                      ) : (
                        <span
                          onClick={() => setFavouriteImage(idx)}
                          style={{ position: "absolute", left: 3, top: 2 }}
                        >
                          <StarImage />
                        </span>
                      )}
                      <span
                        onClick={() => deleteImage(idx)}
                        style={{ position: "absolute", right: 3, top: 2 }}
                      >
                        <Ximage />
                      </span>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          aspectRatio: 1,
                        }}
                        src={image}
                        alt="uploadedImage"
                      />
                    </div>
                  );
                })}
                <PhotosSpots
                  num={
                    files
                      ? 5 - data.spot_images.length - files?.length
                      : 5 - data.spot_images.length
                  }
                />
              </div>
            </div>
            <ModalFooter
              className="border-0"
              style={{
                alignItens: "center",
                justifyContent: "space-between",
                paddingBottom: "20px",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <HelpOutline style={{ fontSize: 20, color: "#156284" }} />
                <span className={`${styles.supportText}`}>
                  Em caso de dúvidas contate nosso{" "}
                  <a
                    style={{
                      textDecorationLine: "underline",
                      color: "#1D6D8B",
                    }}
                    href="#"
                    onClick={blockExternalLink}
                  >
                    Suporte
                  </a>
                </span>
              </div>
              <button
                className={`rounded-button ${styles.saveButton}`}
                onClick={() => {
                  saveHandler();
                }}
              >
                Salvar
              </button>
            </ModalFooter>
          </div>
        </div>
      }
    </Modal>
  );
}

const PhotosSpots = ({ num }) => {
  let spotsList = [];
  for (num; num > 0; num--) {
    spotsList.push(<div className={styles.imageSpot}></div>);
  }
  return <>{spotsList}</>;
};

export default UploadPhotosModal;
