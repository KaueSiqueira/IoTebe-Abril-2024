import React from "react";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import DiagnosticFailure from "./DiagnosticFailure";
import useDiagnosticCard from "../../../hooks/Diagnostic/useDiagnosticCard";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DiagnosticModal from "./DiagnosticModal";
import DiagnosticOptions from "./DiagnosticOptions";
import { ProtectedFeature } from "../../../components/ProtectedFeature/ProtectedFeature";

export default function DiagnosticCard({
  card,
  machineInfo,
  failureExpanded,
  setFailureExpanded,
}) {
  const {
    isPlannedIntervention,
    isCompleted,
    cardColor,
    relatedFailures,
    feedbackModal,
    setFeedbackModal,
    inProgress,
    hasSensor,
  } = useDiagnosticCard(card);

  return (
    <div
      className="diagnosticCard"
      style={{
        backgroundColor: cardColor,
        gap: 0,
        gridGap: 0,
        padding: window.innerWidth < 700 && "15px 0",
      }}
    >
      <ProtectedFeature requiredPermissions={["MANAGE_DIAGNOSTICS"]}>
        <DiagnosticOptions
          diagnosticId={card.diagnostic_card_id}
          isPlannedIntervention={isPlannedIntervention}
        />
      </ProtectedFeature>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          className="diagnosticCardFailures"
          style={{
            flexDirection: window.innerWidth > 700 ? "column" : "row",
            gap: window.innerWidth < 700 && "10px",
            padding: window.innerWidth < 700 ? "5px 15px" : 4,
          }}
        >
          {relatedFailures?.map((failure, index) => {
            return (
              <DiagnosticFailure
                key={"Failure-" + index.toString()}
                failure={failure}
                failureExpanded={failureExpanded}
                setFailureExpanded={setFailureExpanded}
                machineInfo={machineInfo}
                onlyOne={relatedFailures.length === 1}
              />
            );
          })}
        </div>
        {!isCompleted && (
          <div
            className="diagnosticCardActions"
            style={{
              padding: window.innerWidth < 700 && "0px 15px",
              margin: window.innerWidth < 700 && 0,
            }}
          >
            {(!hasSensor || !inProgress) && (
              <ProtectedFeature requiredPermissions={["COMPLETE_DIAGNOSTICS"]}>
                <button
                  className="diagnosticCardButton"
                  style={{
                    backgroundColor: "#2A86B8",
                    padding: window.innerWidth < 700 && "3px 10px",
                    fontSize: window.innerWidth > 700 && 16,
                  }}
                  onClick={() => {
                    setFeedbackModal((prevState) => !prevState);
                  }}
                >
                  <DoneAllRoundedIcon /> concluir
                </button>
              </ProtectedFeature>
            )}
            {isPlannedIntervention && (
              <div
                className="diagnosticCardTag"
                style={{ fontSize: window.innerWidth > 700 && 14 }}
              >
                <LocalOfferRoundedIcon />
                Intervenção planejada
              </div>
            )}
          </div>
        )}
        {feedbackModal && (
          <DiagnosticModal
            changeModal={feedbackModal}
            setChangeModal={setFeedbackModal}
            diagnosticId={card.diagnostic_card_id}
            isPlannedIntervention={isPlannedIntervention}
          />
        )}
      </div>
    </div>
  );
}
