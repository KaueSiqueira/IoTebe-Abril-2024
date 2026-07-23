import React from "react";
import { Modal } from "reactstrap";
import ComponentLoader from "./ComponentLoader";

const ModalLoader = () => {
  return (
    <Modal isOpen={true} centered className="modal-loader">
      <ComponentLoader />
    </Modal>
  );
};

export default ModalLoader;
