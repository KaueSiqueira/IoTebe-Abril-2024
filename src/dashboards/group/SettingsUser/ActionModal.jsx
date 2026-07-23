import React from "react";
import { Modal } from "reactstrap";
import styles from "./styles/ActionModal.module.css";
import { CloseRounded } from "@mui/icons-material";

function ActionModal({
  showModal,
  toggleModal,
  onConfirm,
  title,
  bodyText,
  confirmButtonText = "Confirmar",
  dismissButton = true,
  modalLine = true,
  subTitle,
  bodyContent,
  centeredFooter = false,
  size,
}) {
  return (
    <>
      <Modal
        backdrop
        isOpen={showModal}
        toggle={toggleModal}
        centered
        contentClassName={styles.modalContent}
        className={`${styles.modal} ${size && styles[size]}`}
      >
        <div className={styles.modalContainer}>
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerRow}>
                <h3 className={styles.modalTitle}>{title}</h3>
                <CloseRounded onClick={toggleModal} />
              </div>
              {subTitle && (
                <div className={styles.headerRow}>
                  <h5 className={styles.modalSubTitle}>{subTitle}</h5>
                </div>
              )}
            </div>
            {modalLine && <hr className={styles.modalLine} />}
            <div className={styles.modalBody}>
              {bodyText && (
                <div className={styles.description}>
                  <p className={styles.boldedText}>{bodyText}</p>
                </div>
              )}
              {bodyContent && (
                <div className={styles.description}>{bodyContent}</div>
              )}
            </div>
            <div
              className={`${styles.modalFooter} ${
                centeredFooter && styles.centered
              }`}
            >
              {dismissButton && (
                <button className={styles.cancelButton} onClick={toggleModal}>
                  Cancelar
                </button>
              )}
              <button className={styles.confirmButton} onClick={onConfirm}>
                {confirmButtonText}
              </button>
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}

export default ActionModal;
