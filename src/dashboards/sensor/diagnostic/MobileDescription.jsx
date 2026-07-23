import React from "react";
import useMobileDescription from "../../../hooks/Diagnostic/useMobileDescription";

export default function MobileDescription() {
  const {
    show,
    description,
    recommendations,
    alarmColor,
    closeDescription,
    setMobileDescription,
    loading
  } = useMobileDescription();

  return (
    <div 
      className="diagnosticCard" 
      style={{
        backgroundColor: "#FAFAFA", width: "calc(100% - 30px)", alignSelf: "center", padding: 0, marginBottom: show && 4, display: description && loading && "none"
      }}>
      <div
        className={`diagnosticFailure ${show ? "transition_expand" : "transition_collapse"}`}
        style={{
          borderLeft: `10px solid ${alarmColor}`,
        }}
      >
        <div className="diagnosticFailureBody">
          <div className={`diagnosticFailureDetails ${show ? "transition_expand" : "transition_collapse"}`} style={{paddingTop: 0}}>
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
          </div>
        </div>
        <div className="diagnosticFailureFooter">
          <p
            onClick={() => {closeDescription(); setMobileDescription({})}}
            style={{cursor: "pointer", display: !show && "none"}}
          >
            Fechar
          </p>
        </div>
      </div>
    </div>
  );
}
