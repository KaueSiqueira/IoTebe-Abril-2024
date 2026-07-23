import React from "react";
import useMobileHistoric from "../../../hooks/Diagnostic/useMobileHistoric";
import { Chat, DoneAll, Build, Feedback, HighlightOffRounded } from "@mui/icons-material";

export default function MobileHistoric({

}) {
  const {
    formattedFailure,
    causes,
    diagnosticTime,
    plannedTime,
    wasEffective,
    show,
    alarmColor,
    closeDescription,
    setMobileHistoric,
    author,
    observation,
    otherCause,
    loading,
    showMobileHistoric,
    failureExpanded,
    changeSelectedFailure
  } = useMobileHistoric();

  return (
    <div className="diagnosticCard" style={{backgroundColor: "#FAFAFA", width: "calc(100% - 30px)", alignSelf: "center", padding: 0, marginBottom: show && 4, display: !show && "none",}}>
      <div
        className={`diagnosticFailure ${show ? "transition_expand" : "transition_collapse"}`}
        style={{
          borderLeft: `10px solid ${alarmColor}`,
          padding: 0,
          display: loading && showMobileHistoric && formattedFailure?.length > 0 && "none",
          width: "90%"
        }}
      >
        <div className="diagnosticFailureBody">
          <div className={`diagnosticCompletedDetails ${show ? "transition_expand" : "transition_collapse"}`} style={{paddingBottom: 3}}>
            <div>
              <ul>
                <li key={"close"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${show ? "transition_expand" : "transition_collapse"}`} />
                  <div className="diagnosticFailureIcon">
                    {wasEffective ? <DoneAll style={{ padding: "1px 4px" }} /> : <HighlightOffRounded style={{ padding: "1px 4px" }} />}
                  </div>
                  <p>
                    <b>{author}</b> marcou o alarme como {wasEffective ? '"concluído"' : '"Não efetivo"'}
                    <i>
                      <br />
                      {new Date(diagnosticTime?.end * 1000).toLocaleString(
                        "pt-BR",
                        { dateStyle: "long", timeStyle: "short" }
                      )}
                    </i>
                  </p>
                </li>
                {observation && <li key={"obs"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${show ? "transition_expand" : "transition_collapse"}`} />
                  <div className="diagnosticFailureIcon" style={{ paddingLeft: 1 }}>
                    <Chat style={{ padding: 4 }} />
                  </div>
                  <p>
                    <b>{author}</b> fez uma observação <br />
                    <i>{observation} <br />
                      {new Date(diagnosticTime?.end*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </i>
                  </p>
                </li>}
                {causes?.length !== 0 && <li key={"cause"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${show ? "transition_expand" : "transition_collapse"}`} />
                  <div className="diagnosticFailureIcon">
                    <Feedback style={{ padding: "1px 4px" }} />
                  </div>
                  <p>
                    <b>{author}</b> definiu a causa do alarme como "{causes?.map((failure, idx) => (idx !== 0 ? ", " : "") + (failure === "Outros" ? `Outros (${otherCause})` : failure))}"
                    <i><br />
                      {new Date(diagnosticTime?.end*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </i>
                  </p>
                </li>}
                {plannedTime && <li key={"plan"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${show ? "transition_expand" : "transition_collapse"}`} />
                  <div className="diagnosticFailureIcon">
                    <Build style={{ padding: "1px 4px" }} />
                  </div>
                  <p>
                    <b>{author}</b> indicou Intervenção Planejada
                    <i><br />
                      {new Date(plannedTime*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </i>
                  </p>
                </li>}
                {formattedFailure?.map((failure, idx) => (
                  idx + 1 !== formattedFailure.length ?
                  (<li key={"falha" + idx} className={`closedFailure ${failure.title + idx === failureExpanded ? "selectedCloseFailure" : ""}`} style={{ paddingLeft: 12 }}>
                    <div className={`vl ${show ? "transition_expand" : "transition_collapse"}`} />
                    <div className="diagnosticFailureIcon" style={{ padding: "1px 4px" }}>
                      {failure?.icon}
                    </div>
                    <p onClick={() => changeSelectedFailure(failure, idx)}>
                      <b>IoTebe</b> alarmou "<u>{failure?.title}</u>"
                      <i><br />
                        {new Date(failure?.start*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                      </i>
                    </p>
                  </li>) :
                  (<li style={{ height: "35px", paddingLeft: 12 }} key={"falha" + idx} className={`closedFailure ${failure.title + idx === failureExpanded ? "selectedCloseFailure" : ""}`}>
                    <div style={{ marginLeft: 2 }} />
                    <div className="diagnosticFailureIcon" style={{ padding: "1px 4px" }}>
                      {failure?.icon}
                    </div>
                    <p onClick={() => changeSelectedFailure(failure, idx)}>
                      <b>IoTebe</b> alarmou "<u>{failure?.title}</u>"
                      <i><br />
                        {new Date(failure?.start*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                      </i>
                    </p>
                  </li>)
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="diagnosticFailureFooter" style={{ padding: "0 12px 12px 12px" }}>
          <p
            style={{cursor: "pointer", display: !show && "none"}}
            onClick={() => {
              setMobileHistoric({}); closeDescription();
            }}
          >
            Fechar
          </p>
        </div>
      </div>
    </div>
  );
}
