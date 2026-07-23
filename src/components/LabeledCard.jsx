import React, { useState } from "react";
import styled from "styled-components";
import InfoModal from "./InfoModal";

import { Info } from "@mui/icons-material";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100px;
  background-color: white;
  border-radius: 10px;
  -webkit-box-shadow: 1px 1px 5px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 1px 1px 5px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 1px 1px 5px 0px rgba(50, 50, 50, 0.75);
`;

const CardLabel = styled.div`
  display: flex;
  column-gap: 5px;
  width: 100%;
  height: min-content;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border-radius: 10px 10px 0px 0px;
  padding: 4px;
  background-color: #156284;
`;

function LabeledCard(props) {
  const [infoModal, setInfoModal] = useState(false);
  return (
    <div
      className={props.className}
      style={{ padding: 5, height: props.height, minHeight: props.minHeight, ...props.style }}
    >
      <CardContainer>
        <CardLabel>
          {props.icon}
          <p style={{ margin: 0, lineHeight: "normal" }}>{props.title}</p>
          {!!props.info && (
            <div
              className="area-click-tooltip"
              onMouseEnter={() => {
                setInfoModal(true);
              }}
              onMouseLeave={() => {
                setInfoModal(false);
              }}
            >
              <Info
                style={{ width: "14px", height: "14px" }}
                className="info__button"
              />
            </div>
          )}
        </CardLabel>
        {!!props.info && (
          <InfoModal show={infoModal} infoImage={props.info.image}>
            {<props.info.message />}
          </InfoModal>
        )}
        <div className={props.childrenClassName} style={{ padding: 5, overflow: "hidden" }}>{props.children}</div>
      </CardContainer>
    </div>
  );
}

export default LabeledCard;
