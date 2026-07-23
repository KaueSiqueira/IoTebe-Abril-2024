import React from "react";
import styles from "./styles/SpotImagesModal.module.css";
import { Backdrop, Fade, Modal } from "@material-ui/core";
import {
  NavigateNextRounded,
  NavigateBeforeRounded,
  FullscreenExit,
  AddPhotoAlternateOutlined,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import { ComponentLoader, IoTebeModal } from "../../../../components";
import useSpotImagesModal from "./hooks/useSpotImagesModal";
import { ProtectedFeature } from "../../../../components/ProtectedFeature/ProtectedFeature";

const convertTypeBearing = {
  ROLLING: "Rolamento",
  SLEEVE: "Deslizamento",
  OTHER: "Outros",
};

const SpotImagesModal = ({
  machineType,
  bearingType,
  rotationSpeed,
  data,
  imagesModal,
  setImagesModal,
  handleClose,
  setUploadImagesModal,
  loadData,
}) => {
  const {
    selectedNode,
    images,
    activeCarouselItem,
    deleteModal,
    handleCarouselItem,
    handleNextItem,
    handlePreviousItem,
    handleDeleteModal,
    addImage,
    deleteImage,
    deletingImage,
  } = useSpotImagesModal(
    data,
    imagesModal,
    setImagesModal,
    setUploadImagesModal,
    loadData
  );

  return (
    <>
      <Modal
        className={styles.modalContainer}
        open={imagesModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={imagesModal}>
          <div className={styles.imageContainer}>
            <div
              className={`${styles.currentImage} ${
                !images[activeCarouselItem] ? "chart-loading-animation" : ""
              }`}
            >
              {images[activeCarouselItem] && (
                <>
                  <div className={styles.backgroundImage}>
                    <img
                      src={`data:image/jpeg;base64,${images[activeCarouselItem]?.image}`}
                      alt="Machine"
                    />
                  </div>
                  <div className={styles.frontImage}>
                    <img
                      src={`data:image/jpeg;base64,${images[activeCarouselItem]?.image}`}
                      alt="Machine"
                    />
                  </div>
                </>
              )}
              <div className={styles.currentImageFooter}>
                <div className={styles.spotName}>{selectedNode.title}</div>
                <div className={styles.machineInfo}>
                  Máquina:{" "}
                  {machineType === null || machineType === "" || !machineType
                    ? "--"
                    : machineType}{" "}
                  - Mancal:{" "}
                  {bearingType === null || bearingType === ""
                    ? "--"
                    : convertTypeBearing[bearingType]}{" "}
                  - Rotação:{" "}
                  {rotationSpeed === null ? "--" : `${rotationSpeed}`} RPM
                </div>
              </div>
              {images.length > 1 && (
                <>
                  <div
                    className={styles.leftArrow}
                    onClick={handlePreviousItem}
                  >
                    <NavigateBeforeRounded />
                  </div>
                  <div className={styles.rightArrow} onClick={handleNextItem}>
                    <NavigateNextRounded />
                  </div>
                </>
              )}
              <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
                <div
                  className={`${styles.floatButtonContainer} ${styles.leftFloat}`}
                >
                  <div
                    onClick={handleDeleteModal}
                    className={`${styles.floatButton} ${styles.deleteButton}`}
                  >
                    <DeleteOutlineRounded />
                  </div>
                </div>
              </ProtectedFeature>
              <div
                className={`${styles.floatButtonContainer} ${styles.rightFloat}`}
              >
                <div onClick={handleClose} className={`${styles.floatButton}`}>
                  <FullscreenExit /> Minimizar
                </div>
              </div>
            </div>
            <div className={styles.imageCarousel}>
              {images.map((image, index) => (
                <div
                  className={`${styles.carouselItem} ${
                    activeCarouselItem === index ? styles.activeItem : ""
                  } ${!image ? "chart-loading-animation" : ""}`}
                  onClick={() => {
                    handleCarouselItem(index);
                  }}
                >
                  {image?.image && (
                    <img
                      src={`data:image/jpeg;base64,${image?.image}`}
                      alt="Machine"
                    />
                  )}
                </div>
              ))}
              <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
                {images.length < 5 && (
                  <div
                    className={`${styles.carouselItem} ${styles.addImage}`}
                    onClick={addImage}
                  >
                    <AddPhotoAlternateOutlined />
                    <p>
                      Adicionar
                      <br />
                      Imagem
                    </p>
                  </div>
                )}
              </ProtectedFeature>
            </div>
          </div>
        </Fade>
      </Modal>

      <IoTebeModal
        showModal={deleteModal && imagesModal}
        changeMarginBottom={"35px"}
        title="Tem certeza que deseja remover esta imagem?"
        onConfirmTitle="Confirmar"
        onDismissTitle="Cancelar"
        children={
          <>
            Após a exclusão, a imagem não será mais exibida no resumo do ponto.
            {deletingImage && (
              <ComponentLoader
                customStyle={{ position: "fixed", top: 0, left: 0 }}
              />
            )}
          </>
        }
        dismissFunc={handleDeleteModal}
        onConfirm={() => {
          deleteImage(activeCarouselItem, images[activeCarouselItem].imageId);
        }}
        zIndex={1301}
      />
    </>
  );
};

export default SpotImagesModal;
