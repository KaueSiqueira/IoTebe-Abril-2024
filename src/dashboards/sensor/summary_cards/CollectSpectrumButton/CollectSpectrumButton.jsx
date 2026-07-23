import React from "react";
import styles from "./styles/CollectSpectrumButton.module.css";
import useCollectSpectrumButton from "./hooks/useCollectSpectrumButton";
import CollectSpectrumModal from "./CollectSpectrumModal";

const CollectSpectrumButton = ({ spotId, sensorConnection }) => {
  const { openModal, handleModal } = useCollectSpectrumButton();

  return (
    <>
      <button className={styles.collectButton} onClick={handleModal}>
        Coletar espectro agora
      </button>

      <CollectSpectrumModal
        showModal={openModal}
        toggleModal={handleModal}
        spotId={spotId}
        sensorConnection={sensorConnection}
      />
    </>
  );
};

export default CollectSpectrumButton;
