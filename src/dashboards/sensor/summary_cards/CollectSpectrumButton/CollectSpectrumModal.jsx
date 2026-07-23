import React from "react";
import { Modal } from "reactstrap";
import styles from "./styles/CollectSpectrumModal.module.css";
import { CloseRounded } from "@mui/icons-material";
import useCollectSpectrumModal from "./hooks/useCollectSpectrumModal";
import { ComponentLoader } from "../../../../components";
import ReceiveNotificationTooltip from "./ReceiveNotificationInput";

function CollectSpectrumModal({
  showModal,
  toggleModal,
  spotId,
  sensorConnection,
}) {
  const {
    receiveNotification,
    handleReceiveNotification,
    lastInstantSpectrum,
    loading,
    canInstantCollect,
    formatDateForDatetimeLocal,
    selectedNodeFullPath,
    formatPath,
    userPhone,
    handleCollectSpectrum,
  } = useCollectSpectrumModal(spotId, showModal, toggleModal);

  return (
    <>
      <Modal backdrop isOpen={showModal} toggle={toggleModal} centered>
        <div className={styles.modalContainer}>
          <>
            {(loading || userPhone === null) && (
              <ComponentLoader customStyle={{ backgroundColor: "#fff", borderRadius: "5px" }} />
            )}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Coletar espectro agora</h3>
              <CloseRounded onClick={toggleModal} />
            </div>
            <hr className={styles.modalLine} />
            <div className={styles.modalBody}>
              {sensorConnection !== "connected" ? (
                <div className={styles.description}>
                  <p className={styles.boldedText}>
                    O sensor está desconectado no momento. Aguarde até que a
                    conexão seja reestabelecida para poder solicitar a coleta.
                  </p>
                </div>
              ) : canInstantCollect ? (
                <>
                  <div className={styles.description}>
                    <p className={styles.boldedText}>
                      Em alguns instantes será realizada uma coleta de espectro.
                    </p>
                    <p className={styles.boldedText}>
                      Os dados desta coleta levarão alguns minutos para serem
                      entregues na plataforma, dependendo da qualidade de
                      conexão do gateway e do sensor.
                    </p>
                  </div>
                  <ReceiveNotificationTooltip userPhone={userPhone}>
                    <div
                      className={`${styles.notification} ${
                        !userPhone ? styles.noUserPhone : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="receiveNotification"
                        checked={receiveNotification}
                        onChange={handleReceiveNotification}
                        disabled={!userPhone}
                      />
                      <label htmlFor="receiveNotification">
                        Receber uma mensagem de confirmação no WhatsApp no
                        momento em que o envio dos dados desta coleta for
                        finalizado?{" "}
                        {userPhone && (
                          <span>(Número cadastrado: {userPhone})</span>
                        )}
                      </label>
                    </div>
                  </ReceiveNotificationTooltip>
                </>
              ) : (
                <>
                  <div className={styles.description}>
                    <p className={styles.boldedText}>
                      Uma solicitação de coleta já foi realizada neste sensor
                      recentemente.
                    </p>
                    <div>
                      <p className={styles.boldedText}>Última solicitação:</p>
                      <p>
                        {lastInstantSpectrum.name} -{" "}
                        {formatDateForDatetimeLocal(
                          new Date(lastInstantSpectrum.last_instant_collect)
                        )}
                      </p>
                    </div>
                    <p className={styles.boldedText}>
                      Aguarde 1 hora após a última solicitação para solicitar
                      novamente.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              {canInstantCollect && sensorConnection === "connected" ? (
                <>
                  <button className={styles.cancelButton} onClick={toggleModal}>
                    Cancelar
                  </button>
                  <button
                    className={styles.confirmButton}
                    onClick={!loading && handleCollectSpectrum}
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.confirmButton}
                    onClick={toggleModal}
                  >
                    OK
                  </button>
                </>
              )}
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}

export default CollectSpectrumModal;
