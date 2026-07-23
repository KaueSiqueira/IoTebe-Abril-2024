import React from "react";

function InfoModal(props) {
  return (
    <div
      id="modal"
      className="info-modal"
      style={{
        display: props.show ? "block" : "none",
        left: !!props.x ? props.x + "px" : "50%",
        top: !!props.y ? props.y + "px" : "50%",
      }}
    >
      {!!props.children && props.children}
      {/* Inserir GIF Modal */}
      {!!props.infoImage && (
        <img
          style={{ width: "100%" }}
          src={props.infoImage}
          alt="Gif ensinando como arrastar o ponto de coleta"
        />
      )}
    </div>
  );
}

export default InfoModal;
