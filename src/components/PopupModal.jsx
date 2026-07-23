import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "./"


function PopupModal({
  showModal,
  toggleModal,
  title,
  style,
  children,
  dismissFunc,
  onDismissTitle,
  disabledConfirm = false,
  onConfirm,
  onConfirmTitle,
}) {
  return (
    <Modal isOpen={showModal} toggle={toggleModal} style={style} centered>
      {title && (
        <ModalHeader toggle={toggleModal}>
          {title}
        </ModalHeader>
      )}
      <ModalBody>{children}</ModalBody>

      {(onDismissTitle || onConfirm) && (
        <ModalFooter
          style={{
            height: 60,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {onDismissTitle && (
            <Button cancel={true} onClick={dismissFunc || toggleModal} className="rounded-button-outlined"> 
              {onDismissTitle}
            </Button>
          )}

          {onConfirm && (
            <Button disabled={disabledConfirm} onClick={onConfirm} className="rounded-button">
              {onConfirmTitle}
            </Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
}

export default PopupModal;
