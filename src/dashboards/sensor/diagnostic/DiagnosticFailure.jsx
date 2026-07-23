import React from "react";
import useDiagnosticFailures from "../../../hooks/Diagnostic/useDiagnosticFailures";

export default function DiagnosticFailure({
  failure,
  failureExpanded,
  setFailureExpanded,
  machineInfo,
  onlyOne,
}) {
  const {
    formattedFailure,
    mouseHover,
    setMouseHover,
    alarmedTime,
    alarmColor,
    disruption,
    transition,
    changeTransition,
    transitionButton,
    description,
    recommendations,
    mobileDescription
  } = useDiagnosticFailures(
    failure,
    failureExpanded,
    setFailureExpanded,
    machineInfo,
    onlyOne
  );

  return (
    <>
      <div
        className="diagnosticFailure"
        style={{
          borderLeft: `10px solid ${alarmColor}`,
          cursor: transitionButton === "Expandir" ? "pointer" : "auto",
          minWidth: window.innerWidth < 700 && "93%",
          backgroundColor: window.innerWidth < 700 && mobileDescription?.description === description && "#FAFAFA"
        }}
        onMouseEnter={() => {
          setMouseHover(true);
        }}
        onMouseLeave={() => {
          setMouseHover(false);
        }}
        onClick={() => window.innerWidth > 700 ? transitionButton === "Expandir" && changeTransition() : changeTransition()}
      >
        <div className="diagnosticFailureHeader">
          {formattedFailure?.icon}
          <p>{formattedFailure?.title}</p>
        </div>

        <div className="diagnosticFailureBody">
          <div className="diagnosticFailureInfo">
            <p>rompimento: {disruption}%</p>
            <p>{alarmedTime}</p>
          </div>
          {window.innerWidth > 700 && 
          <div className={`diagnosticFailureDetails ${transition}`}>
            <div>
              <p>Descrição</p>
              <span>{description}</span>
            </div>
            {recommendations?.length > 0 && (
              <div>
                <p>Recomendações</p>

                <ul>
                  {recommendations.map((element) => {
                    return <li key={description + element}>{element}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>}
        </div>

        <div className="diagnosticFailureFooter" style={{height: window.innerWidth < 700 && 14}}>
          <p
            onClick={() => {
              transitionButton === "Fechar" && changeTransition();
            }}
            style={
              transitionButton === "Expandir" && mouseHover
                ? { textDecoration: "underline" }
                : {}
            }
          >
            {window.innerWidth > 700 && transitionButton}
          </p>
        </div>
      </div>
    </>
  );
}
