import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";


function OptionsModal({
  showModal,
  toggleModal,
  title,
  style,
  children,
  dismissFunc,
  className,
  onDismissTitle,
  disabledConfirm = false,
  onConfirm,
  onConfirmTitle,
}) {
  return (
    <Modal isOpen={showModal} toggle={toggleModal} style={style} className={className} centered>
      {title && (
        <ModalHeader toggle={toggleModal} style={{ textAlign: "center", fontSize: "20px", fontWeight: 700 }}>
          {title}
        </ModalHeader>
      )}
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
}

export default OptionsModal;
