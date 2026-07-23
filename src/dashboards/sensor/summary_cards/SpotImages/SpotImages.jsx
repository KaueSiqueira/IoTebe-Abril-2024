import {
  AddPhotoAlternateOutlined,
  Fullscreen,
  NavigateBeforeRounded,
  NavigateNextRounded,
  StarBorderRounded,
  StarRounded,
} from "@mui/icons-material";
import React from "react";
import styles from "./styles/SpotImages.module.css";
import useSpotImages from "./hooks/useSpotImages";
import { ProtectedFeature } from "../../../../components/ProtectedFeature/ProtectedFeature";

const SpotImages = ({
  data,
  machineImg,
  setIsModalOpen,
  handleOpenImagesModal,
  spotId,
  setSummaryLoading,
  summaryLoading,
  loadData,
}) => {
  const {
    images,
    activeCarouselItem,
    handlePreviousItem,
    handleNextItem,
    handleFavorite,
  } = useSpotImages(data, spotId, setSummaryLoading, loadData);

  return (
    <>
      {data?.spot_images?.length > 0 ? (
        <>
          <div
            className={`width-90p rowConfig ${styles.spotImagesContainer} ${styles.withImages}`}
          >
            {images[activeCarouselItem] ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${images[activeCarouselItem].image}`}
                  alt="Machine"
                />
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
                <button
                  className={`${styles.maxButton}`}
                  onClick={handleOpenImagesModal}
                >
                  <Fullscreen />
                  <span>&nbsp;&nbsp;Maximizar</span>
                </button>

                <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
                  <button
                    className={`${styles.favButton}`}
                    onClick={handleFavorite}
                  >
                    {images[activeCarouselItem]?.isFavorite ? (
                      <StarRounded className={styles.favIcon} />
                    ) : (
                      <StarBorderRounded />
                    )}
                  </button>
                </ProtectedFeature>

                <div className={styles.itemCircles}>
                  {images.map((image, index) => (
                    <span
                      className={`${
                        activeCarouselItem === index
                          ? styles.activeItemCircle
                          : ""
                      }`}
                    ></span>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-loading-animation"></div>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className={`width-90p rowConfig ${styles.spotImagesContainer} ${
              summaryLoading ? styles.withImages : ""
            }`}
          >
            {!summaryLoading ? (
              <>
                <img src={machineImg} alt="Machine" />
                <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
                  <button
                    className={`${styles.addImageButton}`}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <AddPhotoAlternateOutlined />
                    <span>&nbsp;&nbsp;Adicionar Imagem</span>
                  </button>
                </ProtectedFeature>
              </>
            ) : (
              <div className="chart-loading-animation"></div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SpotImages;
