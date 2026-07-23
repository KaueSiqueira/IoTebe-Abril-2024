import React from "react";
import useDiagnosticCompleted from "../../../hooks/Diagnostic/useDiagnosticCompleted";
import Clock from "../../../assets/customIcons/Clock";
import { Chat, DoneAll, Build, Feedback, HighlightOffRounded } from "@mui/icons-material";

export default function DiagnosticCompleted({
  failure,
  failureExpanded,
  setFailureExpanded,
  cardColor,
  author,
  observation,
  info,
  sendChartIds,
  diagnosticExpanded,
  setDiagnosticExpanded,
  cardStatus
}) {
  const {
    formattedFailure,
    causes,
    mouseHover,
    setMouseHover,
    diagnosticTime,
    plannedTime,
    transition,
    changeTransition,
    transitionButton,
    changeSelectedFailure,
    wasEffective,
    mobileHistoric
  } = useDiagnosticCompleted(
    failure,
    failureExpanded,
    setFailureExpanded,
    info,
    sendChartIds,
    diagnosticExpanded,
    setDiagnosticExpanded,
    cardStatus,
    author,
    observation,
    cardColor
  );

  return (
    <>
      <div
        className="diagnosticFailure"
        style={{
          borderLeft: `10px solid ${cardColor}`,
          cursor: transition === "transition_collapse" && "pointer",
          padding: 0,
          backgroundColor: window.innerWidth < 700 && mobileHistoric?.formattedFailure === formattedFailure && "#F5F5F5"
        }}
        onMouseEnter={() => {
          setMouseHover(true);
        }}
        onMouseLeave={() => {
          setMouseHover(false);
        }}
        onClick={() => window.innerWidth > 700 ? transitionButton === "Expandir" && changeTransition() : changeTransition()}
      >
        <div
          className="diagnosticCompletedHeader"
          style={{ padding: "12px 12px 0 12px" }}
        >
          {wasEffective ? <Clock /> : <HighlightOffRounded style={{height: 20, width: 20}} />}
          <p>
            {!wasEffective ? "Alarme não efetivo" : causes.length !== 0
              ? causes.map((failure, idx) => (idx !== 0 ? ", " : "") + failure)
              : formattedFailure.map(
                  (failure, idx) => (idx !== 0 ? ", " : "") + failure?.title
                )}
          </p>
        </div>

        <div className="diagnosticFailureBody">
          <div
            className="diagnosticFailureInfo"
            style={{
              fontStyle: "italic",
              fontSize: 11,
              justifyContent: "flex-end",
              paddingRight: 12,
            }}
          >
            <p>
              {new Date(diagnosticTime?.start * 1000).toLocaleDateString(
                "pt-BR"
              ) +
                " - " +
                new Date(diagnosticTime?.end * 1000).toLocaleDateString(
                  "pt-BR"
                )}
            </p>
          </div>
          <div className={`diagnosticCompletedDetails ${transition}`} style={{display: window.innerWidth < 700 && "none"}}>
            <div>
              <ul>
                <li key={"close"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${transition}`} style={{height: 120}}/>
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
                  <div className={`vl ${transition}`} style={{height: 140}}/>
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
                {causes.length !== 0 && <li key={"cause"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${transition}`} style={{height: 125 + (causes.length * 15)}}/>
                  <div className="diagnosticFailureIcon">
                    <Feedback style={{ padding: "1px 4px" }} />
                  </div>
                  <p>
                    <b>{author}</b> definiu a causa do alarme como "{causes.map((failure, idx) => (idx !== 0 ? ", " : "") + (failure === "Outros" ? `Outros (${info?.other_cause})` : failure))}"
                    <i><br />
                      {new Date(diagnosticTime?.end*1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </i>
                  </p>
                </li>}
                {plannedTime && <li key={"plan"} style={{ paddingInline: 12 }}>
                  <div className={`vl ${transition}`} style={{height: 120}}/>
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
                {formattedFailure.map((failure, idx) => (
                  idx + 1 !== formattedFailure.length ?
                  (<li key={"falha" + idx} className={`closedFailure ${failure.title + idx === failureExpanded ? "selectedCloseFailure" : ""}`} style={{ paddingLeft: 12 }}>
                    <div className={`vl ${transition}`} />
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
                  (<li style={{ height: "70px", paddingLeft: 12 }} key={"falha" + idx} className={`closedFailure ${failure.title + idx === failureExpanded ? "selectedCloseFailure" : ""}`}>
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

        <div className="diagnosticFailureFooter" style={{ padding: "0 12px 12px 12px", height: window.innerWidth < 700 && 14}}>
          <p
            style={{ textDecoration: mouseHover ? "underline" : "none" }}
            onMouseEnter={() => {
              setMouseHover(true);
            }}
            onMouseLeave={() => {
              setMouseHover(false);
            }}
            onClick={() => {
              transition === "transition_expand" && changeTransition();
            }}
          >
            {window.innerWidth > 700 && transitionButton}
          </p>
        </div>
      </div>
    </>
  );
}
