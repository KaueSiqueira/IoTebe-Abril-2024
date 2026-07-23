import React from "react";
import DiagnosticCompleted from "./DiagnosticCompleted";
import useDiagnosticCardCompleted from "../../../hooks/Diagnostic/useDiagnosticCardCompleted";

export default function DiagnosticCardCompleted({
  card,
  failureExpanded,
  setFailureExpanded,
  sendChartIds,
  diagnosticExpanded,
  setDiagnosticExpanded,
  scrollMobile
}) {
  const {
    author,
    cardColor,
    observation,
    relatedFailures,
    cardInfo,
    cardStatus,
  } = useDiagnosticCardCompleted(card);

  return (
    <>
    <div
      className="diagnosticCard"
      style={
      {
        backgroundColor: "#FAFAFA",
        padding: window.innerWidth < 700 ? "5px 7.5px" : "0px",
        minWidth: window.innerWidth < 700 && (scrollMobile ? "88%" : "100%")
      }}
    >
      <div className="diagnosticCardFailures" style={{padding: 4}}>
          <DiagnosticCompleted
            author={author}
            cardColor={cardColor}
            observation={observation}
            failure={relatedFailures}
            failureExpanded={failureExpanded}
            setFailureExpanded={setFailureExpanded}
            info={cardInfo}
            sendChartIds={sendChartIds}
            diagnosticExpanded={diagnosticExpanded}
            setDiagnosticExpanded={setDiagnosticExpanded}
            cardStatus={cardStatus}
          />
        </div>
      </div>
    </>
  );
}
